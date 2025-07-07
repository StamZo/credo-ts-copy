import type { AgentContext } from '../agent';
import type { Jws, JwsDetachedFormat, JwsFlattenedFormat, JwsGeneralFormat, JwsProtectedHeaderOptions } from './JwsTypes';
import { EncodedX509Certificate } from '../modules/x509';
import { Buffer } from '../utils';
import { KnownJwaSignatureAlgorithm } from '../modules/kms';
import { JwsSigner, JwsSignerWithJwk } from './JwsSigner';
import { JwtPayload } from './jose/jwt';
export declare class JwsService {
    private createJwsBase;
    createJws(agentContext: AgentContext, { payload, keyId, header, protectedHeaderOptions }: CreateJwsOptions): Promise<JwsGeneralFormat>;
    /**
     *  @see {@link https://www.rfc-editor.org/rfc/rfc7515#section-3.1}
     * */
    createJwsCompact(agentContext: AgentContext, { payload, keyId, protectedHeaderOptions }: CreateCompactJwsOptions): Promise<string>;
    /**
     * Verify a JWS
     */
    verifyJws(agentContext: AgentContext, { jws, resolveJwsSigner, trustedCertificates, jwsSigner: expectedJwsSigner, allowedJwsSignerMethods, }: VerifyJwsOptions): Promise<VerifyJwsResult>;
    private buildProtected;
    private verifyJwsSigner;
    private jwsSignerFromJws;
}
export interface CreateJwsOptions {
    payload: Buffer | JwtPayload;
    keyId: string;
    header: Record<string, unknown>;
    protectedHeaderOptions: JwsProtectedHeaderOptions;
}
type CreateCompactJwsOptions = Omit<CreateJwsOptions, 'header'>;
export interface VerifyJwsOptions {
    jws: Jws;
    /**
     * The expected signer of the JWS. If provided the signer won't be dynamically
     * detected based on the values in the JWS.
     */
    jwsSigner?: JwsSignerWithJwk;
    /**
     * Allowed jws signer methods when dynamically inferring the jws signer method.
     */
    allowedJwsSignerMethods?: JwsSigner['method'][];
    resolveJwsSigner?: JwsSignerResolver;
    trustedCertificates?: EncodedX509Certificate[];
}
export type JwsSignerResolver = (options: {
    jws: JwsDetachedFormat;
    payload: string;
    protectedHeader: {
        alg: KnownJwaSignatureAlgorithm;
        jwk?: string;
        kid?: string;
        [key: string]: unknown;
    };
}) => Promise<JwsSignerWithJwk> | JwsSignerWithJwk;
export interface VerifyJwsResult {
    isValid: boolean;
    jwsSigners: JwsSignerWithJwk[];
    jws: JwsFlattenedFormat;
}
export {};
