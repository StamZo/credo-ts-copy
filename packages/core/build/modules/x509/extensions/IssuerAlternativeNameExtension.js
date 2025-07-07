"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssuerAlternativeNameExtension = void 0;
const asn1_schema_1 = require("@peculiar/asn1-schema");
const asn1_x509_1 = require("@peculiar/asn1-x509");
const x509_1 = require("@peculiar/x509");
class IssuerAlternativeNameExtension extends x509_1.Extension {
    constructor(data, critical) {
        if (data instanceof ArrayBuffer) {
            super(data);
        }
        else {
            super(asn1_x509_1.id_ce_issuerAltName, !!critical, new x509_1.GeneralNames(data).rawData);
        }
    }
    onInit(asn) {
        super.onInit(asn);
        const value = asn1_schema_1.AsnConvert.parse(asn.extnValue, asn1_x509_1.IssueAlternativeName);
        this.names = new x509_1.GeneralNames(value);
    }
    toTextObject() {
        const obj = this.toTextObjectWithoutValue();
        const namesObj = this.names.toTextObject();
        for (const key in namesObj) {
            obj[key] = namesObj[key];
        }
        return obj;
    }
}
exports.IssuerAlternativeNameExtension = IssuerAlternativeNameExtension;
IssuerAlternativeNameExtension.NAME = 'Issuer Alternative Name';
x509_1.ExtensionFactory.register(asn1_x509_1.id_ce_issuerAltName, IssuerAlternativeNameExtension);
//# sourceMappingURL=IssuerAlternativeNameExtension.js.map