"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openId4VciSupportedCredentialFormats = exports.OpenId4VciAuthorizationFlow = void 0;
const openid4vci_1 = require("@openid4vc/openid4vci");
Object.defineProperty(exports, "OpenId4VciAuthorizationFlow", { enumerable: true, get: function () { return openid4vci_1.AuthorizationFlow; } });
const OpenId4VciCredentialFormatProfile_1 = require("../shared/models/OpenId4VciCredentialFormatProfile");
exports.openId4VciSupportedCredentialFormats = [
    OpenId4VciCredentialFormatProfile_1.OpenId4VciCredentialFormatProfile.JwtVcJson,
    OpenId4VciCredentialFormatProfile_1.OpenId4VciCredentialFormatProfile.JwtVcJsonLd,
    OpenId4VciCredentialFormatProfile_1.OpenId4VciCredentialFormatProfile.SdJwtVc,
    OpenId4VciCredentialFormatProfile_1.OpenId4VciCredentialFormatProfile.SdJwtDc,
    OpenId4VciCredentialFormatProfile_1.OpenId4VciCredentialFormatProfile.LdpVc,
    OpenId4VciCredentialFormatProfile_1.OpenId4VciCredentialFormatProfile.MsoMdoc,
];
//# sourceMappingURL=OpenId4VciHolderServiceOptions.js.map