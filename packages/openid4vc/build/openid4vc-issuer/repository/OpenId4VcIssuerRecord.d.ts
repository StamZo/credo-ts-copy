import { Kms, RecordTags, TagsBase } from '@credo-ts/core';
import type { OpenId4VciAuthorizationServerConfig, OpenId4VciCredentialConfigurationsSupportedWithFormats, OpenId4VciCredentialIssuerMetadataDisplay } from '../../shared';
import type { OpenId4VciBatchCredentialIssuanceOptions } from '../OpenId4VcIssuerServiceOptions';
import { BaseRecord } from '@credo-ts/core';
export type OpenId4VcIssuerRecordTags = RecordTags<OpenId4VcIssuerRecord>;
export type DefaultOpenId4VcIssuerRecordTags = {
    issuerId: string;
};
export type OpenId4VcIssuerRecordProps = {
    id?: string;
    createdAt?: Date;
    tags?: TagsBase;
    issuerId: string;
    /**
     * The public jwk of the key used to sign access tokens for this issuer. Must include a `kid` parameter.
     */
    accessTokenPublicJwk: Kms.KmsJwkPublicAsymmetric;
    /**
     * The DPoP signing algorithms supported by this issuer.
     * If not provided, dPoP is considered unsupported.
     */
    dpopSigningAlgValuesSupported?: [Kms.KnownJwaSignatureAlgorithm, ...Kms.KnownJwaSignatureAlgorithm[]];
    display?: OpenId4VciCredentialIssuerMetadataDisplay[];
    authorizationServerConfigs?: OpenId4VciAuthorizationServerConfig[];
    credentialConfigurationsSupported: OpenId4VciCredentialConfigurationsSupportedWithFormats;
    /**
     * Indicate support for batch issuane of credentials
     */
    batchCredentialIssuance?: OpenId4VciBatchCredentialIssuanceOptions;
};
/**
 * For OID4VC you need to expose metadata files. Each issuer needs to host this metadata. This is not the case for DIDComm where we can just have one /didcomm endpoint.
 * So we create a record per openid issuer/verifier that you want, and each tenant can create multiple issuers/verifiers which have different endpoints
 * and metadata files
 * */
export declare class OpenId4VcIssuerRecord extends BaseRecord<DefaultOpenId4VcIssuerRecordTags> {
    static readonly type = "OpenId4VcIssuerRecord";
    readonly type = "OpenId4VcIssuerRecord";
    issuerId: string;
    /**
     * @deprecated accessTokenPublicJwk should be used
     * @todo remove in migration
     */
    accessTokenPublicKeyFingerprint?: string;
    accessTokenPublicJwk?: Kms.KmsJwkPublicAsymmetric;
    /**
     * Only here for class transformation. If credentialsSupported is set we transform
     * it to the new credentialConfigurationsSupported format
     */
    private set credentialsSupported(value);
    credentialConfigurationsSupported: OpenId4VciCredentialConfigurationsSupportedWithFormats;
    display?: OpenId4VciCredentialIssuerMetadataDisplay[];
    authorizationServerConfigs?: OpenId4VciAuthorizationServerConfig[];
    dpopSigningAlgValuesSupported?: [Kms.KnownJwaSignatureAlgorithm, ...Kms.KnownJwaSignatureAlgorithm[]];
    batchCredentialIssuance?: OpenId4VciBatchCredentialIssuanceOptions;
    get resolvedAccessTokenPublicJwk(): Kms.PublicJwk<Kms.RsaPublicJwk>;
    constructor(props: OpenId4VcIssuerRecordProps);
    getTags(): {
        issuerId: string;
    };
}
