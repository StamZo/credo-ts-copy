import type { VerificationMethod } from '../verificationMethod';
import { Constructor } from '../../../../utils/mixins';
import { PublicJwk } from '../../../kms';
import { SupportedPublicJwkClass } from '../../../kms/jwk/PublicJwk';
export interface KeyDidMapping<PublicJwkType extends InstanceType<SupportedPublicJwkClass> = InstanceType<SupportedPublicJwkClass>> {
    PublicJwkTypes: Array<Constructor<PublicJwkType>>;
    getVerificationMethods: (did: string, publicJwk: PublicJwk<PublicJwkType>) => VerificationMethod[];
    getPublicJwkFromVerificationMethod(verificationMethod: VerificationMethod): PublicJwk;
    supportedVerificationMethodTypes: string[];
}
export declare function getVerificationMethodsForPublicJwk(publicJwk: PublicJwk, did: string): VerificationMethod[];
export declare function getSupportedVerificationMethodTypesForPublicJwk(publicJwk: PublicJwk | SupportedPublicJwkClass): string[];
export declare function getPublicJwkFromVerificationMethod(verificationMethod: VerificationMethod): PublicJwk;
