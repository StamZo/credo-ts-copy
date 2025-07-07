import type { DidDocumentService } from './service';
import { Ed25519PublicJwk, PublicJwk, X25519PublicJwk } from '../../kms';
import { DidCommV1Service, IndyAgentService } from './service';
import { VerificationMethod } from './verificationMethod';
export type DidPurpose = 'authentication' | 'keyAgreement' | 'assertionMethod' | 'capabilityInvocation' | 'capabilityDelegation';
type DidVerificationMethods = DidPurpose | 'verificationMethod';
interface DidDocumentOptions {
    context?: string | string[];
    id: string;
    alsoKnownAs?: string[];
    controller?: string | string[];
    verificationMethod?: VerificationMethod[];
    service?: DidDocumentService[];
    authentication?: Array<string | VerificationMethod>;
    assertionMethod?: Array<string | VerificationMethod>;
    keyAgreement?: Array<string | VerificationMethod>;
    capabilityInvocation?: Array<string | VerificationMethod>;
    capabilityDelegation?: Array<string | VerificationMethod>;
}
export declare class DidDocument {
    context: string | string[];
    id: string;
    alsoKnownAs?: string[];
    controller?: string | string[];
    verificationMethod?: VerificationMethod[];
    service?: DidDocumentService[];
    authentication?: Array<string | VerificationMethod>;
    assertionMethod?: Array<string | VerificationMethod>;
    keyAgreement?: Array<string | VerificationMethod>;
    capabilityInvocation?: Array<string | VerificationMethod>;
    capabilityDelegation?: Array<string | VerificationMethod>;
    constructor(options: DidDocumentOptions);
    dereferenceVerificationMethod(keyId: string): VerificationMethod;
    dereferenceKey(keyId: string, allowedPurposes?: DidVerificationMethods[]): VerificationMethod;
    findVerificationMethodByPublicKey(publicJwk: PublicJwk, allowedPurposes?: DidVerificationMethods[]): VerificationMethod;
    /**
     * Returns all of the service endpoints matching the given type.
     *
     * @param type The type of service(s) to query.
     */
    getServicesByType<S extends DidDocumentService = DidDocumentService>(type: string): S[];
    /**
     * Returns all of the service endpoints matching the given class
     *
     * @param classType The class to query services.
     */
    getServicesByClassType<S extends DidDocumentService = DidDocumentService>(classType: new (...args: never[]) => S): S[];
    /**
     * Get all DIDComm services ordered by priority descending. This means the highest
     * priority will be the first entry.
     */
    get didCommServices(): Array<IndyAgentService | DidCommV1Service>;
    get recipientKeys(): PublicJwk<Ed25519PublicJwk | X25519PublicJwk>[];
    /**
     * Returns the recipient keys with their verification method matches
     *
     * We should probably deprecate recipientKeys in favour of this one
     */
    getRecipientKeysWithVerificationMethod<MapX25519ToEd25519 extends boolean>({ mapX25519ToEd25519, }: {
        mapX25519ToEd25519: MapX25519ToEd25519;
    }): Array<{
        verificationMethod: VerificationMethod;
        publicJwk: PublicJwk<MapX25519ToEd25519 extends true ? Ed25519PublicJwk : Ed25519PublicJwk | X25519PublicJwk>;
    }>;
    toJSON(): Record<string, any>;
    static fromJSON(didDocument: unknown): DidDocument;
}
/**
 * Extracting the verification method for signature type
 * @param type Signature type
 * @param didDocument DidDocument
 * @returns verification method
 */
export declare function findVerificationMethodByKeyType(keyType: string, didDocument: DidDocument): Promise<VerificationMethod | null>;
export {};
