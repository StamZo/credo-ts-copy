"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketTransportSession = exports.WsInboundTransport = void 0;
const core_1 = require("@credo-ts/core");
const didcomm_1 = require("@credo-ts/didcomm");
const ws_1 = __importStar(require("ws"));
class WsInboundTransport {
    constructor({ server, port }) {
        // We're using a `socketId` just for the prevention of calling the connection handler twice.
        this.socketIds = {};
        this.socketServer = server ?? new ws_1.Server({ port });
    }
    async start(agentContext) {
        const transportService = agentContext.dependencyManager.resolve(didcomm_1.TransportService);
        this.logger = agentContext.config.logger;
        const didcommConfig = agentContext.dependencyManager.resolve(didcomm_1.DidCommModuleConfig);
        const wsEndpoint = didcommConfig.endpoints.find((e) => e.startsWith('ws'));
        this.logger.debug('Starting WS inbound transport', {
            endpoint: wsEndpoint,
        });
        this.socketServer.on('connection', (socket) => {
            const socketId = core_1.utils.uuid();
            this.logger.debug('Socket connected.');
            if (!this.socketIds[socketId]) {
                this.logger.debug(`Saving new socket with id ${socketId}.`);
                this.socketIds[socketId] = socket;
                const session = new WebSocketTransportSession(socketId, socket, this.logger);
                this.listenOnWebSocketMessages(agentContext, socket, session);
                socket.on('close', () => {
                    this.logger.debug('Socket closed.');
                    transportService.removeSession(session);
                });
            }
            else {
                this.logger.debug(`Socket with id ${socketId} already exists.`);
            }
        });
    }
    async stop() {
        this.logger.debug('Closing WebSocket Server');
        return new Promise((resolve, reject) => {
            this.socketServer.close((error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }
    listenOnWebSocketMessages(agentContext, socket, session) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        socket.addEventListener('message', async (event) => {
            this.logger.debug('WebSocket message event received.', { url: event.target.url });
            try {
                const encryptedMessage = JSON.parse(event.data);
                const eventEmitter = agentContext.dependencyManager.resolve(core_1.EventEmitter);
                eventEmitter.emit(agentContext, {
                    type: didcomm_1.AgentEventTypes.AgentMessageReceived,
                    payload: {
                        message: encryptedMessage,
                        session: session,
                    },
                });
            }
            catch (error) {
                this.logger.error(`Error processing message: ${error}`);
            }
        });
    }
}
exports.WsInboundTransport = WsInboundTransport;
class WebSocketTransportSession {
    constructor(id, socket, logger) {
        this.type = 'WebSocket';
        this.id = id;
        this.socket = socket;
        this.logger = logger;
    }
    async send(_agentContext, encryptedMessage) {
        if (this.socket.readyState !== ws_1.default.OPEN) {
            throw new core_1.CredoError(`${this.type} transport session has been closed.`);
        }
        this.socket.send(JSON.stringify(encryptedMessage), (error) => {
            // biome-ignore lint/suspicious/noDoubleEquals: If error check is added as '!==' it fails the check
            if (error != undefined) {
                this.logger.debug(`Error sending message: ${error}`);
                throw new core_1.CredoError(`${this.type} send message failed.`, { cause: error });
            }
            this.logger.debug(`${this.type} sent message successfully.`);
        });
    }
    async close() {
        if (this.socket.readyState === ws_1.default.OPEN) {
            this.socket.close();
        }
    }
}
exports.WebSocketTransportSession = WebSocketTransportSession;
//# sourceMappingURL=WsInboundTransport.js.map