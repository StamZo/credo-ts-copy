"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediatorRoutingRecord = void 0;
const core_1 = require("@credo-ts/core");
class MediatorRoutingRecord extends core_1.BaseRecord {
    constructor(props) {
        super();
        this.type = MediatorRoutingRecord.type;
        this.allowCache = true;
        if (props) {
            this.id = props.id ?? core_1.utils.uuid();
            this.createdAt = props.createdAt ?? new Date();
            this.routingKeys = props.routingKeys || [];
        }
    }
    get routingKeysWithKeyId() {
        return this.routingKeys.map((routingKey) => {
            // routing keys in base58 format use the legacy key id
            if (typeof routingKey === 'string') {
                const publicJwk = core_1.Kms.PublicJwk.fromPublicKey({
                    kty: 'OKP',
                    crv: 'Ed25519',
                    publicKey: core_1.TypedArrayEncoder.fromBase58(routingKey),
                });
                publicJwk.keyId = publicJwk.legacyKeyId;
                return publicJwk;
            }
            // routing keys using new structure, have a key id defined
            const publicJwk = core_1.Kms.PublicJwk.fromFingerprint(routingKey.routingKeyFingerprint);
            publicJwk.keyId = routingKey.kmsKeyId;
            if (!publicJwk.is(core_1.Kms.Ed25519PublicJwk)) {
                throw new core_1.CredoError('Expected mediator routing record key to be of type Ed25519.');
            }
            return publicJwk;
        });
    }
    getTags() {
        return {
            ...this._tags,
            routingKeyFingerprints: this.routingKeys.map((routingKey) => typeof routingKey === 'string'
                ? core_1.Kms.PublicJwk.fromPublicKey({
                    kty: 'OKP',
                    crv: 'Ed25519',
                    publicKey: core_1.TypedArrayEncoder.fromBase58(routingKey),
                }).fingerprint
                : routingKey.routingKeyFingerprint),
        };
    }
}
exports.MediatorRoutingRecord = MediatorRoutingRecord;
MediatorRoutingRecord.type = 'MediatorRoutingRecord';
MediatorRoutingRecord.allowCache = true;
//# sourceMappingURL=MediatorRoutingRecord.js.map