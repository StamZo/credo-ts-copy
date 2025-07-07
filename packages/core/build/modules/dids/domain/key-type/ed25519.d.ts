import { Ed25519PublicJwk } from '../../../kms';
import type { KeyDidMapping } from './keyDidMapping';
export { convertPublicKeyToX25519 } from '@stablelib/ed25519';
export declare const keyDidEd25519: KeyDidMapping<Ed25519PublicJwk>;
