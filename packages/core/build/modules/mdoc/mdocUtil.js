"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameSpacesRecordToMap = nameSpacesRecordToMap;
exports.namespacesMapToRecord = namespacesMapToRecord;
function nameSpacesRecordToMap(nameSpaces) {
    return new Map(Object.entries(nameSpaces).map(([key, value]) => [key, new Map(Object.entries(value))]));
}
function namespacesMapToRecord(nameSpaces) {
    return Object.fromEntries(Array.from(nameSpaces.entries()).map(([key, value]) => [key, Object.fromEntries(Array.from(value.entries()))]));
}
//# sourceMappingURL=mdocUtil.js.map