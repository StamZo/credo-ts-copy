"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsInboundTransport = exports.HttpInboundTransport = exports.agentDependencies = exports.NodeKeyManagementService = exports.NodeInMemoryKeyManagementStorage = void 0;
const events_1 = require("events");
const ws_1 = require("ws");
const NodeFileSystem_1 = require("./NodeFileSystem");
const HttpInboundTransport_1 = require("./transport/HttpInboundTransport");
Object.defineProperty(exports, "HttpInboundTransport", { enumerable: true, get: function () { return HttpInboundTransport_1.HttpInboundTransport; } });
const WsInboundTransport_1 = require("./transport/WsInboundTransport");
Object.defineProperty(exports, "WsInboundTransport", { enumerable: true, get: function () { return WsInboundTransport_1.WsInboundTransport; } });
var NodeInMemoryKeyManagementStorage_1 = require("./kms/NodeInMemoryKeyManagementStorage");
Object.defineProperty(exports, "NodeInMemoryKeyManagementStorage", { enumerable: true, get: function () { return NodeInMemoryKeyManagementStorage_1.NodeInMemoryKeyManagementStorage; } });
var NodeKeyManagementService_1 = require("./kms/NodeKeyManagementService");
Object.defineProperty(exports, "NodeKeyManagementService", { enumerable: true, get: function () { return NodeKeyManagementService_1.NodeKeyManagementService; } });
const agentDependencies = {
    FileSystem: NodeFileSystem_1.NodeFileSystem,
    fetch,
    EventEmitterClass: events_1.EventEmitter,
    WebSocketClass: ws_1.WebSocket,
};
exports.agentDependencies = agentDependencies;
//# sourceMappingURL=index.js.map