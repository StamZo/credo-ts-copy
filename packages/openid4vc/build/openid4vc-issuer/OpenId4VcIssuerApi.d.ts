import type { OpenId4VcUpdateIssuerRecordOptions, OpenId4VciCreateCredentialOfferOptions, OpenId4VciCreateCredentialResponseOptions, OpenId4VciCreateIssuerOptions, OpenId4VciCreateStatelessCredentialOfferOptions } from './OpenId4VcIssuerServiceOptions';
import { AgentContext } from '@credo-ts/core';
import { OpenId4VcIssuerModuleConfig } from './OpenId4VcIssuerModuleConfig';
import { OpenId4VcIssuerService } from './OpenId4VcIssuerService';
/**
 * @public
 * This class represents the API for interacting with the OpenID4VC Issuer service.
 * It provides methods for creating a credential offer, creating a response to a credential issuance request,
 * and retrieving a credential offer from a URI.
 */
export declare class OpenId4VcIssuerApi {
    readonly config: OpenId4VcIssuerModuleConfig;
    private agentContext;
    private openId4VcIssuerService;
    constructor(config: OpenId4VcIssuerModuleConfig, agentContext: AgentContext, openId4VcIssuerService: OpenId4VcIssuerService);
    getAllIssuers(): Promise<import("./repository").OpenId4VcIssuerRecord[]>;
    getIssuerByIssuerId(issuerId: string): Promise<import("./repository").OpenId4VcIssuerRecord>;
    /**
     * Creates an issuer and stores the corresponding issuer metadata. Multiple issuers can be created, to allow different sets of
     * credentials to be issued with each issuer.
     */
    createIssuer(options: OpenId4VciCreateIssuerOptions): Promise<import("./repository").OpenId4VcIssuerRecord>;
    /**
     * Rotate the key used for signing access tokens for the issuer with the given issuerId.
     */
    rotateAccessTokenSigningKey(issuerId: string): Promise<void>;
    updateIssuerMetadata(options: OpenId4VcUpdateIssuerRecordOptions): Promise<void>;
    /**
     * Creates a stateless credential offer. This can only be used with an external authorization server, as credo only supports stateful
     * credential offers.
     */
    createStatelessCredentialOffer(options: OpenId4VciCreateStatelessCredentialOfferOptions & {
        issuerId: string;
    }): Promise<{
        credentialOffer: string;
        credentialOfferObject: import("zod").objectInputType<{
            credential_issuer: import("zod").ZodEffects<import("zod").ZodString, string, string>;
            credential_configuration_ids: import("zod").ZodArray<import("zod").ZodString, "many">;
            grants: import("zod").ZodOptional<import("zod").ZodObject<{
                authorization_code: import("zod").ZodOptional<import("zod").ZodObject<{
                    issuer_state: import("zod").ZodOptional<import("zod").ZodString>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                    issuer_state: import("zod").ZodOptional<import("zod").ZodString>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                    issuer_state: import("zod").ZodOptional<import("zod").ZodString>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, import("zod").ZodTypeAny, "passthrough">>>;
                "urn:ietf:params:oauth:grant-type:pre-authorized_code": import("zod").ZodOptional<import("zod").ZodObject<{
                    "pre-authorized_code": import("zod").ZodString;
                    tx_code: import("zod").ZodOptional<import("zod").ZodObject<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">>>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                    "pre-authorized_code": import("zod").ZodString;
                    tx_code: import("zod").ZodOptional<import("zod").ZodObject<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">>>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                    "pre-authorized_code": import("zod").ZodString;
                    tx_code: import("zod").ZodOptional<import("zod").ZodObject<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">>>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, import("zod").ZodTypeAny, "passthrough">>>;
            }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                authorization_code: import("zod").ZodOptional<import("zod").ZodObject<{
                    issuer_state: import("zod").ZodOptional<import("zod").ZodString>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                    issuer_state: import("zod").ZodOptional<import("zod").ZodString>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                    issuer_state: import("zod").ZodOptional<import("zod").ZodString>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, import("zod").ZodTypeAny, "passthrough">>>;
                "urn:ietf:params:oauth:grant-type:pre-authorized_code": import("zod").ZodOptional<import("zod").ZodObject<{
                    "pre-authorized_code": import("zod").ZodString;
                    tx_code: import("zod").ZodOptional<import("zod").ZodObject<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">>>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                    "pre-authorized_code": import("zod").ZodString;
                    tx_code: import("zod").ZodOptional<import("zod").ZodObject<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">>>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                    "pre-authorized_code": import("zod").ZodString;
                    tx_code: import("zod").ZodOptional<import("zod").ZodObject<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">>>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, import("zod").ZodTypeAny, "passthrough">>>;
            }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                authorization_code: import("zod").ZodOptional<import("zod").ZodObject<{
                    issuer_state: import("zod").ZodOptional<import("zod").ZodString>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                    issuer_state: import("zod").ZodOptional<import("zod").ZodString>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                    issuer_state: import("zod").ZodOptional<import("zod").ZodString>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, import("zod").ZodTypeAny, "passthrough">>>;
                "urn:ietf:params:oauth:grant-type:pre-authorized_code": import("zod").ZodOptional<import("zod").ZodObject<{
                    "pre-authorized_code": import("zod").ZodString;
                    tx_code: import("zod").ZodOptional<import("zod").ZodObject<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">>>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                    "pre-authorized_code": import("zod").ZodString;
                    tx_code: import("zod").ZodOptional<import("zod").ZodObject<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">>>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                    "pre-authorized_code": import("zod").ZodString;
                    tx_code: import("zod").ZodOptional<import("zod").ZodObject<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "passthrough", import("zod").ZodTypeAny, import("zod").objectOutputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">, import("zod").objectInputType<{
                        input_mode: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodLiteral<"numeric">, import("zod").ZodLiteral<"text">]>>;
                        length: import("zod").ZodOptional<import("zod").ZodNumber>;
                        description: import("zod").ZodOptional<import("zod").ZodString>;
                    }, import("zod").ZodTypeAny, "passthrough">>>;
                    authorization_server: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
                }, import("zod").ZodTypeAny, "passthrough">>>;
            }, import("zod").ZodTypeAny, "passthrough">>>;
        }, import("zod").ZodTypeAny, "passthrough">;
    }>;
    /**
     * Creates a credential offer. Either the preAuthorizedCodeFlowConfig or the authorizationCodeFlowConfig must be provided.
     *
     * @returns Object containing the payload of the credential offer and the credential offer request, which can be sent to the wallet.
     */
    createCredentialOffer(options: OpenId4VciCreateCredentialOfferOptions & {
        issuerId: string;
    }): Promise<{
        issuanceSession: import("./repository").OpenId4VcIssuanceSessionRecord;
        credentialOffer: string;
    }>;
    /**
     * This function creates a response which can be send to the holder after receiving a credential issuance request.
     */
    createCredentialResponse(options: OpenId4VciCreateCredentialResponseOptions & {
        issuanceSessionId: string;
    }): Promise<{
        credentialResponse: import("zod").objectOutputType<{
            credential: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>]>>;
            credentials: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>]>, "many">>;
            transaction_id: import("zod").ZodOptional<import("zod").ZodString>;
            c_nonce: import("zod").ZodOptional<import("zod").ZodString>;
            c_nonce_expires_in: import("zod").ZodOptional<import("zod").ZodNumber>;
            notification_id: import("zod").ZodOptional<import("zod").ZodString>;
        }, import("zod").ZodTypeAny, "passthrough">;
        issuanceSession: import("./repository").OpenId4VcIssuanceSessionRecord;
    }>;
    getIssuerMetadata(issuerId: string): Promise<import("@openid4vc/openid4vci").IssuerMetadataResult>;
    getIssuanceSessionById(issuanceSessionId: string): Promise<import("./repository").OpenId4VcIssuanceSessionRecord>;
}
