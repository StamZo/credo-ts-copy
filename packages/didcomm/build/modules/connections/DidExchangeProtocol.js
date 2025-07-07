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
exports.DidExchangeProtocol = void 0;
const core_1 = require("@credo-ts/core");
const Attachment_1 = require("../../decorators/attachment/Attachment");
const OutOfBandRole_1 = require("../oob/domain/OutOfBandRole");
const OutOfBandState_1 = require("../oob/domain/OutOfBandState");
const helpers_1 = require("../routing/services/helpers");
const services_1 = require("../../services");
const ConnectionsModuleConfig_1 = require("./ConnectionsModuleConfig");
const DidExchangeStateMachine_1 = require("./DidExchangeStateMachine");
const errors_1 = require("./errors");
const messages_1 = require("./messages");
const models_1 = require("./models");
const services_2 = require("./services");
const helpers_2 = require("./services/helpers");
let DidExchangeProtocol = class DidExchangeProtocol {
    constructor(connectionService, didRepository, jwsService, didcommDocumentService, logger) {
        this.connectionService = connectionService;
        this.didRepository = didRepository;
        this.jwsService = jwsService;
        this.didcommDocumentService = didcommDocumentService;
        this.logger = logger;
    }
    async createRequest(agentContext, outOfBandRecord, params) {
        this.logger.debug(`Create message ${messages_1.DidExchangeRequestMessage.type.messageTypeUri} start`, {
            outOfBandRecord,
            params,
        });
        const config = agentContext.dependencyManager.resolve(ConnectionsModuleConfig_1.ConnectionsModuleConfig);
        const { outOfBandInvitation } = outOfBandRecord;
        const { alias, goal, goalCode, routing, autoAcceptConnection, ourDid: did } = params;
        // TODO: We should store only one did that we'll use to send the request message with success.
        // We take just the first one for now.
        const [invitationDid] = outOfBandInvitation.invitationDids;
        // Create message
        const label = params.label ?? agentContext.config.label;
        let didDocument;
        let keys;
        let mediatorId;
        // If our did is specified, make sure we have all key material for it
        if (did) {
            const dids = agentContext.resolve(core_1.DidsApi);
            const resolved = await dids.resolveCreatedDidDocumentWithKeys(did);
            didDocument = resolved.didDocument;
            keys = resolved.keys;
            mediatorId = (await (0, helpers_1.getMediationRecordForDidDocument)(agentContext, didDocument))?.id;
        }
        // Otherwise, create a did:peer based on the provided routing
        else {
            if (!routing)
                throw new core_1.CredoError(`'routing' must be defined if 'ourDid' is not specified`);
            const resolved = await (0, helpers_2.createPeerDidFromServices)(agentContext, (0, helpers_2.routingToServices)(routing), config.peerNumAlgoForDidExchangeRequests);
            didDocument = resolved.didDocument;
            keys = resolved.keys;
            mediatorId = routing.mediatorId;
        }
        const parentThreadId = outOfBandRecord.outOfBandInvitation.id;
        const message = new messages_1.DidExchangeRequestMessage({ label, parentThreadId, did: didDocument.id, goal, goalCode });
        const signingKeys = didDocument
            .getRecipientKeysWithVerificationMethod({ mapX25519ToEd25519: true })
            .map(({ publicJwk, verificationMethod }) => {
            // Bind the kmsKeyIds
            const kmsKeyId = keys?.find(({ didDocumentRelativeKeyId }) => verificationMethod.id.endsWith(didDocumentRelativeKeyId))?.kmsKeyId;
            publicJwk.keyId = kmsKeyId ?? publicJwk.legacyKeyId;
            return publicJwk;
        });
        // Create sign attachment containing didDoc
        if ((0, core_1.isValidPeerDid)(didDocument.id) && (0, core_1.getNumAlgoFromPeerDid)(didDocument.id) === core_1.PeerDidNumAlgo.GenesisDoc) {
            const didDocAttach = await this.createSignedAttachment(agentContext, didDocument.toJSON(), signingKeys);
            message.didDoc = didDocAttach;
        }
        const connectionRecord = await this.connectionService.createConnection(agentContext, {
            protocol: models_1.HandshakeProtocol.DidExchange,
            role: models_1.DidExchangeRole.Requester,
            alias,
            state: models_1.DidExchangeState.InvitationReceived,
            theirLabel: outOfBandInvitation.label,
            mediatorId,
            autoAcceptConnection: outOfBandRecord.autoAcceptConnection,
            outOfBandId: outOfBandRecord.id,
            invitationDid,
            imageUrl: outOfBandInvitation.imageUrl,
        });
        DidExchangeStateMachine_1.DidExchangeStateMachine.assertCreateMessageState(messages_1.DidExchangeRequestMessage.type, connectionRecord);
        connectionRecord.did = didDocument.id;
        connectionRecord.threadId = message.id;
        if (autoAcceptConnection !== undefined || autoAcceptConnection !== null) {
            connectionRecord.autoAcceptConnection = autoAcceptConnection;
        }
        await this.updateState(agentContext, messages_1.DidExchangeRequestMessage.type, connectionRecord);
        this.logger.debug(`Create message ${messages_1.DidExchangeRequestMessage.type.messageTypeUri} end`, {
            connectionRecord,
            message,
        });
        return { message, connectionRecord };
    }
    async processRequest(messageContext, outOfBandRecord) {
        this.logger.debug(`Process message ${messageContext.message.type} start`, {
            message: messageContext.message,
        });
        outOfBandRecord.assertRole(OutOfBandRole_1.OutOfBandRole.Sender);
        outOfBandRecord.assertState(OutOfBandState_1.OutOfBandState.AwaitResponse);
        // TODO check there is no connection record for particular oob record
        const { message, agentContext } = messageContext;
        // Check corresponding invitation ID is the request's ~thread.pthid or pthid is a public did
        // TODO Maybe we can do it in handler, but that actually does not make sense because we try to find oob by parent thread ID there.
        const parentThreadId = message.thread?.parentThreadId;
        if (!parentThreadId ||
            (!(0, core_1.tryParseDid)(parentThreadId) && parentThreadId !== outOfBandRecord.getTags().invitationId)) {
            throw new errors_1.DidExchangeProblemReportError('Missing reference to invitation.', {
                problemCode: errors_1.DidExchangeProblemReportReason.RequestNotAccepted,
            });
        }
        // If the responder wishes to continue the exchange, they will persist the received information in their wallet.
        // Get DID Document either from message (if it is a supported did:peer) or resolve it externally
        const didDocument = await this.resolveDidDocument(agentContext, message);
        // A DID Record must be stored in order to allow for searching for its recipient keys when receiving a message
        const didRecord = await this.didRepository.storeReceivedDid(messageContext.agentContext, {
            did: didDocument.id,
            // It is important to take the did document from the PeerDid class
            // as it will have the id property
            didDocument: !(0, core_1.isValidPeerDid)(didDocument.id) || (0, core_1.getNumAlgoFromPeerDid)(message.did) === core_1.PeerDidNumAlgo.GenesisDoc
                ? didDocument
                : undefined,
            tags: {
                // We need to save the recipientKeys, so we can find the associated did
                // of a key when we receive a message from another connection.
                recipientKeyFingerprints: didDocument.recipientKeys.map((key) => key.fingerprint),
                // For did:peer, store any alternative dids (like short form did:peer:4),
                // it may have in order to relate any message referencing it
                alternativeDids: (0, core_1.isValidPeerDid)(didDocument.id) ? (0, core_1.getAlternativeDidsForPeerDid)(didDocument.id) : undefined,
            },
        });
        this.logger.debug('Saved DID record', {
            id: didRecord.id,
            did: didRecord.did,
            role: didRecord.role,
            tags: didRecord.getTags(),
            didDocument: 'omitted...',
        });
        const connectionRecord = await this.connectionService.createConnection(messageContext.agentContext, {
            protocol: models_1.HandshakeProtocol.DidExchange,
            role: models_1.DidExchangeRole.Responder,
            state: models_1.DidExchangeState.RequestReceived,
            alias: outOfBandRecord.alias,
            theirDid: message.did,
            theirLabel: message.label,
            threadId: message.threadId,
            mediatorId: outOfBandRecord.mediatorId,
            autoAcceptConnection: outOfBandRecord.autoAcceptConnection,
            outOfBandId: outOfBandRecord.id,
        });
        await this.updateState(messageContext.agentContext, messages_1.DidExchangeRequestMessage.type, connectionRecord);
        this.logger.debug(`Process message ${messages_1.DidExchangeRequestMessage.type.messageTypeUri} end`, connectionRecord);
        return connectionRecord;
    }
    async createResponse(agentContext, connectionRecord, outOfBandRecord, routing) {
        this.logger.debug(`Create message ${messages_1.DidExchangeResponseMessage.type.messageTypeUri} start`, connectionRecord);
        DidExchangeStateMachine_1.DidExchangeStateMachine.assertCreateMessageState(messages_1.DidExchangeResponseMessage.type, connectionRecord);
        const { threadId, theirDid } = connectionRecord;
        const config = agentContext.dependencyManager.resolve(ConnectionsModuleConfig_1.ConnectionsModuleConfig);
        if (!threadId) {
            throw new core_1.CredoError('Missing threadId on connection record.');
        }
        if (!theirDid) {
            throw new core_1.CredoError('Missing theirDid on connection record.');
        }
        // Extract keys from the out of band record metadata
        const inlineResolvedServices = outOfBandRecord.outOfBandInvitation
            .getInlineServices()
            .map((service) => (0, helpers_2.getResolvedDidcommServiceWithSigningKeyId)(service, outOfBandRecord.invitationInlineServiceKeys));
        let services = [];
        if (routing) {
            services = (0, helpers_2.routingToServices)(routing);
        }
        else if (inlineResolvedServices.length > 0) {
            services = inlineResolvedServices;
        }
        else {
            // We don't support using a did from the OOB invitation services currently, in this case we always pass routing to this method
            throw new core_1.CredoError('No routing provided, and no inline services found in out of band invitation. When using did services in out of band invitation, make sure to provide routing information for rotation.');
        }
        // Use the same num algo for response as received in request
        const numAlgo = (0, core_1.isValidPeerDid)(theirDid)
            ? (0, core_1.getNumAlgoFromPeerDid)(theirDid)
            : config.peerNumAlgoForDidExchangeRequests;
        const { didDocument } = await (0, helpers_2.createPeerDidFromServices)(agentContext, services, numAlgo);
        const message = new messages_1.DidExchangeResponseMessage({ did: didDocument.id, threadId });
        // DID Rotate attachment should be signed with invitation keys
        const invitationRecipientKeys = inlineResolvedServices.flatMap((s) => s.recipientKeys);
        // Consider also pure-DID services, used when DID Exchange is started with an implicit invitation or a public DID
        for (const did of outOfBandRecord.outOfBandInvitation.getDidServices()) {
            const dids = agentContext.resolve(core_1.DidsApi);
            const resolved = await dids.resolveCreatedDidDocumentWithKeys((0, core_1.parseDid)(did).did);
            invitationRecipientKeys.push(...resolved.didDocument
                .getRecipientKeysWithVerificationMethod({ mapX25519ToEd25519: true })
                .map(({ publicJwk, verificationMethod }) => {
                const kmsKeyId = resolved.keys?.find(({ didDocumentRelativeKeyId }) => verificationMethod.id.endsWith(didDocumentRelativeKeyId))?.kmsKeyId;
                publicJwk.keyId = kmsKeyId ?? publicJwk.legacyKeyId;
                return publicJwk;
            }));
        }
        if (numAlgo === core_1.PeerDidNumAlgo.GenesisDoc) {
            message.didDoc = await this.createSignedAttachment(agentContext, didDocument.toJSON(), invitationRecipientKeys);
        }
        else {
            // We assume any other case is a resolvable did (e.g. did:peer:2 or did:peer:4)
            message.didRotate = await this.createSignedAttachment(agentContext, didDocument.id, invitationRecipientKeys);
        }
        connectionRecord.did = didDocument.id;
        await this.updateState(agentContext, messages_1.DidExchangeResponseMessage.type, connectionRecord);
        this.logger.debug(`Create message ${messages_1.DidExchangeResponseMessage.type.messageTypeUri} end`, {
            connectionRecord,
            message,
        });
        return message;
    }
    async processResponse(messageContext, outOfBandRecord) {
        this.logger.debug(`Process message ${messages_1.DidExchangeResponseMessage.type.messageTypeUri} start`, {
            message: messageContext.message,
        });
        const { connection: connectionRecord, message, agentContext } = messageContext;
        if (!connectionRecord) {
            throw new core_1.CredoError('No connection record in message context.');
        }
        DidExchangeStateMachine_1.DidExchangeStateMachine.assertProcessMessageState(messages_1.DidExchangeResponseMessage.type, connectionRecord);
        if (!message.thread?.threadId || message.thread?.threadId !== connectionRecord.threadId) {
            throw new errors_1.DidExchangeProblemReportError('Invalid or missing thread ID.', {
                problemCode: errors_1.DidExchangeProblemReportReason.ResponseNotAccepted,
            });
        }
        // Get DID Document either from message (if it is a did:peer) or resolve it externally
        const didDocument = await this.resolveDidDocument(agentContext, message, outOfBandRecord.getTags().recipientKeyFingerprints.map((fingerprint) => {
            const publicJwk = core_1.Kms.PublicJwk.fromFingerprint(fingerprint);
            if (!publicJwk.is(core_1.Kms.Ed25519PublicJwk)) {
                throw new core_1.CredoError('Expected fingerprint to be of type Ed25519');
            }
            return publicJwk;
        }));
        if ((0, core_1.isValidPeerDid)(didDocument.id)) {
            const didRecord = await this.didRepository.storeReceivedDid(messageContext.agentContext, {
                did: didDocument.id,
                didDocument: (0, core_1.getNumAlgoFromPeerDid)(message.did) === core_1.PeerDidNumAlgo.GenesisDoc ? didDocument : undefined,
                tags: {
                    // We need to save the recipientKeys, so we can find the associated did
                    // of a key when we receive a message from another connection.
                    recipientKeyFingerprints: didDocument.recipientKeys.map((key) => key.fingerprint),
                    // For did:peer, store any alternative dids (like short form did:peer:4),
                    // it may have in order to relate any message referencing it
                    alternativeDids: (0, core_1.getAlternativeDidsForPeerDid)(didDocument.id),
                },
            });
            this.logger.debug('Saved DID record', {
                id: didRecord.id,
                did: didRecord.did,
                role: didRecord.role,
                tags: didRecord.getTags(),
                didDocument: 'omitted...',
            });
        }
        connectionRecord.theirDid = message.did;
        await this.updateState(messageContext.agentContext, messages_1.DidExchangeResponseMessage.type, connectionRecord);
        this.logger.debug(`Process message ${messages_1.DidExchangeResponseMessage.type.messageTypeUri} end`, connectionRecord);
        return connectionRecord;
    }
    async createComplete(agentContext, connectionRecord, outOfBandRecord) {
        this.logger.debug(`Create message ${messages_1.DidExchangeCompleteMessage.type.messageTypeUri} start`, connectionRecord);
        DidExchangeStateMachine_1.DidExchangeStateMachine.assertCreateMessageState(messages_1.DidExchangeCompleteMessage.type, connectionRecord);
        const threadId = connectionRecord.threadId;
        const parentThreadId = outOfBandRecord.outOfBandInvitation.id;
        if (!threadId) {
            throw new core_1.CredoError(`Connection record ${connectionRecord.id} does not have 'threadId' attribute.`);
        }
        if (!parentThreadId) {
            throw new core_1.CredoError(`Connection record ${connectionRecord.id} does not have 'parentThreadId' attribute.`);
        }
        const message = new messages_1.DidExchangeCompleteMessage({ threadId, parentThreadId });
        await this.updateState(agentContext, messages_1.DidExchangeCompleteMessage.type, connectionRecord);
        this.logger.debug(`Create message ${messages_1.DidExchangeCompleteMessage.type.messageTypeUri} end`, {
            connectionRecord,
            message,
        });
        return message;
    }
    async processComplete(messageContext, outOfBandRecord) {
        this.logger.debug(`Process message ${messages_1.DidExchangeCompleteMessage.type.messageTypeUri} start`, {
            message: messageContext.message,
        });
        const { connection: connectionRecord, message } = messageContext;
        if (!connectionRecord) {
            throw new core_1.CredoError('No connection record in message context.');
        }
        DidExchangeStateMachine_1.DidExchangeStateMachine.assertProcessMessageState(messages_1.DidExchangeCompleteMessage.type, connectionRecord);
        if (message.threadId !== connectionRecord.threadId) {
            throw new errors_1.DidExchangeProblemReportError('Invalid or missing thread ID.', {
                problemCode: errors_1.DidExchangeProblemReportReason.CompleteRejected,
            });
        }
        const pthid = message.thread?.parentThreadId;
        if (!pthid || pthid !== outOfBandRecord.outOfBandInvitation.id) {
            throw new errors_1.DidExchangeProblemReportError('Invalid or missing parent thread ID referencing to the invitation.', {
                problemCode: errors_1.DidExchangeProblemReportReason.CompleteRejected,
            });
        }
        await this.updateState(messageContext.agentContext, messages_1.DidExchangeCompleteMessage.type, connectionRecord);
        this.logger.debug(`Process message ${messages_1.DidExchangeCompleteMessage.type.messageTypeUri} end`, { connectionRecord });
        return connectionRecord;
    }
    async updateState(agentContext, messageType, connectionRecord) {
        this.logger.debug('Updating state', { connectionRecord });
        const nextState = DidExchangeStateMachine_1.DidExchangeStateMachine.nextState(messageType, connectionRecord);
        return this.connectionService.updateState(agentContext, connectionRecord, nextState);
    }
    async createSignedAttachment(agentContext, data, signingKeys) {
        this.logger.debug('Creating signed attachment');
        const signedAttach = new Attachment_1.Attachment({
            mimeType: typeof data === 'string' ? undefined : 'application/json',
            data: new Attachment_1.AttachmentData({
                base64: typeof data === 'string' ? core_1.TypedArrayEncoder.toBase64URL(core_1.Buffer.from(data)) : core_1.JsonEncoder.toBase64(data),
            }),
        });
        await Promise.all(signingKeys.map(async (signingKey) => {
            const kid = new core_1.DidKey(signingKey).did;
            const payload = typeof data === 'string' ? core_1.TypedArrayEncoder.fromString(data) : core_1.JsonEncoder.toBuffer(data);
            const jws = await this.jwsService.createJws(agentContext, {
                payload,
                keyId: signingKey.keyId,
                header: {
                    kid,
                },
                protectedHeaderOptions: {
                    alg: core_1.Kms.KnownJwaSignatureAlgorithms.EdDSA,
                    jwk: signingKey,
                },
            });
            signedAttach.addJws(jws);
        }));
        return signedAttach;
    }
    /**
     * Resolves a did document from a given `request` or `response` message, verifying its signature or did rotate
     * signature in case it is taken from message attachment.
     *
     * @param message DID request or DID response message
     * @param invitationKeys array containing keys from connection invitation that could be used for signing of DID document
     * @returns verified DID document content from message attachment
     */
    async resolveDidDocument(agentContext, message, invitationKeys = []) {
        // The only supported case where we expect to receive a did-document attachment is did:peer algo 1
        return (0, core_1.isDid)(message.did, 'peer') && (0, core_1.getNumAlgoFromPeerDid)(message.did) === core_1.PeerDidNumAlgo.GenesisDoc
            ? this.extractAttachedDidDocument(agentContext, message, invitationKeys)
            : this.extractResolvableDidDocument(agentContext, message, invitationKeys);
    }
    /**
     * Extracts DID document from message (resolving it externally if required) and verifies did-rotate attachment signature
     * if applicable
     */
    async extractResolvableDidDocument(agentContext, message, invitationKeys) {
        // Validate did-rotate attachment in case of DID Exchange response
        if (message instanceof messages_1.DidExchangeResponseMessage) {
            const didRotateAttachment = message.didRotate;
            if (!didRotateAttachment) {
                throw new errors_1.DidExchangeProblemReportError('DID Rotate attachment is missing.', {
                    problemCode: errors_1.DidExchangeProblemReportReason.ResponseNotAccepted,
                });
            }
            const jws = didRotateAttachment.data.jws;
            if (!jws) {
                throw new errors_1.DidExchangeProblemReportError('DID Rotate signature is missing.', {
                    problemCode: errors_1.DidExchangeProblemReportReason.ResponseNotAccepted,
                });
            }
            if (!didRotateAttachment.data.base64) {
                throw new core_1.CredoError('DID Rotate attachment is missing base64 property for signed did.');
            }
            // JWS payload must be base64url encoded
            const base64UrlPayload = (0, core_1.base64ToBase64URL)(didRotateAttachment.data.base64);
            const signedDid = core_1.TypedArrayEncoder.fromBase64(base64UrlPayload).toString();
            if (signedDid !== message.did) {
                throw new core_1.CredoError(`DID Rotate attachment's did ${message.did} does not correspond to message did ${message.did}`);
            }
            const { isValid, jwsSigners } = await this.jwsService.verifyJws(agentContext, {
                jws: {
                    ...jws,
                    payload: base64UrlPayload,
                },
                allowedJwsSignerMethods: ['did'],
                resolveJwsSigner: ({ jws: { header } }) => {
                    if (typeof header.kid !== 'string' || !(0, core_1.isDid)(header.kid, 'key')) {
                        throw new core_1.CredoError('JWS header kid must be a did:key DID.');
                    }
                    const didKey = core_1.DidKey.fromDid(header.kid);
                    return {
                        method: 'did',
                        didUrl: `${didKey.did}#${didKey.publicJwk.fingerprint}`,
                        jwk: didKey.publicJwk,
                    };
                },
            });
            const jwsSignerKeys = jwsSigners.map((signer) => signer.jwk);
            if (!jwsSignerKeys.every((key) => key.is(core_1.Kms.Ed25519PublicJwk))) {
                throw new errors_1.DidExchangeProblemReportError('Expected DID Rotate signature to be signed with Ed25519 key.', {
                    problemCode: errors_1.DidExchangeProblemReportReason.ResponseNotAccepted,
                });
            }
            if (!isValid ||
                !jwsSignerKeys.every((key) => invitationKeys?.some((invitationKey) => invitationKey.equals(key)))) {
                throw new errors_1.DidExchangeProblemReportError(`DID Rotate signature is invalid. isValid: ${isValid} signerKeys: ${JSON.stringify(jwsSignerKeys.map((key) => key.fingerprint))} invitationKeys:${JSON.stringify(invitationKeys?.map((key) => key.fingerprint))}`, {
                    problemCode: errors_1.DidExchangeProblemReportReason.ResponseNotAccepted,
                });
            }
        }
        // Now resolve the document related to the did (which can be either a public did or an inline did)
        try {
            return await agentContext.dependencyManager.resolve(core_1.DidsApi).resolveDidDocument(message.did);
        }
        catch (error) {
            const problemCode = message instanceof messages_1.DidExchangeRequestMessage
                ? errors_1.DidExchangeProblemReportReason.RequestNotAccepted
                : errors_1.DidExchangeProblemReportReason.ResponseNotAccepted;
            throw new errors_1.DidExchangeProblemReportError(error, {
                problemCode,
            });
        }
    }
    /**
     * Extracts DID document as is from request or response message attachment and verifies its signature.
     *
     * @param message DID request or DID response message
     * @param invitationKeys array containing keys from connection invitation that could be used for signing of DID document
     * @returns verified DID document content from message attachment
     */
    async extractAttachedDidDocument(agentContext, message, invitationKeys = []) {
        if (!message.didDoc) {
            const problemCode = message instanceof messages_1.DidExchangeRequestMessage
                ? errors_1.DidExchangeProblemReportReason.RequestNotAccepted
                : errors_1.DidExchangeProblemReportReason.ResponseNotAccepted;
            throw new errors_1.DidExchangeProblemReportError('DID Document attachment is missing.', { problemCode });
        }
        const didDocumentAttachment = message.didDoc;
        const jws = didDocumentAttachment.data.jws;
        if (!jws) {
            const problemCode = message instanceof messages_1.DidExchangeRequestMessage
                ? errors_1.DidExchangeProblemReportReason.RequestNotAccepted
                : errors_1.DidExchangeProblemReportReason.ResponseNotAccepted;
            throw new errors_1.DidExchangeProblemReportError('DID Document signature is missing.', { problemCode });
        }
        if (!didDocumentAttachment.data.base64) {
            throw new core_1.CredoError('DID Document attachment is missing base64 property for signed did document.');
        }
        // JWS payload must be base64url encoded
        const base64UrlPayload = (0, core_1.base64ToBase64URL)(didDocumentAttachment.data.base64);
        const { isValid, jwsSigners } = await this.jwsService.verifyJws(agentContext, {
            jws: {
                ...jws,
                payload: base64UrlPayload,
            },
            allowedJwsSignerMethods: ['did'],
            resolveJwsSigner: ({ jws: { header } }) => {
                if (typeof header.kid !== 'string' || !(0, core_1.isDid)(header.kid, 'key')) {
                    throw new core_1.CredoError('JWS header kid must be a did:key DID.');
                }
                const didKey = core_1.DidKey.fromDid(header.kid);
                return {
                    method: 'did',
                    didUrl: `${didKey.did}#${didKey.publicJwk.fingerprint}`,
                    jwk: didKey.publicJwk,
                };
            },
        });
        const json = core_1.JsonEncoder.fromBase64(didDocumentAttachment.data.base64);
        const didDocument = core_1.JsonTransformer.fromJSON(json, core_1.DidDocument);
        const didDocumentKeys = didDocument.authentication
            ?.map((authentication) => {
            const verificationMethod = typeof authentication === 'string'
                ? didDocument.dereferenceVerificationMethod(authentication)
                : authentication;
            const publicJwk = (0, core_1.getPublicJwkFromVerificationMethod)(verificationMethod);
            return publicJwk;
        })
            .concat(invitationKeys);
        this.logger.trace('JWS verification result', { isValid, jwsSigners });
        if (!isValid || !jwsSigners.every((jwsSigner) => didDocumentKeys?.some((key) => key.equals(jwsSigner.jwk)))) {
            const problemCode = message instanceof messages_1.DidExchangeRequestMessage
                ? errors_1.DidExchangeProblemReportReason.RequestNotAccepted
                : errors_1.DidExchangeProblemReportReason.ResponseNotAccepted;
            throw new errors_1.DidExchangeProblemReportError('DID Document signature is invalid.', { problemCode });
        }
        return didDocument;
    }
};
exports.DidExchangeProtocol = DidExchangeProtocol;
exports.DidExchangeProtocol = DidExchangeProtocol = __decorate([
    (0, core_1.injectable)(),
    __param(4, (0, core_1.inject)(core_1.InjectionSymbols.Logger)),
    __metadata("design:paramtypes", [services_2.ConnectionService,
        core_1.DidRepository,
        core_1.JwsService,
        services_1.DidCommDocumentService, Object])
], DidExchangeProtocol);
//# sourceMappingURL=DidExchangeProtocol.js.map