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
exports.OpenId4VcIssuerRecord = void 0;
const core_1 = require("@credo-ts/core");
const core_2 = require("@credo-ts/core");
const openid4vci_1 = require("@openid4vc/openid4vci");
const class_transformer_1 = require("class-transformer");
/**
 * For OID4VC you need to expose metadata files. Each issuer needs to host this metadata. This is not the case for DIDComm where we can just have one /didcomm endpoint.
 * So we create a record per openid issuer/verifier that you want, and each tenant can create multiple issuers/verifiers which have different endpoints
 * and metadata files
 * */
class OpenId4VcIssuerRecord extends core_2.BaseRecord {
    /**
     * Only here for class transformation. If credentialsSupported is set we transform
     * it to the new credentialConfigurationsSupported format
     */
    set credentialsSupported(credentialsSupported) {
        if (this.credentialConfigurationsSupported)
            return;
        this.credentialConfigurationsSupported =
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (0, openid4vci_1.credentialsSupportedToCredentialConfigurationsSupported)(credentialsSupported);
    }
    get resolvedAccessTokenPublicJwk() {
        if (this.accessTokenPublicJwk) {
            return core_1.Kms.PublicJwk.fromPublicJwk(this.accessTokenPublicJwk);
        }
        // From before we introduced key ids, uses legacy key id
        if (this.accessTokenPublicKeyFingerprint) {
            const publicJwk = core_1.Kms.PublicJwk.fromFingerprint(this.accessTokenPublicKeyFingerprint);
            publicJwk.keyId = publicJwk.legacyKeyId;
        }
        throw new core_2.CredoError('Neither accessTokenPublicJwk or accessTokenPublicKeyFingerprint defined. Unable to resolve access token public jwk.');
    }
    constructor(props) {
        super();
        this.type = OpenId4VcIssuerRecord.type;
        if (props) {
            this.id = props.id ?? core_2.utils.uuid();
            this.createdAt = props.createdAt ?? new Date();
            this._tags = props.tags ?? {};
            this.issuerId = props.issuerId;
            this.accessTokenPublicJwk = props.accessTokenPublicJwk;
            this.credentialConfigurationsSupported = props.credentialConfigurationsSupported;
            this.dpopSigningAlgValuesSupported = props.dpopSigningAlgValuesSupported;
            this.display = props.display;
            this.authorizationServerConfigs = props.authorizationServerConfigs;
            this.batchCredentialIssuance = props.batchCredentialIssuance;
        }
    }
    getTags() {
        return {
            ...this._tags,
            issuerId: this.issuerId,
        };
    }
}
exports.OpenId4VcIssuerRecord = OpenId4VcIssuerRecord;
OpenId4VcIssuerRecord.type = 'OpenId4VcIssuerRecord';
__decorate([
    (0, class_transformer_1.Transform)(({ type, value }) => {
        if (type === class_transformer_1.TransformationType.PLAIN_TO_CLASS && Array.isArray(value)) {
            return value.map((display) => {
                if (display.logo?.uri)
                    return display;
                const { url, ...logoRest } = display.logo ?? {};
                return {
                    ...display,
                    logo: url
                        ? {
                            ...logoRest,
                            uri: url,
                        }
                        : undefined,
                };
            });
        }
        return value;
    }),
    __metadata("design:type", Array)
], OpenId4VcIssuerRecord.prototype, "display", void 0);
//# sourceMappingURL=OpenId4VcIssuerRecord.js.map