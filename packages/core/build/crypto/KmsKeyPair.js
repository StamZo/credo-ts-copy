"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKmsKeyPairClass = createKmsKeyPairClass;
const error_1 = require("../error");
const dids_1 = require("../modules/dids");
const keyDidMapping_1 = require("../modules/dids/domain/key-type/keyDidMapping");
const kms_1 = require("../modules/kms");
const LdKeyPair_1 = require("../modules/vc/data-integrity/models/LdKeyPair");
const utils_1 = require("../utils");
const buffer_1 = require("../utils/buffer");
function createKmsKeyPairClass(agentContext) {
    return class KmsKeyPair extends LdKeyPair_1.LdKeyPair {
        constructor(options) {
            super(options);
            this.type = 'KmsKeyPair';
            this.publicJwk = options.publicJwk;
        }
        static async generate() {
            throw new Error('Not implemented');
        }
        fingerprint() {
            throw new Error('Method not implemented.');
        }
        verifyFingerprint(_fingerprint) {
            throw new Error('Method not implemented.');
        }
        static async from(verificationMethod) {
            const vMethod = utils_1.JsonTransformer.fromJSON(verificationMethod, dids_1.VerificationMethod);
            utils_1.MessageValidator.validateSync(vMethod);
            const publicJwk = (0, keyDidMapping_1.getPublicJwkFromVerificationMethod)(vMethod);
            return new KmsKeyPair({
                id: vMethod.id,
                controller: vMethod.controller,
                publicJwk,
            });
        }
        /**
         * This method returns a wrapped wallet.sign method. The method is being wrapped so we can covert between Uint8Array and Buffer. This is to make it compatible with the external signature libraries.
         */
        signer() {
            // wrap function for conversion
            const wrappedSign = async (data) => {
                if (Array.isArray(data.data)) {
                    throw new error_1.CredoError('Signing array of data entries is not supported');
                }
                const kms = agentContext.dependencyManager.resolve(kms_1.KeyManagementApi);
                const result = await kms.sign({
                    data: data.data,
                    keyId: this.publicJwk.keyId,
                    algorithm: this.publicJwk.signatureAlgorithm,
                });
                return result.signature;
            };
            return {
                sign: wrappedSign.bind(this),
            };
        }
        /**
         * This method returns a wrapped wallet.verify method. The method is being wrapped so we can covert between Uint8Array and Buffer. This is to make it compatible with the external signature libraries.
         */
        verifier() {
            const wrappedVerify = async (data) => {
                if (Array.isArray(data.data)) {
                    throw new error_1.CredoError('Verifying array of data entries is not supported');
                }
                const kms = agentContext.dependencyManager.resolve(kms_1.KeyManagementApi);
                const { verified } = await kms.verify({
                    data: data.data,
                    signature: buffer_1.Buffer.from(data.signature),
                    key: {
                        publicJwk: this.publicJwk.toJson(),
                    },
                    algorithm: this.publicJwk.signatureAlgorithm,
                });
                return verified;
            };
            return {
                verify: wrappedVerify.bind(this),
            };
        }
        get publicKeyBuffer() {
            const publicKey = this.publicJwk.publicKey;
            if (publicKey.kty === 'RSA') {
                throw new error_1.CredoError(`kty 'RSA' not supported for publicKeyBuffer`);
            }
            return publicKey.publicKey;
        }
    };
}
//# sourceMappingURL=KmsKeyPair.js.map