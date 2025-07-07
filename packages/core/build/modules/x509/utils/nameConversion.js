"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertName = void 0;
const X509Error_1 = require("../X509Error");
const convertName = (name) => {
    if (typeof name === 'string')
        return name;
    let nameBuilder = '';
    if (name.commonName)
        nameBuilder = nameBuilder.concat(`CN=${name.commonName}, `);
    if (name.countryName)
        nameBuilder = nameBuilder.concat(`C=${name.countryName}, `);
    if (name.organizationalUnit)
        nameBuilder = nameBuilder.concat(`OU=${name.organizationalUnit}, `);
    if (name.stateOrProvinceName)
        nameBuilder = nameBuilder.concat(`S=${name.stateOrProvinceName}, `);
    if (nameBuilder.length === 0) {
        throw new X509Error_1.X509Error('Provided name object has no entries. Could not generate an issuer/subject name');
    }
    // Remove the trailing `, `
    return nameBuilder.slice(0, nameBuilder.length - 2);
};
exports.convertName = convertName;
//# sourceMappingURL=nameConversion.js.map