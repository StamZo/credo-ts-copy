import type { IssuerSignedDocument } from '@animo-id/mdoc';
import type { AgentContext } from '../../agent';
import type { MdocNameSpaces, MdocSignOptions, MdocVerifyOptions } from './MdocOptions';
import { DeviceSignedDocument } from '@animo-id/mdoc';
import { ClaimFormat } from '../vc/index';
import { KnownJwaSignatureAlgorithm, PublicJwk } from '../kms';
/**
 * This class represents a IssuerSigned Mdoc Document,
 * which are the actual credentials being issued to holders.
 */
export declare class Mdoc {
    issuerSignedDocument: IssuerSignedDocument | DeviceSignedDocument;
    base64Url: string;
    private constructor();
    /**
     * claim format is convenience method added to all credential instances
     */
    get claimFormat(): ClaimFormat.MsoMdoc;
    /**
     * Encoded is convenience method added to all credential instances
     */
    get encoded(): string;
    /**
     * Get the device key to which the mdoc is bound
     */
    get deviceKey(): PublicJwk | null;
    static fromBase64Url(mdocBase64Url: string, expectedDocType?: string): Mdoc;
    static fromIssuerSignedDocument(issuerSignedBase64Url: string, expectedDocType?: string): Mdoc;
    static fromDeviceSignedDocument(issuerSignedBase64Url: string, deviceSignedBase64Url: string, expectedDocType?: string): Mdoc;
    get docType(): string;
    get alg(): KnownJwaSignatureAlgorithm;
    get validityInfo(): import("@animo-id/mdoc").ValidityInfo;
    get deviceSignedNamespaces(): MdocNameSpaces | null;
    get issuerSignedCertificateChain(): [Uint8Array<ArrayBufferLike>, ...Uint8Array<ArrayBufferLike>[]];
    get issuerSignedNamespaces(): MdocNameSpaces;
    static sign(agentContext: AgentContext, options: MdocSignOptions): Promise<Mdoc>;
    verify(agentContext: AgentContext, options?: MdocVerifyOptions): Promise<{
        isValid: true;
    } | {
        isValid: false;
        error: string;
    }>;
    private toJSON;
    private toString;
}
