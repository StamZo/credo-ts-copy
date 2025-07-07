import type { KeyDidMapping } from './keyDidMapping';
import { P256PublicJwk, P384PublicJwk, P521PublicJwk } from '../../../kms';
export declare const keyDidJsonWebKey: KeyDidMapping<P256PublicJwk | P384PublicJwk | P521PublicJwk>;
