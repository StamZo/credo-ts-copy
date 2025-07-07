import type { CheqdNetwork } from '@cheqd/sdk';
import type { ParsedDid } from '@credo-ts/core';
export declare const ED25519_SUITE_CONTEXT_URL_2018 = "https://w3id.org/security/suites/ed25519-2018/v1";
export declare const ED25519_SUITE_CONTEXT_URL_2020 = "https://w3id.org/security/suites/ed25519-2020/v1";
export declare const cheqdSdkAnonCredsRegistryIdentifierRegex: RegExp;
export declare const cheqdDidRegex: RegExp;
export declare const cheqdDidVersionRegex: RegExp;
export declare const cheqdDidVersionsRegex: RegExp;
export declare const cheqdDidMetadataRegex: RegExp;
export declare const cheqdResourceRegex: RegExp;
export declare const cheqdResourceMetadataRegex: RegExp;
export type ParsedCheqdDid = ParsedDid & {
    network: `${CheqdNetwork}`;
};
export declare function parseCheqdDid(didUrl: string): ParsedCheqdDid | null;
export declare const cheqdAnonCredsResourceTypes: {
    schema: string;
    credentialDefinition: string;
    revocationRegistryDefinition: string;
    revocationStatusList: string;
};
