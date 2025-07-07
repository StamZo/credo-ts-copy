import { AgentContext, Kms } from '@credo-ts/core';
import type { ClientAuthenticationCallback, DecryptJweCallback, EncryptJweCallback, SignJwtCallback, VerifyJwtCallback } from '@openid4vc/oauth2';
import type { OpenId4VcIssuerRecord } from '../openid4vc-issuer/repository';
export declare function getOid4vcJwtVerifyCallback(agentContext: AgentContext, options?: {
    trustedCertificates?: string[];
    issuanceSessionId?: string;
    /**
     * Whether this verification callback should assume a JAR authorization is verified
     * Starting from OID4VP draft 24 the JAR must use oauth-authz-req+jwt header typ
     * but for backwards compatiblity we need to also handle the case where the header typ is different
     * @default false
     */
    isAuthorizationRequestJwt?: boolean;
}): VerifyJwtCallback;
export declare function getOid4vcEncryptJweCallback(agentContext: AgentContext): EncryptJweCallback;
export declare function getOid4vcDecryptJweCallback(agentContext: AgentContext): DecryptJweCallback;
export declare function getOid4vcJwtSignCallback(agentContext: AgentContext): SignJwtCallback;
export declare function getOid4vcCallbacks(agentContext: AgentContext, options?: {
    trustedCertificates?: string[];
    isVerifyOpenId4VpAuthorizationRequest?: boolean;
    issuanceSessionId?: string;
}): {
    hash: (data: Uint8Array<ArrayBufferLike>, alg: import("@openid4vc/oauth2").HashAlgorithm) => Uint8Array<ArrayBufferLike>;
    generateRandom: (length: number) => Kms.KmsRandomBytesReturn;
    signJwt: SignJwtCallback;
    clientAuthentication: () => never;
    verifyJwt: VerifyJwtCallback;
    fetch: typeof fetch;
    encryptJwe: EncryptJweCallback;
    decryptJwe: DecryptJweCallback;
    getX509CertificateMetadata: (certificate: string) => {
        sanDnsNames: string[];
        sanUriNames: string[];
    };
};
/**
 * Allows us to authenticate when making requests to an external
 * authorizatin server
 */
export declare function dynamicOid4vciClientAuthentication(agentContext: AgentContext, issuerRecord: OpenId4VcIssuerRecord): ClientAuthenticationCallback;
