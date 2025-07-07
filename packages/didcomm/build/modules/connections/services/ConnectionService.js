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
exports.ConnectionService = void 0;
const core_1 = require("@credo-ts/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const DidCommModuleConfig_1 = require("../../../DidCommModuleConfig");
const SignatureDecoratorUtils_1 = require("../../../decorators/signature/SignatureDecoratorUtils");
const OutOfBandService_1 = require("../../oob/OutOfBandService");
const OutOfBandRole_1 = require("../../oob/domain/OutOfBandRole");
const OutOfBandState_1 = require("../../oob/domain/OutOfBandState");
const messages_1 = require("../../oob/messages");
const repository_1 = require("../../oob/repository");
const outOfBandRecordMetadataTypes_1 = require("../../oob/repository/outOfBandRecordMetadataTypes");
const ConnectionEvents_1 = require("../ConnectionEvents");
const errors_1 = require("../errors");
const messages_2 = require("../messages");
const models_1 = require("../models");
const repository_2 = require("../repository");
const helpers_1 = require("./helpers");
let ConnectionService = class ConnectionService {
    constructor(logger, connectionRepository, didRepository, eventEmitter) {
        this.connectionRepository = connectionRepository;
        this.didRepository = didRepository;
        this.eventEmitter = eventEmitter;
        this.logger = logger;
    }
    /**
     * Create a connection request message for a given out-of-band.
     *
     * @param outOfBandRecord out-of-band record for which to create a connection request
     * @param config config for creation of connection request
     * @returns outbound message containing connection request
     */
    async createRequest(agentContext, outOfBandRecord, config) {
        this.logger.debug(`Create message ${messages_2.ConnectionRequestMessage.type.messageTypeUri} start`, outOfBandRecord);
        outOfBandRecord.assertRole(OutOfBandRole_1.OutOfBandRole.Receiver);
        outOfBandRecord.assertState(OutOfBandState_1.OutOfBandState.PrepareResponse);
        // TODO check there is no connection record for particular oob record
        const { outOfBandInvitation } = outOfBandRecord;
        const { mediatorId } = config.routing;
        const { didDoc, keys } = this.createDidDoc(config.routing);
        // TODO: We should store only one did that we'll use to send the request message with success.
        // We take just the first one for now.
        const [invitationDid] = outOfBandInvitation.invitationDids;
        const { did: peerDid } = await this.createDid(agentContext, {
            role: core_1.DidDocumentRole.Created,
            didDoc,
            keys,
        });
        const { label, imageUrl } = config;
        const didcommConfig = agentContext.dependencyManager.resolve(DidCommModuleConfig_1.DidCommModuleConfig);
        const connectionRequest = new messages_2.ConnectionRequestMessage({
            label: label ?? agentContext.config.label,
            did: didDoc.id,
            didDoc,
            imageUrl: imageUrl ?? didcommConfig.connectionImageUrl,
        });
        connectionRequest.setThread({
            threadId: connectionRequest.threadId,
            parentThreadId: outOfBandRecord.outOfBandInvitation.id,
        });
        const connectionRecord = await this.createConnection(agentContext, {
            protocol: models_1.HandshakeProtocol.Connections,
            role: models_1.DidExchangeRole.Requester,
            state: models_1.DidExchangeState.InvitationReceived,
            theirLabel: outOfBandInvitation.label,
            alias: config?.alias,
            did: peerDid,
            mediatorId,
            autoAcceptConnection: config?.autoAcceptConnection,
            outOfBandId: outOfBandRecord.id,
            invitationDid,
            imageUrl: outOfBandInvitation.imageUrl,
            threadId: connectionRequest.threadId,
        });
        await this.updateState(agentContext, connectionRecord, models_1.DidExchangeState.RequestSent);
        return {
            connectionRecord,
            message: connectionRequest,
        };
    }
    async processRequest(messageContext, outOfBandRecord) {
        this.logger.debug(`Process message ${messages_2.ConnectionRequestMessage.type.messageTypeUri} start`, {
            message: messageContext.message,
        });
        outOfBandRecord.assertRole(OutOfBandRole_1.OutOfBandRole.Sender);
        outOfBandRecord.assertState(OutOfBandState_1.OutOfBandState.AwaitResponse);
        // TODO check there is no connection record for particular oob record
        const { message } = messageContext;
        if (!message.connection.didDoc) {
            throw new errors_1.ConnectionProblemReportError('Public DIDs are not supported yet', {
                problemCode: errors_1.ConnectionProblemReportReason.RequestNotAccepted,
            });
        }
        const { did: peerDid } = await this.createDid(messageContext.agentContext, {
            role: core_1.DidDocumentRole.Received,
            didDoc: message.connection.didDoc,
        });
        const connectionRecord = await this.createConnection(messageContext.agentContext, {
            protocol: models_1.HandshakeProtocol.Connections,
            role: models_1.DidExchangeRole.Responder,
            state: models_1.DidExchangeState.RequestReceived,
            alias: outOfBandRecord.alias,
            theirLabel: message.label,
            imageUrl: message.imageUrl,
            outOfBandId: outOfBandRecord.id,
            theirDid: peerDid,
            threadId: message.threadId,
            mediatorId: outOfBandRecord.mediatorId,
            autoAcceptConnection: outOfBandRecord.autoAcceptConnection,
        });
        await this.connectionRepository.update(messageContext.agentContext, connectionRecord);
        this.emitStateChangedEvent(messageContext.agentContext, connectionRecord, null);
        this.logger.debug(`Process message ${messages_2.ConnectionRequestMessage.type.messageTypeUri} end`, connectionRecord);
        return connectionRecord;
    }
    /**
     * Create a connection response message for the connection with the specified connection id.
     *
     * @param connectionRecord the connection for which to create a connection response
     * @returns outbound message containing connection response
     */
    async createResponse(agentContext, connectionRecord, outOfBandRecord, routing) {
        this.logger.debug(`Create message ${messages_2.ConnectionResponseMessage.type.messageTypeUri} start`, connectionRecord);
        connectionRecord.assertState(models_1.DidExchangeState.RequestReceived);
        connectionRecord.assertRole(models_1.DidExchangeRole.Responder);
        let didDoc;
        let keys;
        if (routing) {
            const result = this.createDidDoc(routing);
            didDoc = result.didDoc;
            keys = result.keys;
        }
        else if (outOfBandRecord.outOfBandInvitation.getInlineServices().length > 0) {
            const result = this.createDidDocFromOutOfBandDidCommServices(outOfBandRecord);
            didDoc = result.didDoc;
            keys = result.keys;
        }
        else {
            // We don't support using a did from the OOB invitation services currently, in this case we always pass routing to this method
            throw new core_1.CredoError('No routing provided, and no inline services found in out of band invitation. When using did services in out of band invitation, make sure to provide routing information for rotation.');
        }
        const { did: peerDid } = await this.createDid(agentContext, {
            role: core_1.DidDocumentRole.Created,
            didDoc,
            keys,
        });
        const connection = new models_1.Connection({
            did: didDoc.id,
            didDoc,
        });
        const connectionJson = core_1.JsonTransformer.toJSON(connection);
        if (!connectionRecord.threadId) {
            throw new core_1.CredoError(`Connection record with id ${connectionRecord.id} does not have a thread id`);
        }
        let signingKey;
        const firstService = outOfBandRecord.outOfBandInvitation.getServices()[0];
        if (typeof firstService === 'string') {
            const dids = agentContext.resolve(core_1.DidsApi);
            const resolved = await dids.resolveCreatedDidDocumentWithKeys((0, core_1.parseDid)(firstService).did);
            const recipientKeys = resolved.didDocument.getRecipientKeysWithVerificationMethod({ mapX25519ToEd25519: true });
            if (recipientKeys.length === 0) {
                throw new core_1.CredoError(`Unable to extract signing key for connection response from did '${firstService}'`);
            }
            signingKey = recipientKeys[0].publicJwk;
            // TOOD: we probably need an util: addKeyIdToVerificationMethodKey
            signingKey.keyId =
                resolved.keys?.find(({ didDocumentRelativeKeyId }) => recipientKeys[0].verificationMethod.id.endsWith(didDocumentRelativeKeyId))?.kmsKeyId ?? signingKey.legacyKeyId;
        }
        else {
            const service = (0, helpers_1.getResolvedDidcommServiceWithSigningKeyId)(firstService, outOfBandRecord.invitationInlineServiceKeys);
            signingKey = service.recipientKeys[0];
        }
        const connectionResponse = new messages_2.ConnectionResponseMessage({
            threadId: connectionRecord.threadId,
            connectionSig: await (0, SignatureDecoratorUtils_1.signData)(agentContext, connectionJson, signingKey),
        });
        connectionRecord.did = peerDid;
        await this.updateState(agentContext, connectionRecord, models_1.DidExchangeState.ResponseSent);
        this.logger.debug(`Create message ${messages_2.ConnectionResponseMessage.type.messageTypeUri} end`, {
            connectionRecord,
            message: connectionResponse,
        });
        return {
            connectionRecord,
            message: connectionResponse,
        };
    }
    /**
     * Process a received connection response message. This will not accept the connection request
     * or send a connection acknowledgement message. It will only update the existing connection record
     * with all the new information from the connection response message. Use {@link ConnectionService.createTrustPing}
     * after calling this function to create a trust ping message.
     *
     * @param messageContext the message context containing a connection response message
     * @returns updated connection record
     */
    async processResponse(messageContext, outOfBandRecord) {
        this.logger.debug(`Process message ${messages_2.ConnectionResponseMessage.type.messageTypeUri} start`, {
            message: messageContext.message,
        });
        const { connection: connectionRecord, message, recipientKey, senderKey } = messageContext;
        if (!recipientKey || !senderKey) {
            throw new core_1.CredoError('Unable to process connection request without senderKey or recipientKey');
        }
        if (!connectionRecord) {
            throw new core_1.CredoError('No connection record in message context.');
        }
        connectionRecord.assertState(models_1.DidExchangeState.RequestSent);
        connectionRecord.assertRole(models_1.DidExchangeRole.Requester);
        let connectionJson = null;
        try {
            connectionJson = await (0, SignatureDecoratorUtils_1.unpackAndVerifySignatureDecorator)(messageContext.agentContext, message.connectionSig);
        }
        catch (error) {
            if (error instanceof core_1.CredoError) {
                throw new errors_1.ConnectionProblemReportError(error.message, {
                    problemCode: errors_1.ConnectionProblemReportReason.ResponseProcessingError,
                });
            }
            throw error;
        }
        const connection = core_1.JsonTransformer.fromJSON(connectionJson, models_1.Connection);
        // Per the Connection RFC we must check if the key used to sign the connection~sig is the same key
        // as the recipient key(s) in the connection invitation message
        const signerVerkey = message.connectionSig.signer;
        const invitationKey = core_1.Kms.PublicJwk.fromFingerprint(outOfBandRecord.getTags().recipientKeyFingerprints[0]);
        if (!invitationKey.is(core_1.Kms.Ed25519PublicJwk)) {
            throw new errors_1.ConnectionProblemReportError(`Expected invitation key to be an Ed25519 key, found ${invitationKey.jwkTypehumanDescription}`, { problemCode: errors_1.ConnectionProblemReportReason.ResponseNotAccepted });
        }
        const invitationKeyBase58 = core_1.TypedArrayEncoder.toBase58(invitationKey.publicKey.publicKey);
        if (signerVerkey !== invitationKeyBase58) {
            throw new errors_1.ConnectionProblemReportError(`Connection object in connection response message is not signed with same key as recipient key in invitation expected='${invitationKey}' received='${signerVerkey}'`, { problemCode: errors_1.ConnectionProblemReportReason.ResponseNotAccepted });
        }
        if (!connection.didDoc) {
            throw new core_1.CredoError('DID Document is missing.');
        }
        const { did: peerDid } = await this.createDid(messageContext.agentContext, {
            role: core_1.DidDocumentRole.Received,
            didDoc: connection.didDoc,
        });
        connectionRecord.theirDid = peerDid;
        connectionRecord.threadId = message.threadId;
        await this.updateState(messageContext.agentContext, connectionRecord, models_1.DidExchangeState.ResponseReceived);
        return connectionRecord;
    }
    /**
     * Create a trust ping message for the connection with the specified connection id.
     *
     * By default a trust ping message should elicit a response. If this is not desired the
     * `config.responseRequested` property can be set to `false`.
     *
     * @param connectionRecord the connection for which to create a trust ping message
     * @param config the config for the trust ping message
     * @returns outbound message containing trust ping message
     */
    async createTrustPing(agentContext, connectionRecord, config = {}) {
        connectionRecord.assertState([models_1.DidExchangeState.ResponseReceived, models_1.DidExchangeState.Completed]);
        // TODO:
        //  - create ack message
        //  - maybe this shouldn't be in the connection service?
        const trustPing = new messages_2.TrustPingMessage(config);
        // Only update connection record and emit an event if the state is not already 'Complete'
        if (connectionRecord.state !== models_1.DidExchangeState.Completed) {
            await this.updateState(agentContext, connectionRecord, models_1.DidExchangeState.Completed);
        }
        return {
            connectionRecord,
            message: trustPing,
        };
    }
    /**
     * Process a received ack message. This will update the state of the connection
     * to Completed if this is not already the case.
     *
     * @param messageContext the message context containing an ack message
     * @returns updated connection record
     */
    async processAck(messageContext) {
        const { connection, recipientKey } = messageContext;
        if (!connection) {
            throw new core_1.CredoError(`Unable to process connection ack: connection for recipient key ${recipientKey?.fingerprint} not found`);
        }
        // TODO: This is better addressed in a middleware of some kind because
        // any message can transition the state to complete, not just an ack or trust ping
        if (connection.state === models_1.DidExchangeState.ResponseSent && connection.role === models_1.DidExchangeRole.Responder) {
            await this.updateState(messageContext.agentContext, connection, models_1.DidExchangeState.Completed);
        }
        return connection;
    }
    /**
     * Process a received {@link ProblemReportMessage}.
     *
     * @param messageContext The message context containing a connection problem report message
     * @returns connection record associated with the connection problem report message
     *
     */
    async processProblemReport(messageContext) {
        const { message: connectionProblemReportMessage, recipientKey, senderKey } = messageContext;
        this.logger.debug(`Processing connection problem report for verkey ${recipientKey?.fingerprint}`);
        if (!recipientKey) {
            throw new core_1.CredoError('Unable to process connection problem report without recipientKey');
        }
        const ourDidRecord = await this.didRepository.findCreatedDidByRecipientKey(messageContext.agentContext, recipientKey);
        if (!ourDidRecord) {
            throw new core_1.CredoError(`Unable to process connection problem report: created did record for recipient key ${recipientKey.fingerprint} not found`);
        }
        const connectionRecord = await this.findByOurDid(messageContext.agentContext, ourDidRecord.did);
        if (!connectionRecord) {
            throw new core_1.CredoError(`Unable to process connection problem report: connection for recipient key ${recipientKey.fingerprint} not found`);
        }
        const theirDidRecord = connectionRecord.theirDid &&
            (await this.didRepository.findReceivedDid(messageContext.agentContext, connectionRecord.theirDid));
        if (!theirDidRecord) {
            throw new core_1.CredoError(`Received did record for did ${connectionRecord.theirDid} not found.`);
        }
        if (senderKey) {
            if (!theirDidRecord?.getTags().recipientKeyFingerprints?.includes(senderKey.fingerprint)) {
                throw new core_1.CredoError("Sender key doesn't match key of connection record");
            }
        }
        connectionRecord.errorMessage = `${connectionProblemReportMessage.description.code} : ${connectionProblemReportMessage.description.en}`;
        await this.update(messageContext.agentContext, connectionRecord);
        // Marking connection as abandoned in case of problem report from issuer agent
        // TODO: Can be conditionally abandoned - Like if another user is scanning already used connection invite where issuer will send invite-already-used problem code.
        await this.updateState(messageContext.agentContext, connectionRecord, models_1.DidExchangeState.Abandoned);
        return connectionRecord;
    }
    /**
     * Assert that an inbound message either has a connection associated with it,
     * or has everything correctly set up for connection-less exchange (optionally with out of band)
     *
     * @param messageContext - the inbound message context
     */
    async assertConnectionOrOutOfBandExchange(messageContext, { lastSentMessage, lastReceivedMessage, expectedConnectionId, } = {}) {
        const { connection, message } = messageContext;
        if (expectedConnectionId && !connection) {
            throw new core_1.CredoError(`Expected incoming message to be from connection ${expectedConnectionId} but no connection found.`);
        }
        if (expectedConnectionId && connection?.id !== expectedConnectionId) {
            throw new core_1.CredoError(`Expected incoming message to be from connection ${expectedConnectionId} but connection is ${connection?.id}.`);
        }
        // Check if we have a ready connection. Verification is already done somewhere else. Return
        if (connection) {
            connection.assertReady();
            this.logger.debug(`Processing message with id ${message.id} and connection id ${connection.id}`, {
                type: message.type,
            });
        }
        else {
            this.logger.debug(`Processing connection-less message with id ${message.id}`, {
                type: message.type,
            });
            const recipientKey = messageContext.recipientKey;
            const senderKey = messageContext.senderKey;
            // set theirService to the value of lastReceivedMessage.service
            let theirService = messageContext.message?.service?.resolvedDidCommService ?? lastReceivedMessage?.service?.resolvedDidCommService;
            let ourService = lastSentMessage?.service?.resolvedDidCommService;
            // FIXME: we should remove support for the flow where no out of band record is used.
            // Users have had enough time to update to the OOB API which supports legacy connectionsless
            // invitations as well
            // 1. check if there's an oob record associated.
            const outOfBandRepository = messageContext.agentContext.dependencyManager.resolve(repository_1.OutOfBandRepository);
            const outOfBandService = messageContext.agentContext.dependencyManager.resolve(OutOfBandService_1.OutOfBandService);
            const outOfBandRecord = await outOfBandRepository.findSingleByQuery(messageContext.agentContext, {
                invitationRequestsThreadIds: [message.threadId],
            });
            // If we have an out of band record, we can extract the service for our/the other party from the oob record
            if (outOfBandRecord?.role === OutOfBandRole_1.OutOfBandRole.Sender) {
                ourService = await outOfBandService.getResolvedServiceForOutOfBandServices(messageContext.agentContext, outOfBandRecord.outOfBandInvitation.getServices(), outOfBandRecord.invitationInlineServiceKeys);
            }
            else if (outOfBandRecord?.role === OutOfBandRole_1.OutOfBandRole.Receiver) {
                theirService = await outOfBandService.getResolvedServiceForOutOfBandServices(messageContext.agentContext, outOfBandRecord.outOfBandInvitation.getServices());
            }
            // theirService can be null when we receive an oob invitation and process the message.
            // In this case there MUST be an oob record, otherwise there is no way for us to reply
            // to the message
            if (!theirService && !outOfBandRecord) {
                throw new core_1.CredoError('No service for incoming connection-less message and no associated out of band record found.');
            }
            // ourService can be null when we receive an oob invitation or legacy connectionless message and process the message.
            // In this case lastSentMessage and lastReceivedMessage MUST be null, because there shouldn't be any previous exchange
            if (!ourService && (lastReceivedMessage || lastSentMessage)) {
                throw new core_1.CredoError('No keys on our side to use for encrypting messages, and previous messages found (in which case our keys MUST also be present).');
            }
            // If the message is unpacked or AuthCrypt, there cannot be any previous exchange (this must be the first message).
            // All exchange after the first unpacked oob exchange MUST be encrypted.
            if ((!senderKey || !recipientKey) && (lastSentMessage || lastReceivedMessage)) {
                throw new core_1.CredoError('Incoming message must have recipientKey and senderKey (so cannot be AuthCrypt or unpacked) if there are lastSentMessage or lastReceivedMessage.');
            }
            // Check if recipientKey is in ourService
            if (recipientKey && ourService) {
                const recipientKeyFound = ourService.recipientKeys.some((key) => recipientKey.equals(key));
                if (!recipientKeyFound) {
                    throw new core_1.CredoError(`Recipient key ${recipientKey.fingerprint} not found in our service`);
                }
            }
            // Check if senderKey is in theirService
            if (senderKey && theirService) {
                const senderKeyFound = theirService.recipientKeys.some((key) => senderKey.equals(key));
                if (!senderKeyFound) {
                    throw new core_1.CredoError(`Sender key ${senderKey.fingerprint} not found in their service.`);
                }
            }
        }
    }
    /**
     * If knownConnectionId is passed, it will compare the incoming connection id with the knownConnectionId, and skip the other validation.
     *
     * If no known connection id is passed, it asserts that the incoming message is in response to an attached request message to an out of band invitation.
     * If is the case, and the state of the out of band record is still await response, the state will be updated to done
     *
     */
    async matchIncomingMessageToRequestMessageInOutOfBandExchange(messageContext, { expectedConnectionId }) {
        if (expectedConnectionId && messageContext.connection?.id !== expectedConnectionId) {
            throw new core_1.CredoError(`Expecting incoming message to have connection ${expectedConnectionId}, but incoming connection is ${messageContext.connection?.id ?? 'undefined'}`);
        }
        const outOfBandRepository = messageContext.agentContext.dependencyManager.resolve(repository_1.OutOfBandRepository);
        const outOfBandInvitationId = messageContext.message.thread?.parentThreadId;
        // Find the out of band record that is associated with this request
        const outOfBandRecord = await outOfBandRepository.findSingleByQuery(messageContext.agentContext, {
            invitationId: outOfBandInvitationId,
            role: OutOfBandRole_1.OutOfBandRole.Sender,
            invitationRequestsThreadIds: [messageContext.message.threadId],
        });
        // There is no out of band record
        if (!outOfBandRecord) {
            throw new core_1.CredoError(`No out of band record found for credential request message with thread ${messageContext.message.threadId}, out of band invitation id ${outOfBandInvitationId} and role ${OutOfBandRole_1.OutOfBandRole.Sender}`);
        }
        const legacyInvitationMetadata = outOfBandRecord.metadata.get(outOfBandRecordMetadataTypes_1.OutOfBandRecordMetadataKeys.LegacyInvitation);
        // If the original invitation was a legacy connectionless invitation, it's okay if the message does not have a pthid.
        if (legacyInvitationMetadata?.legacyInvitationType !== messages_1.InvitationType.Connectionless &&
            outOfBandRecord.outOfBandInvitation.id !== outOfBandInvitationId) {
            throw new core_1.CredoError('Response messages to out of band invitation requests MUST have a parent thread id that matches the out of band invitation id.');
        }
        // This should not happen, as it is not allowed to create reusable out of band invitations with attached messages
        // But should that implementation change, we at least cover it here.
        if (outOfBandRecord.reusable) {
            throw new core_1.CredoError('Receiving messages in response to reusable out of band invitations is not supported.');
        }
        if (outOfBandRecord.state === OutOfBandState_1.OutOfBandState.Done) {
            if (!messageContext.connection) {
                throw new core_1.CredoError("Can't find connection associated with incoming message, while out of band state is done. State must be await response if no connection has been created");
            }
            if (messageContext.connection.outOfBandId !== outOfBandRecord.id) {
                throw new core_1.CredoError('Connection associated with incoming message is not associated with the out of band invitation containing the attached message.');
            }
            // We're good to go. Connection was created and points to the correct out of band record. And the message is in response to an attached request message from the oob invitation.
        }
        else if (outOfBandRecord.state === OutOfBandState_1.OutOfBandState.AwaitResponse) {
            // We're good to go. Waiting for a response. And the message is in response to an attached request message from the oob invitation.
            // Now that we have received the first response message to our out of band invitation, we mark the out of band record as done
            outOfBandRecord.state = OutOfBandState_1.OutOfBandState.Done;
            await outOfBandRepository.update(messageContext.agentContext, outOfBandRecord);
        }
        else {
            throw new core_1.CredoError(`Out of band record is in incorrect state ${outOfBandRecord.state}`);
        }
    }
    async updateState(agentContext, connectionRecord, newState) {
        const previousState = connectionRecord.state;
        connectionRecord.state = newState;
        await this.connectionRepository.update(agentContext, connectionRecord);
        this.emitStateChangedEvent(agentContext, connectionRecord, previousState);
    }
    emitStateChangedEvent(agentContext, connectionRecord, previousState) {
        this.eventEmitter.emit(agentContext, {
            type: ConnectionEvents_1.ConnectionEventTypes.ConnectionStateChanged,
            payload: {
                // Connection record in event should be static
                connectionRecord: connectionRecord.clone(),
                previousState,
            },
        });
    }
    update(agentContext, connectionRecord) {
        return this.connectionRepository.update(agentContext, connectionRecord);
    }
    /**
     * Retrieve all connections records
     *
     * @returns List containing all connection records
     */
    getAll(agentContext) {
        return this.connectionRepository.getAll(agentContext);
    }
    /**
     * Retrieve a connection record by id
     *
     * @param connectionId The connection record id
     * @throws {RecordNotFoundError} If no record is found
     * @return The connection record
     *
     */
    getById(agentContext, connectionId) {
        return this.connectionRepository.getById(agentContext, connectionId);
    }
    /**
     * Find a connection record by id
     *
     * @param connectionId the connection record id
     * @returns The connection record or null if not found
     */
    findById(agentContext, connectionId) {
        return this.connectionRepository.findById(agentContext, connectionId);
    }
    /**
     * Delete a connection record by id
     *
     * @param connectionId the connection record id
     */
    async deleteById(agentContext, connectionId) {
        const connectionRecord = await this.getById(agentContext, connectionId);
        return this.connectionRepository.delete(agentContext, connectionRecord);
    }
    async findByDids(agentContext, query) {
        return this.connectionRepository.findByDids(agentContext, query);
    }
    /**
     * Retrieve a connection record by thread id
     *
     * @param threadId The thread id
     * @throws {RecordNotFoundError} If no record is found
     * @throws {RecordDuplicateError} If multiple records are found
     * @returns The connection record
     */
    async getByThreadId(agentContext, threadId) {
        return this.connectionRepository.getByThreadId(agentContext, threadId);
    }
    async getByRoleAndThreadId(agentContext, role, threadId) {
        return this.connectionRepository.getByRoleAndThreadId(agentContext, role, threadId);
    }
    async findByTheirDid(agentContext, theirDid) {
        return this.connectionRepository.findSingleByQuery(agentContext, { theirDid });
    }
    async findByOurDid(agentContext, ourDid) {
        return this.connectionRepository.findSingleByQuery(agentContext, { did: ourDid });
    }
    async findAllByOutOfBandId(agentContext, outOfBandId) {
        return this.connectionRepository.findByQuery(agentContext, { outOfBandId });
    }
    async findAllByConnectionTypes(agentContext, connectionTypes) {
        return this.connectionRepository.findByQuery(agentContext, { connectionTypes });
    }
    async findByInvitationDid(agentContext, invitationDid) {
        return this.connectionRepository.findByQuery(agentContext, { invitationDid });
    }
    async findByKeys(agentContext, { senderKey, recipientKey, }) {
        const theirDidRecord = await this.didRepository.findReceivedDidByRecipientKey(agentContext, senderKey);
        if (theirDidRecord) {
            const ourDidRecord = await this.didRepository.findCreatedDidByRecipientKey(agentContext, recipientKey);
            if (ourDidRecord) {
                const connectionRecord = await this.findByDids(agentContext, {
                    ourDid: ourDidRecord.did,
                    theirDid: theirDidRecord.did,
                });
                if (connectionRecord?.isReady)
                    return connectionRecord;
            }
        }
        this.logger.debug(`No connection record found for encrypted message with recipient key ${recipientKey.fingerprint} and sender key ${senderKey.fingerprint}`);
        return null;
    }
    async findAllByQuery(agentContext, query, queryOptions) {
        return this.connectionRepository.findByQuery(agentContext, query, queryOptions);
    }
    async createConnection(agentContext, options) {
        const connectionRecord = new repository_2.ConnectionRecord(options);
        await this.connectionRepository.save(agentContext, connectionRecord);
        return connectionRecord;
    }
    async addConnectionType(agentContext, connectionRecord, type) {
        const connectionTypes = connectionRecord.connectionTypes || [];
        connectionRecord.connectionTypes = [type, ...connectionTypes];
        await this.update(agentContext, connectionRecord);
    }
    async removeConnectionType(agentContext, connectionRecord, type) {
        connectionRecord.connectionTypes = connectionRecord.connectionTypes.filter((value) => value !== type);
        await this.update(agentContext, connectionRecord);
    }
    async getConnectionTypes(connectionRecord) {
        return connectionRecord.connectionTypes || [];
    }
    async createDid(agentContext, { role, didDoc, keys }) {
        if (keys && role !== core_1.DidDocumentRole.Created) {
            throw new core_1.CredoError(`keys can only be provided for did documents when the role is '${core_1.DidDocumentRole.Created}'`);
        }
        // Convert the legacy did doc to a new did document
        const { didDocument, keys: updatedKeys } = (0, helpers_1.convertToNewDidDocument)(didDoc, keys);
        // Assert that the keys we are going to use for creating a did document haven't already been used in another did document
        if (role === core_1.DidDocumentRole.Created) {
            await (0, helpers_1.assertNoCreatedDidExistsForKeys)(agentContext, didDocument.recipientKeys);
        }
        const peerDid = (0, core_1.didDocumentJsonToNumAlgo1Did)(didDocument.toJSON());
        didDocument.id = peerDid;
        const didRecord = new core_1.DidRecord({
            did: peerDid,
            role,
            didDocument,
            keys: updatedKeys,
        });
        // Store the unqualified did with the legacy did document in the metadata
        // Can be removed at a later stage if we know for sure we don't need it anymore
        didRecord.metadata.set(core_1.DidRecordMetadataKeys.LegacyDid, {
            unqualifiedDid: didDoc.id,
            didDocumentString: core_1.JsonTransformer.serialize(didDoc),
        });
        this.logger.debug('Saving DID record', {
            id: didRecord.id,
            did: didRecord.did,
            role: didRecord.role,
            tags: didRecord.getTags(),
            didDocument: 'omitted...',
        });
        await this.didRepository.save(agentContext, didRecord);
        this.logger.debug('Did record created.', didRecord);
        return { did: peerDid, didDocument };
    }
    createDidDoc(routing) {
        const recipientKeyBase58 = core_1.TypedArrayEncoder.toBase58(routing.recipientKey.publicKey.publicKey);
        const indyDid = core_1.utils.indyDidFromPublicKeyBase58(recipientKeyBase58);
        const keys = [
            {
                didDocumentRelativeKeyId: '#1',
                kmsKeyId: routing.recipientKey.keyId,
            },
        ];
        const publicKey = new models_1.Ed25119Sig2018({
            id: `${indyDid}#1`,
            controller: indyDid,
            publicKeyBase58: recipientKeyBase58,
        });
        const auth = new models_1.ReferencedAuthentication(publicKey, models_1.authenticationTypes.Ed25519VerificationKey2018);
        // IndyAgentService is old service type
        const services = routing.endpoints.map((endpoint, index) => new core_1.IndyAgentService({
            id: `${indyDid}#IndyAgentService-${index + 1}`,
            serviceEndpoint: endpoint,
            recipientKeys: [recipientKeyBase58],
            routingKeys: routing.routingKeys.map((key) => core_1.TypedArrayEncoder.toBase58(key.publicKey.publicKey)),
            // Order of endpoint determines priority
            priority: index,
        }));
        return {
            didDoc: new models_1.DidDoc({
                id: indyDid,
                authentication: [auth],
                service: services,
                publicKey: [publicKey],
            }),
            keys,
        };
    }
    createDidDocFromOutOfBandDidCommServices(outOfBandRecord) {
        const services = outOfBandRecord.outOfBandInvitation
            .getInlineServices()
            .map((service) => (0, helpers_1.getResolvedDidcommServiceWithSigningKeyId)(service, outOfBandRecord.invitationInlineServiceKeys));
        const [recipientKey] = services[0].recipientKeys;
        const recipientKeyBase58 = core_1.TypedArrayEncoder.toBase58(recipientKey.publicKey.publicKey);
        const did = core_1.utils.indyDidFromPublicKeyBase58(recipientKeyBase58);
        const publicKey = new models_1.Ed25119Sig2018({
            id: `${did}#1`,
            controller: did,
            publicKeyBase58: recipientKeyBase58,
        });
        const auth = new models_1.ReferencedAuthentication(publicKey, models_1.authenticationTypes.Ed25519VerificationKey2018);
        // IndyAgentService is old service type
        const service = services.map((service, index) => new core_1.IndyAgentService({
            id: `${did}#IndyAgentService-${index + 1}`,
            serviceEndpoint: service.serviceEndpoint,
            recipientKeys: [recipientKeyBase58],
            routingKeys: service.routingKeys?.map((publicJwk) => core_1.TypedArrayEncoder.toBase58(publicJwk.publicKey.publicKey)),
            priority: index,
        }));
        return {
            didDoc: new models_1.DidDoc({
                id: did,
                authentication: [auth],
                service,
                publicKey: [publicKey],
            }),
            keys: [{ didDocumentRelativeKeyId: '#1', kmsKeyId: recipientKey.keyId }],
        };
    }
    async returnWhenIsConnected(agentContext, connectionId, timeoutMs = 20000) {
        const isConnected = (connection) => {
            return connection.id === connectionId && connection.state === models_1.DidExchangeState.Completed;
        };
        const observable = this.eventEmitter.observable(ConnectionEvents_1.ConnectionEventTypes.ConnectionStateChanged);
        const subject = new rxjs_1.ReplaySubject(1);
        observable
            .pipe((0, core_1.filterContextCorrelationId)(agentContext.contextCorrelationId), (0, operators_1.map)((e) => e.payload.connectionRecord), (0, operators_1.first)(isConnected), // Do not wait for longer than specified timeout
        (0, operators_1.timeout)({
            first: timeoutMs,
            meta: 'ConnectionService.returnWhenIsConnected',
        }))
            .subscribe(subject);
        const connection = await this.getById(agentContext, connectionId);
        if (isConnected(connection)) {
            subject.next(connection);
        }
        return (0, rxjs_1.firstValueFrom)(subject);
    }
};
exports.ConnectionService = ConnectionService;
exports.ConnectionService = ConnectionService = __decorate([
    (0, core_1.injectable)(),
    __param(0, (0, core_1.inject)(core_1.InjectionSymbols.Logger)),
    __metadata("design:paramtypes", [Object, repository_2.ConnectionRepository,
        core_1.DidRepository,
        core_1.EventEmitter])
], ConnectionService);
//# sourceMappingURL=ConnectionService.js.map