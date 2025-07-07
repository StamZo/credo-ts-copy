"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicJwkToSpki = exports.spkiToPublicJwk = exports.cryptoKeyAlgorithmToCreateKeyOptions = exports.publicJwkToCryptoKeyAlgorithm = void 0;
const asn1_rsa_1 = require("@peculiar/asn1-rsa");
const asn1_x509_1 = require("@peculiar/asn1-x509");
const asn1_schema_1 = require("@peculiar/asn1-schema");
const kms_1 = require("../../../modules/kms");
const CredoWebCryptoError_1 = require("../CredoWebCryptoError");
const algorithmIdentifiers_1 = require("../algorithmIdentifiers");
const publicJwkToCryptoKeyAlgorithm = (key) => {
    const publicJwk = key.toJson();
    if (publicJwk.kty === 'EC') {
        if (publicJwk.crv === 'P-256' || publicJwk.crv === 'P-384' || publicJwk.crv === 'P-521') {
            return { name: 'ECDSA', namedCurve: publicJwk.crv };
        }
        if (publicJwk.crv === 'secp256k1') {
            return {
                name: 'ECDSA',
                namedCurve: 'K-256',
            };
        }
    }
    else if (publicJwk.kty === 'OKP') {
        if (publicJwk.crv === 'Ed25519') {
            return { name: 'Ed25519' };
        }
    }
    // TODO: support RSA, but i think we need some extra params for this
    throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported ${(0, kms_1.getJwkHumanDescription)(key.toJson())}`);
};
exports.publicJwkToCryptoKeyAlgorithm = publicJwkToCryptoKeyAlgorithm;
// TODO: support RSA
const cryptoKeyAlgorithmToCreateKeyOptions = (algorithm) => {
    const algorithmName = algorithm.name.toUpperCase();
    switch (algorithmName) {
        case 'ED25519':
            return {
                kty: 'OKP',
                crv: 'Ed25519',
            };
        case 'X25519':
            return {
                kty: 'OKP',
                crv: 'X25519',
            };
        case 'ECDSA': {
            const crv = algorithm.namedCurve.toUpperCase();
            switch (crv) {
                case 'P-256':
                case 'P-384':
                case 'P-521':
                    return {
                        kty: 'EC',
                        crv,
                    };
                case 'K-256':
                    return {
                        kty: 'EC',
                        crv: 'secp256k1',
                    };
                default:
                    throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported curve for ECDSA: ${algorithm.namedCurve}`);
            }
        }
        case 'RSASSA-PKCS1-V1_5':
        case 'RSA-PSS': {
            const rsaParams = algorithm;
            if (rsaParams.publicExponent) {
                throw new CredoWebCryptoError_1.CredoWebCryptoError('Custom exponent not suported for RSA');
            }
            if (rsaParams.modulusLength !== 2048 && rsaParams.modulusLength !== 3072 && rsaParams.modulusLength !== 4096) {
                throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported modulusLength '${rsaParams.modulusLength}' for RSA key. Expected one of 2048, 3072, 4096.`);
            }
            return {
                kty: 'RSA',
                modulusLength: rsaParams.modulusLength,
            };
        }
    }
    throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported algorithm: ${algorithmName}`);
};
exports.cryptoKeyAlgorithmToCreateKeyOptions = cryptoKeyAlgorithmToCreateKeyOptions;
const spkiToPublicJwk = (spki) => {
    if (spki.algorithm.isEqual(algorithmIdentifiers_1.ecPublicKeyWithP256AlgorithmIdentifier)) {
        return kms_1.PublicJwk.fromPublicKey({
            kty: 'EC',
            crv: 'P-256',
            publicKey: new Uint8Array(spki.subjectPublicKey),
        });
    }
    if (spki.algorithm.isEqual(algorithmIdentifiers_1.ecPublicKeyWithP384AlgorithmIdentifier)) {
        return kms_1.PublicJwk.fromPublicKey({
            kty: 'EC',
            crv: 'P-384',
            publicKey: new Uint8Array(spki.subjectPublicKey),
        });
    }
    if (spki.algorithm.isEqual(algorithmIdentifiers_1.ecPublicKeyWithP521AlgorithmIdentifier)) {
        return kms_1.PublicJwk.fromPublicKey({
            kty: 'EC',
            crv: 'P-521',
            publicKey: new Uint8Array(spki.subjectPublicKey),
        });
    }
    if (spki.algorithm.isEqual(algorithmIdentifiers_1.ecPublicKeyWithK256AlgorithmIdentifier)) {
        return kms_1.PublicJwk.fromPublicKey({
            kty: 'EC',
            crv: 'secp256k1',
            publicKey: new Uint8Array(spki.subjectPublicKey),
        });
    }
    if (spki.algorithm.isEqual(algorithmIdentifiers_1.ed25519AlgorithmIdentifier)) {
        return kms_1.PublicJwk.fromPublicKey({
            kty: 'OKP',
            crv: 'Ed25519',
            publicKey: new Uint8Array(spki.subjectPublicKey),
        });
    }
    if (spki.algorithm.isEqual(algorithmIdentifiers_1.x25519AlgorithmIdentifier)) {
        return kms_1.PublicJwk.fromPublicKey({
            kty: 'OKP',
            crv: 'X25519',
            publicKey: new Uint8Array(spki.subjectPublicKey),
        });
    }
    if (spki.algorithm.isEqual(algorithmIdentifiers_1.rsaKeyAlgorithmIdentifier)) {
        // The RSA key is another ASN.1 structure inside the subjectPublicKey bit string
        // The first byte in the bit string is the number of unused bits (typically 0)
        const keyWithoutUnusedBits = new Uint8Array(spki.subjectPublicKey).slice(1);
        // Parse the RSA public key structure
        const rsaPublicKey = asn1_schema_1.AsnParser.parse(keyWithoutUnusedBits, asn1_rsa_1.RSAPublicKey);
        return kms_1.PublicJwk.fromPublicKey({
            kty: 'RSA',
            modulus: new Uint8Array(rsaPublicKey.modulus),
            exponent: new Uint8Array(rsaPublicKey.publicExponent),
        });
    }
    throw new CredoWebCryptoError_1.CredoWebCryptoError(`Unsupported algorithm: ${spki.algorithm.algorithm}, with params: ${spki.algorithm.parameters ? 'yes' : 'no'}`);
};
exports.spkiToPublicJwk = spkiToPublicJwk;
const publicJwkToSpki = (publicJwk) => {
    const publicKey = publicJwk.publicKey;
    if (publicKey.kty === 'RSA') {
        const rsaPublicKey = new asn1_rsa_1.RSAPublicKey({
            modulus: publicKey.modulus,
            publicExponent: publicKey.exponent,
        });
        // 2. Encode the RSA public key to DER
        const rsaPublicKeyDer = asn1_schema_1.AsnSerializer.serialize(rsaPublicKey);
        return new asn1_x509_1.SubjectPublicKeyInfo({
            algorithm: algorithmIdentifiers_1.rsaKeyAlgorithmIdentifier,
            subjectPublicKey: new Uint8Array([0, ...new Uint8Array(rsaPublicKeyDer)]),
        });
    }
    const crvToAlgorithm = {
        'P-256': algorithmIdentifiers_1.ecPublicKeyWithP256AlgorithmIdentifier,
        'P-384': algorithmIdentifiers_1.ecPublicKeyWithP384AlgorithmIdentifier,
        'P-521': algorithmIdentifiers_1.ecPublicKeyWithP521AlgorithmIdentifier,
        secp256k1: algorithmIdentifiers_1.ecPublicKeyWithK256AlgorithmIdentifier,
        Ed25519: algorithmIdentifiers_1.ed25519AlgorithmIdentifier,
        X25519: algorithmIdentifiers_1.x25519AlgorithmIdentifier,
    };
    return new asn1_x509_1.SubjectPublicKeyInfo({
        algorithm: crvToAlgorithm[publicKey.crv],
        subjectPublicKey: publicKey.publicKey,
    });
};
exports.publicJwkToSpki = publicJwkToSpki;
//# sourceMappingURL=keyAlgorithmConversion.js.map