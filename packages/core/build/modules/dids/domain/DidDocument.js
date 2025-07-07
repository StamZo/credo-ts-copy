"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidDocument = void 0;
exports.findVerificationMethodByKeyType = findVerificationMethodByKeyType;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const error_1 = require("../../../error");
const JsonTransformer_1 = require("../../../utils/JsonTransformer");
const transformers_1 = require("../../../utils/transformers");
const utils_1 = require("../../../utils");
const kms_1 = require("../../kms");
const findMatchingEd25519Key_1 = require("../findMatchingEd25519Key");
const key_type_1 = require("./key-type");
const service_1 = require("./service");
const verificationMethod_1 = require("./verificationMethod");
class DidDocument {
    constructor(options) {
        this.context = ['https://www.w3.org/ns/did/v1'];
        if (options) {
            this.context = options.context ?? this.context;
            this.id = options.id;
            this.alsoKnownAs = options.alsoKnownAs;
            this.controller = options.controller;
            this.verificationMethod = options.verificationMethod;
            this.service = options.service;
            this.authentication = options.authentication;
            this.assertionMethod = options.assertionMethod;
            this.keyAgreement = options.keyAgreement;
            this.capabilityInvocation = options.capabilityInvocation;
            this.capabilityDelegation = options.capabilityDelegation;
        }
    }
    dereferenceVerificationMethod(keyId) {
        // TODO: once we use JSON-LD we should use that to resolve references in did documents.
        // for now we check whether the key id ends with the keyId.
        // so if looking for #123 and key.id is did:key:123#123, it is valid. But #123 as key.id is also valid
        const verificationMethod = this.verificationMethod?.find((key) => key.id.endsWith(keyId));
        if (!verificationMethod) {
            throw new error_1.CredoError(`Unable to locate verification method with id '${keyId}'`);
        }
        return verificationMethod;
    }
    dereferenceKey(keyId, allowedPurposes) {
        const allPurposes = [
            'authentication',
            'keyAgreement',
            'assertionMethod',
            'capabilityInvocation',
            'capabilityDelegation',
            'verificationMethod',
        ];
        const purposes = allowedPurposes ?? allPurposes;
        for (const purpose of purposes) {
            for (const key of this[purpose] ?? []) {
                if (typeof key === 'string' && key.endsWith(keyId)) {
                    return this.dereferenceVerificationMethod(key);
                }
                if (typeof key !== 'string' && key.id.endsWith(keyId)) {
                    return key;
                }
            }
        }
        throw new error_1.CredoError(`Unable to locate verification method with id '${keyId}' in purposes ${purposes}`);
    }
    findVerificationMethodByPublicKey(publicJwk, allowedPurposes) {
        const allPurposes = [
            'authentication',
            'keyAgreement',
            'assertionMethod',
            'capabilityInvocation',
            'capabilityDelegation',
            'verificationMethod',
        ];
        const purposes = allowedPurposes ?? allPurposes;
        for (const purpose of purposes) {
            for (const key of this[purpose] ?? []) {
                const verificationMethod = typeof key === 'string' ? this.dereferenceVerificationMethod(key) : key;
                if ((0, key_type_1.getPublicJwkFromVerificationMethod)(verificationMethod).equals(publicJwk))
                    return verificationMethod;
            }
        }
        throw new error_1.CredoError(`Unable to locate verification method with public key ${publicJwk.jwkTypehumanDescription} in purposes ${purposes}`);
    }
    /**
     * Returns all of the service endpoints matching the given type.
     *
     * @param type The type of service(s) to query.
     */
    getServicesByType(type) {
        return (this.service?.filter((service) => service.type === type) ?? []);
    }
    /**
     * Returns all of the service endpoints matching the given class
     *
     * @param classType The class to query services.
     */
    getServicesByClassType(classType) {
        return (this.service?.filter((service) => service instanceof classType) ?? []);
    }
    /**
     * Get all DIDComm services ordered by priority descending. This means the highest
     * priority will be the first entry.
     */
    get didCommServices() {
        const didCommServiceTypes = [service_1.IndyAgentService.type, service_1.DidCommV1Service.type];
        const services = (this.service?.filter((service) => didCommServiceTypes.includes(service.type)) ?? []);
        // Sort services based on indicated priority
        return services.sort((a, b) => a.priority - b.priority);
    }
    // TODO: it would probably be easier if we add a utility to each service so we don't have to handle logic for all service types here
    get recipientKeys() {
        return this.getRecipientKeysWithVerificationMethod({
            // False for now to avoid breaking changes
            mapX25519ToEd25519: false,
        }).map(({ publicJwk }) => publicJwk);
    }
    /**
     * Returns the recipient keys with their verification method matches
     *
     * We should probably deprecate recipientKeys in favour of this one
     */
    getRecipientKeysWithVerificationMethod({ mapX25519ToEd25519, }) {
        const recipientKeys = [];
        const seenVerificationMethodIds = [];
        for (const service of this.didCommServices) {
            if (service.type === service_1.IndyAgentService.type) {
                for (const publicKeyBase58 of service.recipientKeys) {
                    const publicJwk = kms_1.PublicJwk.fromPublicKey({
                        kty: 'OKP',
                        crv: 'Ed25519',
                        publicKey: utils_1.TypedArrayEncoder.fromBase58(publicKeyBase58),
                    });
                    const verificationMethod = [...(this.verificationMethod ?? []), ...(this.authentication ?? [])]
                        .map((v) => (typeof v === 'string' ? this.dereferenceVerificationMethod(v) : v))
                        .find((v) => {
                        const vPublicJwk = (0, key_type_1.getPublicJwkFromVerificationMethod)(v);
                        return vPublicJwk.equals(publicJwk);
                    });
                    if (!verificationMethod) {
                        throw new error_1.CredoError('Could not find verification method for IndyAgentService recipient key');
                    }
                    // Skip adding if already present
                    if (seenVerificationMethodIds.includes(verificationMethod.id)) {
                        continue;
                    }
                    recipientKeys.push({
                        publicJwk,
                        verificationMethod,
                    });
                }
            }
            else if (service.type === service_1.DidCommV1Service.type) {
                for (const recipientKey of service.recipientKeys) {
                    const verificationMethod = this.dereferenceKey(recipientKey, ['authentication', 'keyAgreement']);
                    if (seenVerificationMethodIds.includes(verificationMethod.id)) {
                        // Skip adding if already present
                        continue;
                    }
                    const publicJwk = (0, key_type_1.getPublicJwkFromVerificationMethod)(verificationMethod);
                    if (!publicJwk.is(kms_1.Ed25519PublicJwk, kms_1.X25519PublicJwk)) {
                        throw new error_1.CredoError('Expected either Ed25519PublicJwk or X25519PublicJwk for DidcommV1Service recipient key');
                    }
                    recipientKeys.push({
                        publicJwk,
                        verificationMethod,
                    });
                }
            }
        }
        if (!mapX25519ToEd25519) {
            return recipientKeys;
        }
        return recipientKeys.map(({ publicJwk, verificationMethod }) => {
            if (publicJwk.is(kms_1.Ed25519PublicJwk))
                return { publicJwk, verificationMethod };
            const matchingEd25519Key = (0, findMatchingEd25519Key_1.findMatchingEd25519Key)(publicJwk, this);
            // For DIDcomm v1 if you use X25519 you MUST also include the Ed25519 key
            if (!matchingEd25519Key) {
                throw new error_1.CredoError(`Unable to find matching Ed25519 key for X25519 verification method with id ${verificationMethod.id}`);
            }
            return matchingEd25519Key;
        });
    }
    toJSON() {
        return JsonTransformer_1.JsonTransformer.toJSON(this);
    }
    static fromJSON(didDocument) {
        return JsonTransformer_1.JsonTransformer.fromJSON(didDocument, DidDocument);
    }
}
exports.DidDocument = DidDocument;
__decorate([
    (0, class_transformer_1.Expose)({ name: '@context' }),
    (0, transformers_1.IsStringOrStringArray)(),
    __metadata("design:type", Object)
], DidDocument.prototype, "context", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DidDocument.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], DidDocument.prototype, "alsoKnownAs", void 0);
__decorate([
    (0, transformers_1.IsStringOrStringArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], DidDocument.prototype, "controller", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => verificationMethod_1.VerificationMethod),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], DidDocument.prototype, "verificationMethod", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, service_1.ServiceTransformer)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], DidDocument.prototype, "service", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, verificationMethod_1.VerificationMethodTransformer)(),
    (0, verificationMethod_1.IsStringOrVerificationMethod)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], DidDocument.prototype, "authentication", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, verificationMethod_1.VerificationMethodTransformer)(),
    (0, verificationMethod_1.IsStringOrVerificationMethod)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], DidDocument.prototype, "assertionMethod", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, verificationMethod_1.VerificationMethodTransformer)(),
    (0, verificationMethod_1.IsStringOrVerificationMethod)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], DidDocument.prototype, "keyAgreement", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, verificationMethod_1.VerificationMethodTransformer)(),
    (0, verificationMethod_1.IsStringOrVerificationMethod)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], DidDocument.prototype, "capabilityInvocation", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, verificationMethod_1.VerificationMethodTransformer)(),
    (0, verificationMethod_1.IsStringOrVerificationMethod)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], DidDocument.prototype, "capabilityDelegation", void 0);
/**
 * Extracting the verification method for signature type
 * @param type Signature type
 * @param didDocument DidDocument
 * @returns verification method
 */
async function findVerificationMethodByKeyType(keyType, didDocument) {
    const didVerificationMethods = [
        'verificationMethod',
        'authentication',
        'keyAgreement',
        'assertionMethod',
        'capabilityInvocation',
        'capabilityDelegation',
    ];
    for await (const purpose of didVerificationMethods) {
        const key = didDocument[purpose];
        if (Array.isArray(key)) {
            for await (const method of key) {
                if (typeof method !== 'string') {
                    if (method.type === keyType) {
                        return method;
                    }
                }
            }
        }
    }
    return null;
}
//# sourceMappingURL=DidDocument.js.map