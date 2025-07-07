"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _X509ModuleConfig_trustedCertificates, _X509ModuleConfig_getTrustedCertificatesForVerification;
Object.defineProperty(exports, "__esModule", { value: true });
exports.X509ModuleConfig = void 0;
const X509Certificate_1 = require("./X509Certificate");
class X509ModuleConfig {
    constructor(options) {
        _X509ModuleConfig_trustedCertificates.set(this, void 0);
        _X509ModuleConfig_getTrustedCertificatesForVerification.set(this, void 0);
        this.setTrustedCertificates(options?.trustedCertificates);
        if (options?.getTrustedCertificatesForVerification) {
            this.setTrustedCertificatesForVerification(options.getTrustedCertificatesForVerification);
        }
    }
    get trustedCertificates() {
        // TODO: we should probably update this API to return the instances, but don't want to
        // break too much now
        return __classPrivateFieldGet(this, _X509ModuleConfig_trustedCertificates, "f")?.map((cert) => cert.toString('pem'));
    }
    get getTrustedCertificatesForVerification() {
        return __classPrivateFieldGet(this, _X509ModuleConfig_getTrustedCertificatesForVerification, "f");
    }
    setTrustedCertificatesForVerification(fn) {
        __classPrivateFieldSet(this, _X509ModuleConfig_getTrustedCertificatesForVerification, fn, "f");
    }
    setTrustedCertificates(trustedCertificates) {
        const certificateInstances = trustedCertificates?.map((trustedCertificate) => typeof trustedCertificate === 'string'
            ? X509Certificate_1.X509Certificate.fromEncodedCertificate(trustedCertificate)
            : trustedCertificate);
        __classPrivateFieldSet(this, _X509ModuleConfig_trustedCertificates, trustedCertificates?.length ? certificateInstances : undefined, "f");
    }
    addTrustedCertificate(trustedCertificate) {
        const certificateInstance = typeof trustedCertificate === 'string'
            ? X509Certificate_1.X509Certificate.fromEncodedCertificate(trustedCertificate)
            : trustedCertificate;
        if (!__classPrivateFieldGet(this, _X509ModuleConfig_trustedCertificates, "f")) {
            __classPrivateFieldSet(this, _X509ModuleConfig_trustedCertificates, [], "f");
        }
        __classPrivateFieldGet(this, _X509ModuleConfig_trustedCertificates, "f").push(certificateInstance);
    }
}
exports.X509ModuleConfig = X509ModuleConfig;
_X509ModuleConfig_trustedCertificates = new WeakMap(), _X509ModuleConfig_getTrustedCertificatesForVerification = new WeakMap();
//# sourceMappingURL=X509ModuleConfig.js.map