import type { LdKeyPairOptions } from '../modules/vc/data-integrity/models/LdKeyPair';
import { AgentContext } from '../agent';
import { VerificationMethod } from '../modules/dids';
import { PublicJwk } from '../modules/kms';
interface KmsKeyPairOptions extends LdKeyPairOptions {
    publicJwk: PublicJwk;
}
export declare function createKmsKeyPairClass(agentContext: AgentContext): {
    new (options: KmsKeyPairOptions): {
        publicJwk: PublicJwk;
        type: string;
        fingerprint(): string;
        verifyFingerprint(_fingerprint: string): boolean;
        /**
         * This method returns a wrapped wallet.sign method. The method is being wrapped so we can covert between Uint8Array and Buffer. This is to make it compatible with the external signature libraries.
         */
        signer(): {
            sign: (data: {
                data: Uint8Array | Uint8Array[];
            }) => Promise<Uint8Array>;
        };
        /**
         * This method returns a wrapped wallet.verify method. The method is being wrapped so we can covert between Uint8Array and Buffer. This is to make it compatible with the external signature libraries.
         */
        verifier(): {
            verify: (data: {
                data: Uint8Array | Uint8Array[];
                signature: Uint8Array;
            }) => Promise<boolean>;
        };
        readonly publicKeyBuffer: Uint8Array;
        readonly id: string;
        readonly controller: string;
        export(publicKey?: boolean, privateKey?: boolean): {
            id: string;
            type: string;
            controller: string;
        };
    };
    generate(): Promise<{
        publicJwk: PublicJwk;
        type: string;
        fingerprint(): string;
        verifyFingerprint(_fingerprint: string): boolean;
        /**
         * This method returns a wrapped wallet.sign method. The method is being wrapped so we can covert between Uint8Array and Buffer. This is to make it compatible with the external signature libraries.
         */
        signer(): {
            sign: (data: {
                data: Uint8Array | Uint8Array[];
            }) => Promise<Uint8Array>;
        };
        /**
         * This method returns a wrapped wallet.verify method. The method is being wrapped so we can covert between Uint8Array and Buffer. This is to make it compatible with the external signature libraries.
         */
        verifier(): {
            verify: (data: {
                data: Uint8Array | Uint8Array[];
                signature: Uint8Array;
            }) => Promise<boolean>;
        };
        readonly publicKeyBuffer: Uint8Array;
        readonly id: string;
        readonly controller: string;
        export(publicKey?: boolean, privateKey?: boolean): {
            id: string;
            type: string;
            controller: string;
        };
    }>;
    from(verificationMethod: VerificationMethod): Promise<{
        publicJwk: PublicJwk;
        type: string;
        fingerprint(): string;
        verifyFingerprint(_fingerprint: string): boolean;
        /**
         * This method returns a wrapped wallet.sign method. The method is being wrapped so we can covert between Uint8Array and Buffer. This is to make it compatible with the external signature libraries.
         */
        signer(): {
            sign: (data: {
                data: Uint8Array | Uint8Array[];
            }) => Promise<Uint8Array>;
        };
        /**
         * This method returns a wrapped wallet.verify method. The method is being wrapped so we can covert between Uint8Array and Buffer. This is to make it compatible with the external signature libraries.
         */
        verifier(): {
            verify: (data: {
                data: Uint8Array | Uint8Array[];
                signature: Uint8Array;
            }) => Promise<boolean>;
        };
        readonly publicKeyBuffer: Uint8Array;
        readonly id: string;
        readonly controller: string;
        export(publicKey?: boolean, privateKey?: boolean): {
            id: string;
            type: string;
            controller: string;
        };
    }>;
};
export {};
