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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.MessageValidator = exports.getDomainFromUrl = exports.didDocumentToNumAlgo4Did = exports.didDocumentToNumAlgo2Did = exports.didDocumentJsonToNumAlgo1Did = exports.DidRecordMetadataKeys = exports.base64ToBase64URL = exports.tryParseDid = exports.isDidKey = exports.verkeyToPublicJwk = exports.verkeyToDidKey = exports.didKeyToVerkey = exports.didKeyToEd25519PublicJwk = exports.DateTransformer = exports.equalsWithOrder = exports.equalsIgnoreOrder = exports.asArray = exports.IsStringOrInstance = exports.IsUri = exports.isDid = exports.deepEquality = exports.Buffer = exports.HashlinkEncoder = exports.TypedArrayEncoder = exports.JsonTransformer = exports.JsonEncoder = exports.Kms = exports.InjectionSymbols = exports.joinUriParts = exports.getDirFromFilePath = exports.Metadata = exports.Repository = exports.isJsonObject = exports.AgentConfig = exports.EventEmitter = exports.BaseAgent = exports.Agent = void 0;
// reflect-metadata used for class-transformer + class-validator
require("reflect-metadata");
var Agent_1 = require("./agent/Agent");
Object.defineProperty(exports, "Agent", { enumerable: true, get: function () { return Agent_1.Agent; } });
var BaseAgent_1 = require("./agent/BaseAgent");
Object.defineProperty(exports, "BaseAgent", { enumerable: true, get: function () { return BaseAgent_1.BaseAgent; } });
__exportStar(require("./agent"), exports);
var EventEmitter_1 = require("./agent/EventEmitter");
Object.defineProperty(exports, "EventEmitter", { enumerable: true, get: function () { return EventEmitter_1.EventEmitter; } });
var AgentConfig_1 = require("./agent/AgentConfig");
Object.defineProperty(exports, "AgentConfig", { enumerable: true, get: function () { return AgentConfig_1.AgentConfig; } });
var types_1 = require("./types");
Object.defineProperty(exports, "isJsonObject", { enumerable: true, get: function () { return types_1.isJsonObject; } });
__exportStar(require("./storage/BaseRecord"), exports);
var Repository_1 = require("./storage/Repository");
Object.defineProperty(exports, "Repository", { enumerable: true, get: function () { return Repository_1.Repository; } });
__exportStar(require("./storage/RepositoryEvents"), exports);
__exportStar(require("./storage/migration"), exports);
var Metadata_1 = require("./storage/Metadata");
Object.defineProperty(exports, "Metadata", { enumerable: true, get: function () { return Metadata_1.Metadata; } });
var path_1 = require("./utils/path");
Object.defineProperty(exports, "getDirFromFilePath", { enumerable: true, get: function () { return path_1.getDirFromFilePath; } });
Object.defineProperty(exports, "joinUriParts", { enumerable: true, get: function () { return path_1.joinUriParts; } });
var constants_1 = require("./constants");
Object.defineProperty(exports, "InjectionSymbols", { enumerable: true, get: function () { return constants_1.InjectionSymbols; } });
__exportStar(require("./plugins"), exports);
__exportStar(require("./modules/x509"), exports);
__exportStar(require("./modules/dids"), exports);
__exportStar(require("./modules/vc"), exports);
__exportStar(require("./modules/cache"), exports);
__exportStar(require("./modules/dif-presentation-exchange"), exports);
__exportStar(require("./modules/sd-jwt-vc"), exports);
__exportStar(require("./modules/mdoc"), exports);
exports.Kms = __importStar(require("./modules/kms"));
__exportStar(require("./modules/dcql"), exports);
var utils_1 = require("./utils");
Object.defineProperty(exports, "JsonEncoder", { enumerable: true, get: function () { return utils_1.JsonEncoder; } });
Object.defineProperty(exports, "JsonTransformer", { enumerable: true, get: function () { return utils_1.JsonTransformer; } });
Object.defineProperty(exports, "TypedArrayEncoder", { enumerable: true, get: function () { return utils_1.TypedArrayEncoder; } });
Object.defineProperty(exports, "HashlinkEncoder", { enumerable: true, get: function () { return utils_1.HashlinkEncoder; } });
Object.defineProperty(exports, "Buffer", { enumerable: true, get: function () { return utils_1.Buffer; } });
Object.defineProperty(exports, "deepEquality", { enumerable: true, get: function () { return utils_1.deepEquality; } });
Object.defineProperty(exports, "isDid", { enumerable: true, get: function () { return utils_1.isDid; } });
Object.defineProperty(exports, "IsUri", { enumerable: true, get: function () { return utils_1.IsUri; } });
Object.defineProperty(exports, "IsStringOrInstance", { enumerable: true, get: function () { return utils_1.IsStringOrInstance; } });
Object.defineProperty(exports, "asArray", { enumerable: true, get: function () { return utils_1.asArray; } });
Object.defineProperty(exports, "equalsIgnoreOrder", { enumerable: true, get: function () { return utils_1.equalsIgnoreOrder; } });
Object.defineProperty(exports, "equalsWithOrder", { enumerable: true, get: function () { return utils_1.equalsWithOrder; } });
Object.defineProperty(exports, "DateTransformer", { enumerable: true, get: function () { return utils_1.DateTransformer; } });
__exportStar(require("./logger"), exports);
__exportStar(require("./error"), exports);
__exportStar(require("./agent/Events"), exports);
__exportStar(require("./crypto"), exports);
// TODO: Clean up these exports used by DIDComm module
var helpers_1 = require("./modules/dids/helpers");
Object.defineProperty(exports, "didKeyToEd25519PublicJwk", { enumerable: true, get: function () { return helpers_1.didKeyToEd25519PublicJwk; } });
Object.defineProperty(exports, "didKeyToVerkey", { enumerable: true, get: function () { return helpers_1.didKeyToVerkey; } });
Object.defineProperty(exports, "verkeyToDidKey", { enumerable: true, get: function () { return helpers_1.verkeyToDidKey; } });
Object.defineProperty(exports, "verkeyToPublicJwk", { enumerable: true, get: function () { return helpers_1.verkeyToPublicJwk; } });
Object.defineProperty(exports, "isDidKey", { enumerable: true, get: function () { return helpers_1.isDidKey; } });
var parse_1 = require("./modules/dids/domain/parse");
Object.defineProperty(exports, "tryParseDid", { enumerable: true, get: function () { return parse_1.tryParseDid; } });
var base64_1 = require("./utils/base64");
Object.defineProperty(exports, "base64ToBase64URL", { enumerable: true, get: function () { return base64_1.base64ToBase64URL; } });
var didRecordMetadataTypes_1 = require("./modules/dids/repository/didRecordMetadataTypes");
Object.defineProperty(exports, "DidRecordMetadataKeys", { enumerable: true, get: function () { return didRecordMetadataTypes_1.DidRecordMetadataKeys; } });
var peerDidNumAlgo1_1 = require("./modules/dids/methods/peer/peerDidNumAlgo1");
Object.defineProperty(exports, "didDocumentJsonToNumAlgo1Did", { enumerable: true, get: function () { return peerDidNumAlgo1_1.didDocumentJsonToNumAlgo1Did; } });
var peerDidNumAlgo2_1 = require("./modules/dids/methods/peer/peerDidNumAlgo2");
Object.defineProperty(exports, "didDocumentToNumAlgo2Did", { enumerable: true, get: function () { return peerDidNumAlgo2_1.didDocumentToNumAlgo2Did; } });
var peerDidNumAlgo4_1 = require("./modules/dids/methods/peer/peerDidNumAlgo4");
Object.defineProperty(exports, "didDocumentToNumAlgo4Did", { enumerable: true, get: function () { return peerDidNumAlgo4_1.didDocumentToNumAlgo4Did; } });
var domain_1 = require("./utils/domain");
Object.defineProperty(exports, "getDomainFromUrl", { enumerable: true, get: function () { return domain_1.getDomainFromUrl; } });
var utils_2 = require("./utils");
Object.defineProperty(exports, "MessageValidator", { enumerable: true, get: function () { return utils_2.MessageValidator; } });
const did_1 = require("./utils/did");
const objectEquality_1 = require("./utils/objectEquality");
const timestamp_1 = __importDefault(require("./utils/timestamp"));
const uri_1 = require("./utils/uri");
const uuid_1 = require("./utils/uuid");
const utils = {
    areObjectsEqual: objectEquality_1.areObjectsEqual,
    uuid: uuid_1.uuid,
    isValidUuid: uuid_1.isValidUuid,
    getProtocolScheme: uri_1.getProtocolScheme,
    timestamp: timestamp_1.default,
    indyDidFromPublicKeyBase58: did_1.indyDidFromPublicKeyBase58,
};
exports.utils = utils;
//# sourceMappingURL=index.js.map