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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvelopeService = void 0;
const core_1 = require("@credo-ts/core");
const core_2 = require("@credo-ts/core");
const DidCommModuleConfig_1 = require("./DidCommModuleConfig");
const helpers_1 = require("./modules/connections/services/helpers");
const OutOfBandRole_1 = require("./modules/oob/domain/OutOfBandRole");
const OutOfBandRepository_1 = require("./modules/oob/repository/OutOfBandRepository");
const outOfBandRecordMetadataTypes_1 = require("./modules/oob/repository/outOfBandRecordMetadataTypes");
const ForwardMessage_1 = require("./modules/routing/messages/ForwardMessage");
const MediatorRoutingRepository_1 = require("./modules/routing/repository/MediatorRoutingRepository");
const DidCommDocumentService_1 = require("./services/DidCommDocumentService");
let EnvelopeService = class EnvelopeService {
    constructor(logger, didcommDocumentService) {
        this.logger = logger;
        this.didcommDocumentService = didcommDocumentService;
    }
    async encryptDidcommV1Message(agentContext, message, recipientKeys, senderKey) {
        const kms = agentContext.dependencyManager.resolve(core_1.Kms.KeyManagementApi);
        // Generally we would never generate the content encryption key outside of the KMS
        // However how DIDcommV1 is specified to calcualte the aad we need the encrypted content
        // encryption key, and thus we can't use the normal combined key agrement + encryption flow
        const contentEncryptionKey = kms.randomBytes({ length: 32 });
        const recipients = [];
        for (const recipientKey of recipientKeys) {
            let encryptedSender = undefined;
            if (senderKey) {
                // Encrypt the sender
                const { encrypted } = await kms.encrypt({
                    key: {
                        keyAgreement: {
                            algorithm: 'ECDH-HSALSA20',
                            // DIDComm v1 uses Ed25519 keys but encryption happens with X25519 keys
                            externalPublicJwk: recipientKey.convertTo(core_1.Kms.X25519PublicJwk).toJson(),
                        },
                    },
                    encryption: {
                        algorithm: 'XSALSA20-POLY1305',
                    },
                    data: core_1.TypedArrayEncoder.fromString(core_1.TypedArrayEncoder.toBase58(senderKey.publicKey.publicKey)),
                });
                encryptedSender = core_1.TypedArrayEncoder.toBase64URL(encrypted);
            }
            // Encrypt the key
            const { encrypted, iv } = await kms.encrypt({
                key: {
                    keyAgreement: {
                        algorithm: 'ECDH-HSALSA20',
                        externalPublicJwk: recipientKey.convertTo(core_1.Kms.X25519PublicJwk).toJson(),
                        // Sender key only needed for Authcrypt
                        keyId: senderKey?.keyId,
                    },
                },
                data: contentEncryptionKey,
                encryption: {
                    algorithm: 'XSALSA20-POLY1305',
                },
            });
            recipients.push({
                encrypted_key: core_1.TypedArrayEncoder.toBase64URL(encrypted),
                header: {
                    kid: core_1.TypedArrayEncoder.toBase58(recipientKey.publicKey.publicKey),
                    iv: iv ? core_1.TypedArrayEncoder.toBase64URL(iv) : undefined,
                    sender: encryptedSender,
                },
            });
        }
        const protectedString = core_1.JsonEncoder.toBase64URL({
            enc: 'xchacha20poly1305_ietf',
            typ: 'JWM/1.0',
            alg: senderKey ? 'Authcrypt' : 'Anoncrypt',
            recipients,
        });
        // Perofrm the actual encryption
        const { encrypted, iv, tag } = await kms.encrypt({
            encryption: {
                algorithm: 'C20P',
                aad: core_1.TypedArrayEncoder.fromString(protectedString),
            },
            data: core_1.JsonEncoder.toBuffer(message),
            key: {
                privateJwk: {
                    kty: 'oct',
                    k: core_1.TypedArrayEncoder.toBase64URL(contentEncryptionKey),
                },
            },
        });
        if (!iv || !tag) {
            throw new core_1.CredoError("Expected 'iv' and 'tag' to be defined");
        }
        return {
            ciphertext: core_1.TypedArrayEncoder.toBase64URL(encrypted),
            iv: core_1.TypedArrayEncoder.toBase64URL(iv),
            tag: core_1.TypedArrayEncoder.toBase64URL(tag),
            protected: protectedString,
        };
    }
    async decryptDidcommV1Message(agentContext, encryptedMessage) {
        const kms = agentContext.dependencyManager.resolve(core_1.Kms.KeyManagementApi);
        const protectedJson = core_1.JsonEncoder.fromBase64(encryptedMessage.protected);
        const alg = protectedJson.alg;
        if (alg !== 'Anoncrypt' && alg !== 'Authcrypt') {
            throw new core_1.CredoError(`Unsupported pack algorithm: ${alg}`);
        }
        if (protectedJson.enc !== 'xchacha20poly1305_ietf') {
            throw new core_1.CredoError(`Unsupported enc algorithm: ${protectedJson.enc}`);
        }
        let recipientKey = null;
        let recipient = null;
        for (const _recipient of protectedJson.recipients) {
            recipientKey = await this.extractOurRecipientKeyWithKeyId(agentContext, _recipient);
            if (recipientKey) {
                recipient = _recipient;
            }
        }
        if (!recipientKey || !recipient) {
            throw new core_1.CredoError('No corresponding recipient key found');
        }
        if (alg === 'Authcrypt' && (!recipient.header.sender || !recipient.header.iv)) {
            throw new core_1.CredoError('Sender and iv header values are required for Authcrypt');
        }
        let senderPublicJwk = undefined;
        if (recipient.header.sender) {
            const { data } = await kms.decrypt({
                key: {
                    keyAgreement: {
                        algorithm: 'ECDH-HSALSA20',
                        keyId: recipientKey.keyId,
                    },
                },
                decryption: {
                    algorithm: 'XSALSA20-POLY1305',
                },
                encrypted: core_1.TypedArrayEncoder.fromBase64(recipient.header.sender),
            });
            senderPublicJwk = core_1.Kms.PublicJwk.fromPublicKey({
                crv: 'Ed25519',
                kty: 'OKP',
                publicKey: core_1.TypedArrayEncoder.fromBase58(core_1.TypedArrayEncoder.toUtf8String(data)),
            });
        }
        // Perofrm the actual decryption
        const { data: contentEncryptionKey } = await kms.decrypt({
            decryption: {
                algorithm: 'XSALSA20-POLY1305',
                iv: recipient.header.iv ? core_1.TypedArrayEncoder.fromBase64(recipient.header.iv) : undefined,
            },
            encrypted: core_1.TypedArrayEncoder.fromBase64(recipient.encrypted_key),
            key: {
                keyAgreement: {
                    algorithm: 'ECDH-HSALSA20',
                    keyId: recipientKey.keyId,
                    // Optionally we have a sender
                    externalPublicJwk: senderPublicJwk?.convertTo(core_1.Kms.X25519PublicJwk).toJson(),
                },
            },
        });
        const { data: message } = await kms.decrypt({
            decryption: {
                algorithm: 'C20P',
                iv: core_1.TypedArrayEncoder.fromBase64(encryptedMessage.iv),
                tag: core_1.TypedArrayEncoder.fromBase64(encryptedMessage.tag),
                aad: core_1.TypedArrayEncoder.fromString(encryptedMessage.protected),
            },
            key: {
                privateJwk: {
                    kty: 'oct',
                    k: core_1.TypedArrayEncoder.toBase64URL(contentEncryptionKey),
                },
            },
            encrypted: core_1.TypedArrayEncoder.fromBase64(encryptedMessage.ciphertext),
        });
        return {
            plaintextMessage: core_1.JsonEncoder.fromBuffer(message),
            senderKey: senderPublicJwk,
            recipientKey,
        };
    }
    async packMessage(agentContext, payload, keys) {
        const didcommConfig = agentContext.dependencyManager.resolve(DidCommModuleConfig_1.DidCommModuleConfig);
        const { routingKeys, senderKey } = keys;
        let recipientKeys = keys.recipientKeys;
        // pass whether we want to use legacy did sov prefix
        const message = payload.toJSON({ useDidSovPrefixWhereAllowed: didcommConfig.useDidSovPrefixWhereAllowed });
        this.logger.debug(`Pack outbound message ${message['@type']}`);
        let encryptedMessage = await this.encryptDidcommV1Message(agentContext, message, recipientKeys, senderKey);
        // If the message has routing keys (mediator) pack for each mediator
        for (const routingKey of routingKeys) {
            const forwardMessage = new ForwardMessage_1.ForwardMessage({
                // Forward to first recipient key
                to: core_1.TypedArrayEncoder.toBase58(recipientKeys[0].publicKey.publicKey),
                message: encryptedMessage,
            });
            recipientKeys = [routingKey];
            this.logger.debug('Forward message created', forwardMessage);
            const forwardJson = forwardMessage.toJSON({
                useDidSovPrefixWhereAllowed: didcommConfig.useDidSovPrefixWhereAllowed,
            });
            // Forward messages are anon packed
            encryptedMessage = await this.encryptDidcommV1Message(agentContext, forwardJson, [routingKey]);
        }
        return encryptedMessage;
    }
    async unpackMessage(agentContext, encryptedMessage) {
        const decryptedMessage = await this.decryptDidcommV1Message(agentContext, encryptedMessage);
        return decryptedMessage;
    }
    async extractOurRecipientKeyWithKeyId(agentContext, recipient) {
        const kms = agentContext.resolve(core_1.Kms.KeyManagementApi);
        const publicKey = core_1.Kms.PublicJwk.fromPublicKey({
            kty: 'OKP',
            crv: 'Ed25519',
            publicKey: core_1.TypedArrayEncoder.fromBase58(recipient.header.kid),
        });
        // We need to find the associated did based on the recipient key
        // so we can extract the kms key id from the did record.
        try {
            const { didDocument, keys } = await this.didcommDocumentService.resolveCreatedDidDocumentWithKeysByRecipientKey(agentContext, publicKey);
            const verificationMethod = didDocument.findVerificationMethodByPublicKey(publicKey);
            const kmsKeyId = keys?.find(({ didDocumentRelativeKeyId }) => verificationMethod.id.endsWith(didDocumentRelativeKeyId))?.kmsKeyId;
            agentContext.config.logger.debug(`Found did '${didDocument.id}' for recipient key '${publicKey.fingerprint}' for incoming didcomm message`);
            publicKey.keyId = kmsKeyId ?? publicKey.legacyKeyId;
            return publicKey;
        }
        catch (error) {
            // If there is no did record yet, we first look at the mediator routing record
            const mediatorRoutingRepository = agentContext.dependencyManager.resolve(MediatorRoutingRepository_1.MediatorRoutingRepository);
            if (error instanceof core_1.RecordNotFoundError) {
                const mediatorRoutingRecord = await mediatorRoutingRepository.findSingleByQuery(agentContext, {
                    routingKeyFingerprints: [publicKey.fingerprint],
                });
                if (mediatorRoutingRecord) {
                    agentContext.config.logger.debug(`Found mediator routing record with id '${mediatorRoutingRecord.id}' for recipient key '${publicKey.fingerprint}' for incoming didcomm message`);
                    const routingKey = mediatorRoutingRecord.routingKeysWithKeyId.find((routingKey) => publicKey.equals(routingKey));
                    // This should not happen as we only get here if the tag matches
                    if (!routingKey) {
                        throw new core_1.CredoError(`Expected to find key with fingerprint '${publicKey.fingerprint}' in routing keys of mediator routing record '${mediatorRoutingRecord.id}'`);
                    }
                    if (routingKey) {
                        return routingKey;
                    }
                }
                //  If there is no mediator routing record, we look at the out of band record
                const outOfBandRepository = agentContext.dependencyManager.resolve(OutOfBandRepository_1.OutOfBandRepository);
                const outOfBandRecord = await outOfBandRepository.findSingleByQuery(agentContext, {
                    $or: [
                        // In case we are the creator of the out of band invitation we can query based on
                        // out of band invitation recipient key fingerprint
                        {
                            role: OutOfBandRole_1.OutOfBandRole.Sender,
                            recipientKeyFingerprints: [publicKey.fingerprint],
                        },
                        // In case we are the receiver of the out of band invitation we need to query
                        // for the recipient routing fingerprint
                        {
                            role: OutOfBandRole_1.OutOfBandRole.Receiver,
                            recipientRoutingKeyFingerprint: publicKey.fingerprint,
                        },
                    ],
                });
                if (outOfBandRecord?.role === OutOfBandRole_1.OutOfBandRole.Sender) {
                    agentContext.config.logger.debug(`Found out of band record with id '${outOfBandRecord.id}' and role '${outOfBandRecord.role}' for recipient key '${publicKey.fingerprint}' for incoming didcomm message`);
                    for (const service of outOfBandRecord.outOfBandInvitation.getInlineServices()) {
                        const resolvedService = (0, helpers_1.getResolvedDidcommServiceWithSigningKeyId)(service, outOfBandRecord.invitationInlineServiceKeys);
                        const _recipientKey = resolvedService.recipientKeys.find((recipientKey) => recipientKey.equals(publicKey));
                        if (_recipientKey) {
                            return _recipientKey;
                        }
                    }
                }
                else if (outOfBandRecord?.role === OutOfBandRole_1.OutOfBandRole.Receiver) {
                    agentContext.config.logger.debug(`Found out of band record with id '${outOfBandRecord.id}' and role '${outOfBandRecord.role}' for recipient key '${publicKey.fingerprint}' for incoming didcomm message`);
                    // If there is still no key we need to look at the metadata
                    const recipieintRouting = outOfBandRecord.metadata.get(outOfBandRecordMetadataTypes_1.OutOfBandRecordMetadataKeys.RecipientRouting);
                    if (recipieintRouting?.recipientKeyFingerprint === publicKey.fingerprint) {
                        publicKey.keyId = recipieintRouting.recipientKeyId ?? publicKey.legacyKeyId;
                        return publicKey;
                    }
                }
                // If there is no did found, no out of band record found, and not mediator routing record
                // this is either:
                //  - a connectionless oob exchange initiated before we added key ids.
                //  - a message for a mediator, where the mediator routing record is created before we added key ids
                //
                // We will check if the public key exists based on the base58 encoded public key. We can remove this flow once we create a migration
                // that optimizes this flow.
                const kmsJwkPublic = await kms
                    .getPublicKey({
                    keyId: publicKey.legacyKeyId,
                })
                    .catch((error) => {
                    if (error instanceof core_1.Kms.KeyManagementKeyNotFoundError)
                        return null;
                    throw error;
                });
                if (kmsJwkPublic) {
                    agentContext.config.logger.debug(`Found public key with legacy key id '${publicKey.legacyKeyId}' for recipient key '${publicKey.fingerprint}' for incoming didcomm message`);
                    publicKey.keyId = publicKey.legacyKeyId;
                    return publicKey;
                }
            }
        }
        // no match found
        return null;
    }
};
exports.EnvelopeService = EnvelopeService;
exports.EnvelopeService = EnvelopeService = __decorate([
    (0, core_2.injectable)(),
    __param(0, (0, core_1.inject)(core_1.InjectionSymbols.Logger)),
    __metadata("design:paramtypes", [Object, DidCommDocumentService_1.DidCommDocumentService])
], EnvelopeService);
//# sourceMappingURL=EnvelopeService.js.map