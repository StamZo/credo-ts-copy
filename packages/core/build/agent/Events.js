"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterContextCorrelationId = filterContextCorrelationId;
const rxjs_1 = require("rxjs");
function filterContextCorrelationId(contextCorrelationId) {
    return (source) => {
        return source.pipe((0, rxjs_1.filter)((event) => event.metadata.contextCorrelationId === contextCorrelationId));
    };
}
//# sourceMappingURL=Events.js.map