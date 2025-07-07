import type { AgentContext } from '@credo-ts/core';
import { Kms } from '@credo-ts/core';
export declare class SecureEnvironmentKeyManagementService implements Kms.KeyManagementService {
    readonly backend = "secureEnvironment";
    private readonly secureEnvironment;
    isOperationSupported(_agentContext: AgentContext, operation: Kms.KmsOperation): boolean;
    randomBytes(_agentContext: AgentContext, _options: Kms.KmsRandomBytesOptions): Kms.KmsRandomBytesReturn;
    getPublicKey(_agentContext: AgentContext, keyId: string): Promise<Kms.KmsJwkPublic | null>;
    importKey(): Promise<Kms.KmsImportKeyReturn<Kms.KmsJwkPrivate>>;
    deleteKey(_agentContext: AgentContext, options: Kms.KmsDeleteKeyOptions): Promise<boolean>;
    encrypt(): Promise<Kms.KmsEncryptReturn>;
    decrypt(): Promise<Kms.KmsDecryptReturn>;
    createKey(_agentContext: AgentContext, options: Kms.KmsCreateKeyOptions): Promise<Kms.KmsCreateKeyReturn>;
    sign(_agentContext: AgentContext, options: Kms.KmsSignOptions): Promise<Kms.KmsSignReturn>;
    verify(): Promise<Kms.KmsVerifyReturn>;
    private publicJwkFromPublicKeyBytes;
    private getKeyAsserted;
}
