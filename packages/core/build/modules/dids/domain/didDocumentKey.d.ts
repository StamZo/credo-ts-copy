import { DidDocumentKey } from '../DidsApiOptions';
import { VerificationMethod } from './verificationMethod';
export declare function getKmsKeyIdForVerifiacationMethod(verificationMethod: VerificationMethod, keys?: DidDocumentKey[]): string | undefined;
