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
exports.TransportService = void 0;
const core_1 = require("@credo-ts/core");
const constants_1 = require("./constants");
const transport_1 = require("./transport");
let TransportService = class TransportService {
    constructor(agentContext, eventEmitter) {
        this.transportSessionTable = {};
        this.agentContext = agentContext;
        this.eventEmitter = eventEmitter;
    }
    saveSession(session) {
        if (session.connectionId) {
            const oldSessions = this.getExistingSessionsForConnectionIdAndType(session.connectionId, session.type);
            for (const oldSession of oldSessions) {
                if (oldSession && oldSession.id !== session.id) {
                    this.removeSession(oldSession);
                }
            }
        }
        this.transportSessionTable[session.id] = session;
        this.eventEmitter.emit(this.agentContext, {
            type: transport_1.TransportEventTypes.TransportSessionSaved,
            payload: {
                session,
            },
        });
    }
    findSessionByConnectionId(connectionId) {
        return Object.values(this.transportSessionTable).find((session) => session?.connectionId === connectionId);
    }
    setConnectionIdForSession(sessionId, connectionId) {
        const session = this.findSessionById(sessionId);
        if (!session) {
            throw new core_1.CredoError(`Session not found with id ${sessionId}`);
        }
        session.connectionId = connectionId;
        this.saveSession(session);
    }
    hasInboundEndpoint(didDocument) {
        return Boolean(didDocument.didCommServices?.find((s) => s.serviceEndpoint !== constants_1.DID_COMM_TRANSPORT_QUEUE));
    }
    findSessionById(sessionId) {
        return this.transportSessionTable[sessionId];
    }
    removeSession(session) {
        delete this.transportSessionTable[session.id];
        this.eventEmitter.emit(this.agentContext, {
            type: transport_1.TransportEventTypes.TransportSessionRemoved,
            payload: {
                session,
            },
        });
    }
    getExistingSessionsForConnectionIdAndType(connectionId, type) {
        return Object.values(this.transportSessionTable).filter((session) => session?.connectionId === connectionId && session.type === type);
    }
};
exports.TransportService = TransportService;
exports.TransportService = TransportService = __decorate([
    (0, core_1.injectable)(),
    __metadata("design:paramtypes", [core_1.AgentContext, core_1.EventEmitter])
], TransportService);
//# sourceMappingURL=TransportService.js.map