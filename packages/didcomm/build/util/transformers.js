"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateParser = DateParser;
const luxon_1 = require("luxon");
/*
 * Function that parses date from multiple formats
 * including SQL formats.
 */
function DateParser(value) {
    const parsedDate = new Date(value);
    if (parsedDate instanceof Date && !Number.isNaN(parsedDate.getTime())) {
        return parsedDate;
    }
    const luxonDate = luxon_1.DateTime.fromSQL(value);
    if (luxonDate.isValid) {
        return new Date(luxonDate.toString());
    }
    return new Date();
}
//# sourceMappingURL=transformers.js.map