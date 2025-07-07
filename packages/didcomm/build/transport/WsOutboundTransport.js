"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsOutboundTransport = void 0;
const core_1 = require("@credo-ts/core");
const Events_1 = require("../Events");
const JWE_1 = require("../util/JWE");
const TransportEventTypes_1 = require("./TransportEventTypes");
class WsOutboundTransport {
    constructor() {
        this.transportTable = new Map();
        this.supportedSchemes = ['ws', 'wss'];
        this.isActive = false;
        // NOTE: Because this method is passed to the event handler this must be a lambda method
        // so 'this' is scoped to the 'WsOutboundTransport' class instance
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        this.handleMessageEvent = (event) => {
            this.logger.trace('WebSocket message event received.', { url: event.target.url });
            const payload = core_1.JsonEncoder.fromBuffer(event.data);
            if (!(0, JWE_1.isValidJweStructure)(payload)) {
                throw new Error(`Received a response from the other agent but the structure of the incoming message is not a DIDComm message: ${payload}`);
            }
            this.logger.debug('Payload received from mediator:', payload);
            const eventEmitter = this.agentContext.dependencyManager.resolve(core_1.EventEmitter);
            eventEmitter.emit(this.agentContext, {
                type: Events_1.AgentEventTypes.AgentMessageReceived,
                payload: {
                    message: payload,
                },
            });
        };
    }
    async start(agentContext) {
        this.agentContext = agentContext;
        this.logger = agentContext.config.logger;
        this.logger.debug('Starting WS outbound transport');
        this.WebSocketClass = agentContext.config.agentDependencies.WebSocketClass;
        this.isActive = true;
    }
    async stop() {
        this.logger.debug('Stopping WS outbound transport');
        this.isActive = false;
        const stillOpenSocketClosingPromises = [];
        for (const [, socket] of this.transportTable) {
            socket.removeEventListener('message', this.handleMessageEvent);
            if (socket.readyState !== this.WebSocketClass.CLOSED) {
                stillOpenSocketClosingPromises.push(new Promise((resolve) => {
                    const closeHandler = () => {
                        socket.removeEventListener('close', closeHandler);
                        resolve();
                    };
                    socket.addEventListener('close', closeHandler);
                }));
                socket.close();
            }
        }
        // Wait for all open websocket connections to have been closed
        await Promise.all(stillOpenSocketClosingPromises);
    }
    async sendMessage(outboundPackage) {
        const { payload, endpoint, connectionId } = outboundPackage;
        this.logger.debug(`Sending outbound message to endpoint '${endpoint}' over WebSocket transport.`, {
            payload,
        });
        if (!this.isActive) {
            throw new core_1.CredoError('Outbound transport is not active. Not sending message.');
        }
        if (!endpoint) {
            throw new core_1.CredoError("Missing connection or endpoint. I don't know how and where to send the message.");
        }
        const socketId = `${endpoint}-${connectionId}`;
        const isNewSocket = !this.hasOpenSocket(socketId);
        const socket = await this.resolveSocket({ socketId, endpoint, connectionId });
        // If the socket was created for this message and we don't have return routing enabled
        // We can close the socket as it shouldn't return messages anymore
        // make sure to use the socket in a manner that is compliant with the https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
        // (React Native) and https://github.com/websockets/ws (NodeJs)
        socket.send(core_1.Buffer.from(JSON.stringify(payload)));
        if (isNewSocket && !outboundPackage.responseRequested) {
            socket.close();
        }
    }
    hasOpenSocket(socketId) {
        return this.transportTable.get(socketId) !== undefined;
    }
    async resolveSocket({ socketId, endpoint, connectionId, }) {
        // If we already have a socket connection use it
        let socket = this.transportTable.get(socketId);
        if (!socket || socket.readyState === this.WebSocketClass.CLOSING) {
            if (!endpoint) {
                throw new core_1.CredoError(`Missing endpoint. I don't know how and where to send the message.`);
            }
            socket = await this.createSocketConnection({
                endpoint,
                socketId,
                connectionId,
            });
            this.transportTable.set(socketId, socket);
            this.listenOnWebSocketMessages(socket);
        }
        if (socket.readyState !== this.WebSocketClass.OPEN) {
            throw new core_1.CredoError('Socket is not open.');
        }
        return socket;
    }
    listenOnWebSocketMessages(socket) {
        socket.addEventListener('message', this.handleMessageEvent);
    }
    createSocketConnection({ socketId, endpoint, connectionId, }) {
        return new Promise((resolve, reject) => {
            this.logger.debug(`Connecting to WebSocket ${endpoint}`);
            const socket = new this.WebSocketClass(endpoint);
            const eventEmitter = this.agentContext.dependencyManager.resolve(core_1.EventEmitter);
            socket.onopen = () => {
                this.logger.debug(`Successfully connected to WebSocket ${endpoint}`);
                resolve(socket);
                eventEmitter.emit(this.agentContext, {
                    type: TransportEventTypes_1.TransportEventTypes.OutboundWebSocketOpenedEvent,
                    payload: {
                        socketId,
                        connectionId: connectionId,
                    },
                });
            };
            socket.onerror = (error) => {
                this.logger.debug(`Error while connecting to WebSocket ${endpoint}`, {
                    error,
                });
                reject(error);
            };
            socket.onclose = async () => {
                this.logger.debug(`WebSocket closing to ${endpoint}`);
                socket.removeEventListener('message', this.handleMessageEvent);
                this.transportTable.delete(socketId);
                eventEmitter.emit(this.agentContext, {
                    type: TransportEventTypes_1.TransportEventTypes.OutboundWebSocketClosedEvent,
                    payload: {
                        socketId,
                        connectionId: connectionId,
                    },
                });
            };
        });
    }
}
exports.WsOutboundTransport = WsOutboundTransport;
//# sourceMappingURL=WsOutboundTransport.js.map