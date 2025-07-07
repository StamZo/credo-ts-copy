import type { AgentContext } from '../../agent';
import type { VerifiablePresentation } from '../dif-presentation-exchange/index';
import { DcqlQuery } from 'dcql';
import { MdocOpenId4VpDcApiSessionTranscriptOptions, MdocOpenId4VpSessionTranscriptOptions } from '../mdoc';
import { DcqlCredentialsForRequest, DcqlEncodedPresentations, DcqlPresentation, DcqlQueryResult } from './models';
export declare class DcqlService {
    /**
     * Queries the wallet for credentials that match the given dcql query. This only does an initial query based on the
     * schema of the input descriptors. It does not do any further filtering based on the constraints in the input descriptors.
     */
    private queryCredentialsForDcqlQuery;
    getDcqlCredentialRepresentation(presentation: VerifiablePresentation, queryCredential: DcqlQuery['credentials'][number]): DcqlQueryResult['credentials'];
    getCredentialsForRequest(agentContext: AgentContext, dcqlQuery: DcqlQuery.Input): Promise<DcqlQueryResult>;
    assertValidDcqlPresentation(dcqlPresentation: DcqlPresentation, dcqlQuery: DcqlQuery): {
        credentials: [{
            id: string;
            format: "mso_mdoc";
            claims?: [{
                namespace: string;
                claim_name: string;
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            } | {
                path: [string, string];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
                intent_to_retain?: boolean | undefined;
            }, ...({
                namespace: string;
                claim_name: string;
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            } | {
                path: [string, string];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
                intent_to_retain?: boolean | undefined;
            })[]] | undefined;
            claim_sets?: [[string, ...string[]], ...[string, ...string[]][]] | undefined;
            trusted_authorities?: [{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }, ...{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }[]] | undefined;
            meta?: {
                doctype_value?: string | undefined;
            } | undefined;
        } | {
            id: string;
            format: "vc+sd-jwt" | "dc+sd-jwt";
            claims?: [{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }, ...{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }[]] | undefined;
            claim_sets?: [[string, ...string[]], ...[string, ...string[]][]] | undefined;
            trusted_authorities?: [{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }, ...{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }[]] | undefined;
            meta?: {
                vct_values?: string[] | undefined;
            } | undefined;
        } | {
            id: string;
            format: "ldp_vc" | "jwt_vc_json";
            meta: {
                type_values: [[string, ...string[]], ...[string, ...string[]][]];
            };
            claims?: [{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }, ...{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }[]] | undefined;
            claim_sets?: [[string, ...string[]], ...[string, ...string[]][]] | undefined;
            trusted_authorities?: [{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }, ...{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }[]] | undefined;
        }, ...({
            id: string;
            format: "mso_mdoc";
            claims?: [{
                namespace: string;
                claim_name: string;
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            } | {
                path: [string, string];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
                intent_to_retain?: boolean | undefined;
            }, ...({
                namespace: string;
                claim_name: string;
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            } | {
                path: [string, string];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
                intent_to_retain?: boolean | undefined;
            })[]] | undefined;
            claim_sets?: [[string, ...string[]], ...[string, ...string[]][]] | undefined;
            trusted_authorities?: [{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }, ...{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }[]] | undefined;
            meta?: {
                doctype_value?: string | undefined;
            } | undefined;
        } | {
            id: string;
            format: "vc+sd-jwt" | "dc+sd-jwt";
            claims?: [{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }, ...{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }[]] | undefined;
            claim_sets?: [[string, ...string[]], ...[string, ...string[]][]] | undefined;
            trusted_authorities?: [{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }, ...{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }[]] | undefined;
            meta?: {
                vct_values?: string[] | undefined;
            } | undefined;
        } | {
            id: string;
            format: "ldp_vc" | "jwt_vc_json";
            meta: {
                type_values: [[string, ...string[]], ...[string, ...string[]][]];
            };
            claims?: [{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }, ...{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }[]] | undefined;
            claim_sets?: [[string, ...string[]], ...[string, ...string[]][]] | undefined;
            trusted_authorities?: [{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }, ...{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }[]] | undefined;
        })[]];
        canBeSatisfied: boolean;
        invalid_matches: {
            [x: string]: {
                issues: [unknown, ...unknown[]];
                output: unknown;
                success: false;
                typed: boolean;
                claim_set_index: number | undefined;
                presentation_id: string;
            };
        } | undefined;
        valid_matches: {
            [x: string]: {
                output: {
                    namespaces: {
                        [x: string]: {
                            [x: string]: unknown;
                        };
                    };
                    credential_format: "mso_mdoc";
                    doctype: string;
                    authority?: {
                        value: string;
                        type: "aki";
                    } | {
                        value: string;
                        type: "etsi_tl";
                    } | {
                        value: string;
                        type: "openid_federation";
                    } | undefined;
                } | {
                    claims: {
                        [x: string]: string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
                        } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                    };
                    vct: string;
                    credential_format: "dc+sd-jwt" | "vc+sd-jwt";
                    authority?: {
                        value: string;
                        type: "aki";
                    } | {
                        value: string;
                        type: "etsi_tl";
                    } | {
                        value: string;
                        type: "openid_federation";
                    } | undefined;
                } | {
                    type: string[];
                    claims: {
                        [x: string]: string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
                        } | (string | number | boolean | {
                            [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
                        } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
                    };
                    credential_format: "ldp_vc" | "jwt_vc_json";
                    authority?: {
                        value: string;
                        type: "aki";
                    } | {
                        value: string;
                        type: "etsi_tl";
                    } | {
                        value: string;
                        type: "openid_federation";
                    } | undefined;
                };
                success: true;
                typed: true;
                claim_set_index: number | undefined;
                presentation_id: string;
            };
        };
        credential_sets?: [{
            options: [string[], ...string[][]];
            required: boolean;
            matching_options: [string[], ...string[][]] | undefined;
            purpose?: string | number | {
                [x: string]: unknown;
            } | undefined;
        }, ...{
            options: [string[], ...string[][]];
            required: boolean;
            matching_options: [string[], ...string[][]] | undefined;
            purpose?: string | number | {
                [x: string]: unknown;
            } | undefined;
        }[]] | undefined;
    };
    /**
     * Selects the credentials to use based on the output from `getCredentialsForRequest`
     * Use this method if you don't want to manually select the credentials yourself.
     */
    selectCredentialsForRequest(dcqlQueryResult: DcqlQueryResult): DcqlCredentialsForRequest;
    validateDcqlQuery(dcqlQuery: DcqlQuery | DcqlQuery.Input | unknown): {
        credentials: [{
            id: string;
            format: "mso_mdoc";
            claims?: [{
                namespace: string;
                claim_name: string;
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            } | {
                path: [string, string];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
                intent_to_retain?: boolean | undefined;
            }, ...({
                namespace: string;
                claim_name: string;
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            } | {
                path: [string, string];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
                intent_to_retain?: boolean | undefined;
            })[]] | undefined;
            claim_sets?: [[string, ...string[]], ...[string, ...string[]][]] | undefined;
            trusted_authorities?: [{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }, ...{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }[]] | undefined;
            meta?: {
                doctype_value?: string | undefined;
            } | undefined;
        } | {
            id: string;
            format: "vc+sd-jwt" | "dc+sd-jwt";
            claims?: [{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }, ...{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }[]] | undefined;
            claim_sets?: [[string, ...string[]], ...[string, ...string[]][]] | undefined;
            trusted_authorities?: [{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }, ...{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }[]] | undefined;
            meta?: {
                vct_values?: string[] | undefined;
            } | undefined;
        } | {
            id: string;
            format: "ldp_vc" | "jwt_vc_json";
            meta: {
                type_values: [[string, ...string[]], ...[string, ...string[]][]];
            };
            claims?: [{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }, ...{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }[]] | undefined;
            claim_sets?: [[string, ...string[]], ...[string, ...string[]][]] | undefined;
            trusted_authorities?: [{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }, ...{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }[]] | undefined;
        }, ...({
            id: string;
            format: "mso_mdoc";
            claims?: [{
                namespace: string;
                claim_name: string;
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            } | {
                path: [string, string];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
                intent_to_retain?: boolean | undefined;
            }, ...({
                namespace: string;
                claim_name: string;
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            } | {
                path: [string, string];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
                intent_to_retain?: boolean | undefined;
            })[]] | undefined;
            claim_sets?: [[string, ...string[]], ...[string, ...string[]][]] | undefined;
            trusted_authorities?: [{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }, ...{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }[]] | undefined;
            meta?: {
                doctype_value?: string | undefined;
            } | undefined;
        } | {
            id: string;
            format: "vc+sd-jwt" | "dc+sd-jwt";
            claims?: [{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }, ...{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }[]] | undefined;
            claim_sets?: [[string, ...string[]], ...[string, ...string[]][]] | undefined;
            trusted_authorities?: [{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }, ...{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }[]] | undefined;
            meta?: {
                vct_values?: string[] | undefined;
            } | undefined;
        } | {
            id: string;
            format: "ldp_vc" | "jwt_vc_json";
            meta: {
                type_values: [[string, ...string[]], ...[string, ...string[]][]];
            };
            claims?: [{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }, ...{
                path: [string | number | null, ...(string | number | null)[]];
                values?: (string | number | boolean)[] | undefined;
                id?: string | undefined;
            }[]] | undefined;
            claim_sets?: [[string, ...string[]], ...[string, ...string[]][]] | undefined;
            trusted_authorities?: [{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }, ...{
                type: "aki" | "etsi_tl" | "openid_federation";
                values: [string, ...string[]];
            }[]] | undefined;
        })[]];
        credential_sets?: [{
            options: [string[], ...string[][]];
            required: boolean;
            purpose?: string | number | {
                [x: string]: unknown;
            } | undefined;
        }, ...{
            options: [string[], ...string[][]];
            required: boolean;
            purpose?: string | number | {
                [x: string]: unknown;
            } | undefined;
        }[]] | undefined;
    };
    createPresentation(agentContext: AgentContext, options: {
        credentialQueryToCredential: DcqlCredentialsForRequest;
        challenge: string;
        domain?: string;
        openid4vp?: Omit<MdocOpenId4VpSessionTranscriptOptions, 'verifierGeneratedNonce'> | Omit<MdocOpenId4VpDcApiSessionTranscriptOptions, 'verifierGeneratedNonce'>;
    }): Promise<{
        dcqlPresentation: DcqlPresentation;
        encodedDcqlPresentation: Record<string, string>;
    }>;
    getEncodedPresentations(dcqlPresentation: DcqlPresentation): DcqlEncodedPresentations;
    private getSdJwtVcApi;
    private getMdocApi;
}
