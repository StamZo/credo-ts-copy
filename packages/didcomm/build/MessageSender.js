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
exports.MessageSender = void 0;
exports.isDidCommTransportQueue = isDidCommTransportQueue;
const core_1 = require("@credo-ts/core");
const DidCommModuleConfig_1 = require("./DidCommModuleConfig");
const EnvelopeService_1 = require("./EnvelopeService");
const Events_1 = require("./Events");
const TransportService_1 = require("./TransportService");
const constants_1 = require("./constants");
const TransportDecorator_1 = require("./decorators/transport/TransportDecorator");
const errors_1 = require("./errors");
const models_1 = require("./models");
const DidCommDocumentService_1 = require("./services/DidCommDocumentService");
let MessageSender = class MessageSender {
    constructor(envelopeService, transportService, didCommModuleConfig, didCommDocumentService, eventEmitter) {
        this._outboundTransports = [];
        this.envelopeService = envelopeService;
        this.transportService = transportService;
        this.queueTransportRepository = didCommModuleConfig.queueTransportRepository;
        this.didCommDocumentService = didCommDocumentService;
        this.eventEmitter = eventEmitter;
        this._outboundTransports = [];
    }
    get outboundTransports() {
        return this._outboundTransports;
    }
    registerOutboundTransport(outboundTransport) {
        this._outboundTransports.push(outboundTransport);
    }
    async unregisterOutboundTransport(outboundTransport) {
        this._outboundTransports = this.outboundTransports.filter((transport) => transport !== outboundTransport);
        await outboundTransport.stop();
    }
    async packMessage(agentContext, { keys, message, endpoint, }) {
        const encryptedMessage = await this.envelopeService.packMessage(agentContext, message, keys);
        return {
            payload: encryptedMessage,
            responseRequested: message.hasAnyReturnRoute(),
            endpoint,
        };
    }
    async sendMessageToSession(agentContext, session, message) {
        agentContext.config.logger.debug(`Packing message and sending it via existing session ${session.type}...`);
        if (!session.keys) {
            throw new core_1.CredoError(`There are no keys for the given ${session.type} transport session.`);
        }
        const encryptedMessage = await this.envelopeService.packMessage(agentContext, message, session.keys);
        agentContext.config.logger.debug('Sending message');
        await session.send(agentContext, encryptedMessage);
    }
    async sendPackage(agentContext, { connection, encryptedMessage, recipientKey, options, }) {
        const errors = [];
        // Try to send to already open session
        const session = this.transportService.findSessionByConnectionId(connection.id);
        if (session?.inboundMessage?.hasReturnRouting()) {
            try {
                await session.send(agentContext, encryptedMessage);
                return;
            }
            catch (error) {
                errors.push(error);
                agentContext.config.logger.debug(`Sending packed message via session failed with error: ${error.message}.`, error);
            }
        }
        // Retrieve DIDComm services
        const { services, queueService } = await this.retrieveServicesByConnection(agentContext, connection, options?.transportPriority);
        if (this.outboundTransports.length === 0 && !queueService) {
            throw new core_1.CredoError('Agent has no outbound transport!');
        }
        // Loop trough all available services and try to send the message
        for await (const service of services) {
            agentContext.config.logger.debug('Sending outbound message to service:', { service });
            try {
                const protocolScheme = core_1.utils.getProtocolScheme(service.serviceEndpoint);
                for (const transport of this.outboundTransports) {
                    if (transport.supportedSchemes.includes(protocolScheme)) {
                        await transport.sendMessage({
                            payload: encryptedMessage,
                            endpoint: service.serviceEndpoint,
                            connectionId: connection.id,
                        });
                        break;
                    }
                }
                return;
            }
            catch (error) {
                agentContext.config.logger.debug(`Sending outbound message to service with id ${service.id} failed with the following error:`, {
                    message: error.message,
                    error: error,
                });
            }
        }
        // We didn't succeed to send the message over open session, or directly to serviceEndpoint
        // If the other party shared a queue service endpoint in their did doc we queue the message
        if (queueService) {
            agentContext.config.logger.debug(`Queue packed message for connection ${connection.id} (${connection.theirLabel})`);
            await this.queueTransportRepository.addMessage(agentContext, {
                connectionId: connection.id,
                recipientDids: [(0, core_1.verkeyToDidKey)(recipientKey)],
                payload: encryptedMessage,
            });
            return;
        }
        // Message is undeliverable
        agentContext.config.logger.error(`Message is undeliverable to connection ${connection.id} (${connection.theirLabel})`, {
            message: encryptedMessage,
            errors,
            connection,
        });
        throw new core_1.CredoError(`Message is undeliverable to connection ${connection.id} (${connection.theirLabel})`);
    }
    async sendMessage(outboundMessageContext, options) {
        const { agentContext, connection, outOfBand, message } = outboundMessageContext;
        const errors = [];
        if (outboundMessageContext.isOutboundServiceMessage()) {
            return this.sendMessageToService(outboundMessageContext);
        }
        if (!connection) {
            agentContext.config.logger.error('Outbound message has no associated connection');
            this.emitMessageSentEvent(outboundMessageContext, models_1.OutboundMessageSendStatus.Undeliverable);
            throw new errors_1.MessageSendingError('Outbound message has no associated connection', {
                outboundMessageContext,
            });
        }
        agentContext.config.logger.debug('Send outbound message', {
            message,
            connectionId: connection.id,
        });
        const session = this.findSessionForOutboundContext(outboundMessageContext);
        if (session) {
            agentContext.config.logger.debug(`Found session with return routing for message '${message.id}' (connection '${connection.id}'`);
            try {
                await this.sendMessageToSession(agentContext, session, message);
                this.emitMessageSentEvent(outboundMessageContext, models_1.OutboundMessageSendStatus.SentToSession);
                return;
            }
            catch (error) {
                errors.push(error);
                agentContext.config.logger.debug(`Sending an outbound message via session failed with error: ${error.message}.`, error);
            }
        }
        // Retrieve DIDComm services
        let services = [];
        let queueService;
        try {
            ;
            ({ services, queueService } = await this.retrieveServicesByConnection(agentContext, connection, options?.transportPriority, outOfBand));
        }
        catch (error) {
            agentContext.config.logger.error(`Unable to retrieve services for connection '${connection.id}. ${error.message}`);
            this.emitMessageSentEvent(outboundMessageContext, models_1.OutboundMessageSendStatus.Undeliverable);
            throw new errors_1.MessageSendingError(`Unable to retrieve services for connection '${connection.id}`, {
                outboundMessageContext,
                cause: error,
            });
        }
        if (!connection.did) {
            agentContext.config.logger.error(`Unable to send message using connection '${connection.id}' that doesn't have a did`);
            this.emitMessageSentEvent(outboundMessageContext, models_1.OutboundMessageSendStatus.Undeliverable);
            throw new errors_1.MessageSendingError(`Unable to send message using connection '${connection.id}' that doesn't have a did`, { outboundMessageContext });
        }
        const dids = agentContext.resolve(core_1.DidsApi);
        const { didDocument, keys } = await dids.resolveCreatedDidDocumentWithKeys(connection.did).catch((error) => {
            agentContext.config.logger.error(`Unable to send message using connection '${connection.id}', unable to resolve did`, {
                error,
            });
            this.emitMessageSentEvent(outboundMessageContext, models_1.OutboundMessageSendStatus.Undeliverable);
            throw new errors_1.MessageSendingError(`Unable to send message using connection '${connection.id}'. Unble to resolve did`, { outboundMessageContext, cause: error });
        });
        const authentication = didDocument.authentication
            ?.map((a) => {
            const verificationMethod = typeof a === 'string' ? didDocument.dereferenceVerificationMethod(a) : a;
            const publicJwk = (0, core_1.getPublicJwkFromVerificationMethod)(verificationMethod);
            const kmsKeyId = keys?.find((key) => verificationMethod.id.endsWith(key.didDocumentRelativeKeyId))?.kmsKeyId;
            // Set stored key id, or fallback to legacy key id
            publicJwk.keyId = kmsKeyId ?? publicJwk.legacyKeyId;
            return { verificationMethod, publicJwk, kmsKeyId };
        })
            .filter((v) => v.publicJwk.is(core_1.Kms.Ed25519PublicJwk));
        // We take the first one with a kms key id. Otherwise we pick the first
        const senderVerificationMethod = authentication?.find((a) => a.kmsKeyId !== undefined) ?? authentication?.[0];
        if (!senderVerificationMethod) {
            throw new errors_1.MessageSendingError(`Unable to determine sender key for did ${connection.did}, no available Ed25519 keys`, {
                outboundMessageContext,
            });
        }
        // If the returnRoute is already set we won't override it. This allows to set the returnRoute manually if this is desired.
        const shouldAddReturnRoute = message.transport?.returnRoute === undefined && !this.transportService.hasInboundEndpoint(didDocument);
        // Loop trough all available services and try to send the message
        for await (const service of services) {
            try {
                // Enable return routing if the our did document does not have any inbound endpoint for given sender key
                await this.sendToService(new models_1.OutboundMessageContext(message, {
                    agentContext,
                    serviceParams: {
                        service,
                        senderKey: senderVerificationMethod.publicJwk,
                        returnRoute: shouldAddReturnRoute,
                    },
                    connection,
                }));
                this.emitMessageSentEvent(outboundMessageContext, models_1.OutboundMessageSendStatus.SentToTransport);
                return;
            }
            catch (error) {
                errors.push(error);
                agentContext.config.logger.debug(`Sending outbound message to service with id ${service.id} failed with the following error:`, {
                    message: error.message,
                    error: error,
                });
            }
        }
        // We didn't succeed to send the message over open session, or directly to serviceEndpoint
        // If the other party shared a queue service endpoint in their did doc we queue the message
        if (queueService && message.allowQueueTransport) {
            agentContext.config.logger.debug(`Queue message for connection ${connection.id} (${connection.theirLabel})`);
            const keys = {
                recipientKeys: queueService.recipientKeys,
                routingKeys: queueService.routingKeys,
                senderKey: senderVerificationMethod.publicJwk,
            };
            const encryptedMessage = await this.envelopeService.packMessage(agentContext, message, keys);
            await this.queueTransportRepository.addMessage(agentContext, {
                connectionId: connection.id,
                recipientDids: keys.recipientKeys.map((item) => new core_1.DidKey(item).did),
                payload: encryptedMessage,
            });
            this.emitMessageSentEvent(outboundMessageContext, models_1.OutboundMessageSendStatus.QueuedForPickup);
            return;
        }
        // Message is undeliverable
        agentContext.config.logger.error(`Message is undeliverable to connection ${connection.id} (${connection.theirLabel})`, {
            message,
            errors,
            connection,
        });
        this.emitMessageSentEvent(outboundMessageContext, models_1.OutboundMessageSendStatus.Undeliverable);
        throw new errors_1.MessageSendingError(`Message is undeliverable to connection ${connection.id} (${connection.theirLabel})`, { outboundMessageContext });
    }
    async sendMessageToService(outboundMessageContext) {
        const session = this.findSessionForOutboundContext(outboundMessageContext);
        if (session) {
            outboundMessageContext.agentContext.config.logger.debug(`Found session with return routing for message '${outboundMessageContext.message.id}'`);
            try {
                await this.sendMessageToSession(outboundMessageContext.agentContext, session, outboundMessageContext.message);
                this.emitMessageSentEvent(outboundMessageContext, models_1.OutboundMessageSendStatus.SentToSession);
                return;
            }
            catch (error) {
                outboundMessageContext.agentContext.config.logger.debug(`Sending an outbound message via session failed with error: ${error.message}.`, error);
            }
        }
        // If there is no session try sending to service instead
        try {
            await this.sendToService(outboundMessageContext);
            this.emitMessageSentEvent(outboundMessageContext, models_1.OutboundMessageSendStatus.SentToTransport);
        }
        catch (error) {
            outboundMessageContext.agentContext.config.logger.error(`Message is undeliverable to service with id ${outboundMessageContext.serviceParams?.service.id}: ${error.message}`, {
                message: outboundMessageContext.message,
                error,
            });
            this.emitMessageSentEvent(outboundMessageContext, models_1.OutboundMessageSendStatus.Undeliverable);
            throw new errors_1.MessageSendingError(`Message is undeliverable to service with id ${outboundMessageContext.serviceParams?.service.id}: ${error.message}`, { outboundMessageContext });
        }
    }
    async sendToService(outboundMessageContext) {
        const { agentContext, message, serviceParams, connection } = outboundMessageContext;
        if (!serviceParams) {
            throw new core_1.CredoError('No service parameters found in outbound message context');
        }
        const { service, senderKey, returnRoute } = serviceParams;
        if (this.outboundTransports.length === 0) {
            throw new core_1.CredoError('Agent has no outbound transport!');
        }
        agentContext.config.logger.debug('Sending outbound message to service:', {
            messageId: message.id,
            service: { ...service, recipientKeys: 'omitted...', routingKeys: 'omitted...' },
        });
        const keys = {
            recipientKeys: service.recipientKeys,
            routingKeys: service.routingKeys,
            senderKey,
        };
        // Set return routing for message if requested
        if (returnRoute) {
            message.setReturnRouting(TransportDecorator_1.ReturnRouteTypes.all);
        }
        try {
            core_1.MessageValidator.validateSync(message);
        }
        catch (error) {
            agentContext.config.logger.error(`Aborting sending outbound message ${message.type} to ${service.serviceEndpoint}. Message validation failed`, {
                errors: error,
                message: message.toJSON(),
            });
            throw error;
        }
        const outboundPackage = await this.packMessage(agentContext, { message, keys, endpoint: service.serviceEndpoint });
        outboundPackage.endpoint = service.serviceEndpoint;
        outboundPackage.connectionId = connection?.id;
        for (const transport of this.outboundTransports) {
            const protocolScheme = core_1.utils.getProtocolScheme(service.serviceEndpoint);
            if (!protocolScheme) {
                agentContext.config.logger.warn('Service does not have a protocol scheme.');
            }
            else if (transport.supportedSchemes.includes(protocolScheme)) {
                await transport.sendMessage(outboundPackage);
                return;
            }
        }
        throw new errors_1.MessageSendingError(`Unable to send message to service: ${service.serviceEndpoint}`, {
            outboundMessageContext,
        });
    }
    findSessionForOutboundContext(outboundContext) {
        let session = undefined;
        // Use session id from outbound context if present, or use the session from the inbound message context
        const sessionId = outboundContext.sessionId ?? outboundContext.inboundMessageContext?.sessionId;
        // Try to find session by id
        if (sessionId) {
            session = this.transportService.findSessionById(sessionId);
        }
        // Try to find session by connection id
        if (!session && outboundContext.connection?.id) {
            session = this.transportService.findSessionByConnectionId(outboundContext.connection.id);
        }
        return session?.inboundMessage?.hasAnyReturnRoute() ? session : null;
    }
    async retrieveServicesByConnection(agentContext, connection, transportPriority, outOfBand) {
        agentContext.config.logger.debug(`Retrieving services for connection '${connection.id}' (${connection.theirLabel})`, {
            transportPriority,
            connection,
        });
        let didCommServices = [];
        if (connection.theirDid) {
            agentContext.config.logger.debug(`Resolving services for connection theirDid ${connection.theirDid}.`);
            didCommServices = await this.didCommDocumentService.resolveServicesFromDid(agentContext, connection.theirDid);
        }
        else if (outOfBand) {
            agentContext.config.logger.debug(`Resolving services from out-of-band record ${outOfBand.id}.`);
            if (connection.isRequester) {
                for (const service of outOfBand.outOfBandInvitation.getServices()) {
                    // Resolve dids to DIDDocs to retrieve services
                    if (typeof service === 'string') {
                        agentContext.config.logger.debug(`Resolving services for did ${service}.`);
                        didCommServices.push(...(await this.didCommDocumentService.resolveServicesFromDid(agentContext, service)));
                    }
                    else {
                        // Out of band inline service contains keys encoded as did:key references
                        didCommServices.push({
                            id: service.id,
                            recipientKeys: service.recipientKeys.map(core_1.didKeyToEd25519PublicJwk),
                            routingKeys: service.routingKeys?.map(core_1.didKeyToEd25519PublicJwk) || [],
                            serviceEndpoint: service.serviceEndpoint,
                        });
                    }
                }
            }
        }
        // Separate queue service out
        let services = didCommServices.filter((s) => !isDidCommTransportQueue(s.serviceEndpoint));
        const queueService = didCommServices.find((s) => isDidCommTransportQueue(s.serviceEndpoint));
        // If restrictive will remove services not listed in schemes list
        if (transportPriority?.restrictive) {
            services = services.filter((service) => {
                const serviceSchema = core_1.utils.getProtocolScheme(service.serviceEndpoint);
                return transportPriority.schemes.includes(serviceSchema);
            });
        }
        // If transport priority is set we will sort services by our priority
        if (transportPriority?.schemes) {
            services = services.sort((a, b) => {
                const aScheme = core_1.utils.getProtocolScheme(a.serviceEndpoint);
                const bScheme = core_1.utils.getProtocolScheme(b.serviceEndpoint);
                return transportPriority?.schemes.indexOf(aScheme) - transportPriority?.schemes.indexOf(bScheme);
            });
        }
        agentContext.config.logger.debug(`Retrieved ${services.length} services for message to connection '${connection.id}'(${connection.theirLabel})'`, { hasQueueService: queueService !== undefined });
        return { services, queueService };
    }
    emitMessageSentEvent(outboundMessageContext, status) {
        const { agentContext } = outboundMessageContext;
        this.eventEmitter.emit(agentContext, {
            type: Events_1.AgentEventTypes.AgentMessageSent,
            payload: {
                message: outboundMessageContext,
                status,
            },
        });
    }
};
exports.MessageSender = MessageSender;
exports.MessageSender = MessageSender = __decorate([
    (0, core_1.injectable)(),
    __metadata("design:paramtypes", [EnvelopeService_1.EnvelopeService,
        TransportService_1.TransportService,
        DidCommModuleConfig_1.DidCommModuleConfig,
        DidCommDocumentService_1.DidCommDocumentService,
        core_1.EventEmitter])
], MessageSender);
function isDidCommTransportQueue(serviceEndpoint) {
    return serviceEndpoint === constants_1.DID_COMM_TRANSPORT_QUEUE;
}
//# sourceMappingURL=MessageSender.js.map