import { Ed25519PublicJwk, PublicJwk } from '../kms';
export declare function isDidKey(key: string): boolean;
export declare function didKeyToVerkey(key: string): string;
export declare function verkeyToDidKey(verkey: string): string;
export declare function didKeyToEd25519PublicJwk(key: string): PublicJwk<Ed25519PublicJwk>;
export declare function verkeyToPublicJwk(verkey: string): PublicJwk<Ed25519PublicJwk>;
