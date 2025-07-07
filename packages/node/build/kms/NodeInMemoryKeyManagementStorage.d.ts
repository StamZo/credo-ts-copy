import type { AgentContext, Kms } from '@credo-ts/core';
import type { NodeKeyManagementStorage } from './NodeKeyManagementStorage';
export declare class NodeInMemoryKeyManagementStorage implements NodeKeyManagementStorage {
    #private;
    get(agentContext: AgentContext, keyId: string): Promise<{
        kty: "EC";
        crv: "P-256" | "P-384" | "P-521" | "secp256k1";
        x: string;
        d: string;
        y: string;
        kid?: string | undefined;
        alg?: string | undefined;
        key_ops?: string[] | undefined;
        use?: string | undefined;
        ext?: boolean | undefined;
        x5c?: string[] | undefined;
        x5t?: string | undefined;
        'x5t#S256'?: string | undefined;
        x5u?: string | undefined;
    } | {
        kty: "RSA";
        d: string;
        n: string;
        e: string;
        p: string;
        q: string;
        dp: string;
        dq: string;
        qi: string;
        kid?: string | undefined;
        alg?: string | undefined;
        key_ops?: string[] | undefined;
        use?: string | undefined;
        ext?: boolean | undefined;
        x5c?: string[] | undefined;
        x5t?: string | undefined;
        'x5t#S256'?: string | undefined;
        x5u?: string | undefined;
        oth?: import("@credo-ts/core/src/utils/zod").objectOutputType<{
            d: import("@credo-ts/core/src/utils/zod").ZodOptional<import("@credo-ts/core/src/utils/zod").ZodString>;
            r: import("@credo-ts/core/src/utils/zod").ZodOptional<import("@credo-ts/core/src/utils/zod").ZodString>;
            t: import("@credo-ts/core/src/utils/zod").ZodOptional<import("@credo-ts/core/src/utils/zod").ZodString>;
        }, import("@credo-ts/core/src/utils/zod").ZodTypeAny, "passthrough">[] | undefined;
    } | {
        kty: "oct";
        k: string;
        kid?: string | undefined;
        alg?: string | undefined;
        key_ops?: string[] | undefined;
        use?: string | undefined;
        ext?: boolean | undefined;
        x5c?: string[] | undefined;
        x5t?: string | undefined;
        'x5t#S256'?: string | undefined;
        x5u?: string | undefined;
    } | {
        kty: "OKP";
        crv: "X25519" | "Ed25519";
        x: string;
        d: string;
        kid?: string | undefined;
        alg?: string | undefined;
        key_ops?: string[] | undefined;
        use?: string | undefined;
        ext?: boolean | undefined;
        x5c?: string[] | undefined;
        x5t?: string | undefined;
        'x5t#S256'?: string | undefined;
        x5u?: string | undefined;
    } | null>;
    has(agentContext: AgentContext, keyId: string): boolean;
    set(agentContext: AgentContext, keyId: string, jwk: Kms.KmsJwkPrivate): void;
    delete(agentContext: AgentContext, keyId: string): boolean;
    private storageForContext;
}
