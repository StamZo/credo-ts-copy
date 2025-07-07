import type { OpenId4VciCredentialConfigurationsSupported, OpenId4VciCredentialConfigurationsSupportedWithFormats } from './models';
import { type CredentialConfigurationsSupported } from '@openid4vc/openid4vci';
/**
 * Returns all entries from the credential offer with the associated metadata resolved.
 */
export declare function getOfferedCredentials<Configurations extends OpenId4VciCredentialConfigurationsSupported | OpenId4VciCredentialConfigurationsSupportedWithFormats>(offeredCredentialConfigurationIds: Array<string>, credentialConfigurationsSupported: Configurations, { ignoreNotFoundIds }?: {
    ignoreNotFoundIds?: boolean;
}): Configurations extends OpenId4VciCredentialConfigurationsSupportedWithFormats ? OpenId4VciCredentialConfigurationsSupportedWithFormats : OpenId4VciCredentialConfigurationsSupported;
export declare function getScopesFromCredentialConfigurationsSupported(credentialConfigurationsSupported: CredentialConfigurationsSupported): string[];
export declare function getAllowedAndRequestedScopeValues(options: {
    requestedScope: string;
    allowedScopes: string[];
}): string[];
export declare function getCredentialConfigurationsSupportedForScopes(credentialConfigurationsSupported: CredentialConfigurationsSupported, scopes: string[]): {
    [k: string]: import("zod").objectOutputType<{
        format: import("zod").ZodString;
        scope: import("zod").ZodOptional<import("zod").ZodString>;
        cryptographic_binding_methods_supported: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        credential_signing_alg_values_supported: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        proof_types_supported: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodUnion<[import("zod").ZodLiteral<"jwt">, import("zod").ZodLiteral<"attestation">, import("zod").ZodString]>, import("zod").ZodObject<{
            proof_signing_alg_values_supported: import("zod").ZodArray<import("zod").ZodString, "many">;
            key_attestations_required: import("zod").ZodOptional<import("zod").ZodObject<{
                key_storage: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodUnion<[import("zod").ZodEnum<["iso_18045_high", "iso_18045_moderate", "iso_18045_enhanced-basic", "iso_18045_basic"]>, import("zod").ZodString]>, "many">>;
                user_authentication: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodUnion<[import("zod").ZodEnum<["iso_18045_high", "iso_18045_moderate", "iso_18045_enhanced-basic", "iso_18045_basic"]>, import("zod").ZodString]>, "many">>;
            }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                key_storage: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodUnion<[import("zod").ZodEnum<["iso_18045_high", "iso_18045_moderate", "iso_18045_enhanced-basic", "iso_18045_basic"]>, import("zod").ZodString]>, "many">>;
                user_authentication: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodUnion<[import("zod").ZodEnum<["iso_18045_high", "iso_18045_moderate", "iso_18045_enhanced-basic", "iso_18045_basic"]>, import("zod").ZodString]>, "many">>;
            }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                key_storage: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodUnion<[import("zod").ZodEnum<["iso_18045_high", "iso_18045_moderate", "iso_18045_enhanced-basic", "iso_18045_basic"]>, import("zod").ZodString]>, "many">>;
                user_authentication: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodUnion<[import("zod").ZodEnum<["iso_18045_high", "iso_18045_moderate", "iso_18045_enhanced-basic", "iso_18045_basic"]>, import("zod").ZodString]>, "many">>;
            }, import("zod").ZodTypeAny, "passthrough">>>;
        }, "strip", import("zod").ZodTypeAny, {
            proof_signing_alg_values_supported: string[];
            key_attestations_required?: import("zod").objectOutputType<{
                key_storage: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodUnion<[import("zod").ZodEnum<["iso_18045_high", "iso_18045_moderate", "iso_18045_enhanced-basic", "iso_18045_basic"]>, import("zod").ZodString]>, "many">>;
                user_authentication: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodUnion<[import("zod").ZodEnum<["iso_18045_high", "iso_18045_moderate", "iso_18045_enhanced-basic", "iso_18045_basic"]>, import("zod").ZodString]>, "many">>;
            }, import("zod").ZodTypeAny, "passthrough"> | undefined;
        }, {
            proof_signing_alg_values_supported: string[];
            key_attestations_required?: import("zod").objectInputType<{
                key_storage: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodUnion<[import("zod").ZodEnum<["iso_18045_high", "iso_18045_moderate", "iso_18045_enhanced-basic", "iso_18045_basic"]>, import("zod").ZodString]>, "many">>;
                user_authentication: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodUnion<[import("zod").ZodEnum<["iso_18045_high", "iso_18045_moderate", "iso_18045_enhanced-basic", "iso_18045_basic"]>, import("zod").ZodString]>, "many">>;
            }, import("zod").ZodTypeAny, "passthrough"> | undefined;
        }>>>;
        display: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            name: import("zod").ZodString;
            locale: import("zod").ZodOptional<import("zod").ZodString>;
            logo: import("zod").ZodOptional<import("zod").ZodObject<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
                alt_text: import("zod").ZodOptional<import("zod").ZodString>;
            }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
                alt_text: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
                alt_text: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod").ZodTypeAny, "passthrough">>>;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            background_color: import("zod").ZodOptional<import("zod").ZodString>;
            background_image: import("zod").ZodOptional<import("zod").ZodObject<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
            }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod").ZodTypeAny, "passthrough">>>;
            text_color: import("zod").ZodOptional<import("zod").ZodString>;
        }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
            name: import("zod").ZodString;
            locale: import("zod").ZodOptional<import("zod").ZodString>;
            logo: import("zod").ZodOptional<import("zod").ZodObject<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
                alt_text: import("zod").ZodOptional<import("zod").ZodString>;
            }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
                alt_text: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
                alt_text: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod").ZodTypeAny, "passthrough">>>;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            background_color: import("zod").ZodOptional<import("zod").ZodString>;
            background_image: import("zod").ZodOptional<import("zod").ZodObject<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
            }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod").ZodTypeAny, "passthrough">>>;
            text_color: import("zod").ZodOptional<import("zod").ZodString>;
        }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
            name: import("zod").ZodString;
            locale: import("zod").ZodOptional<import("zod").ZodString>;
            logo: import("zod").ZodOptional<import("zod").ZodObject<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
                alt_text: import("zod").ZodOptional<import("zod").ZodString>;
            }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
                alt_text: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
                alt_text: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod").ZodTypeAny, "passthrough">>>;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            background_color: import("zod").ZodOptional<import("zod").ZodString>;
            background_image: import("zod").ZodOptional<import("zod").ZodObject<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
            }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                uri: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod").ZodTypeAny, "passthrough">>>;
            text_color: import("zod").ZodOptional<import("zod").ZodString>;
        }, import("zod").ZodTypeAny, "passthrough">>, "many">>;
    }, import("zod").ZodTypeAny, "passthrough">;
};
