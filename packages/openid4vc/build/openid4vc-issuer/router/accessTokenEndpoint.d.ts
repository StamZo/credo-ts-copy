import type { NextFunction, Response, Router } from 'express';
import type { OpenId4VcIssuerModuleConfig } from '../OpenId4VcIssuerModuleConfig';
import type { OpenId4VcIssuanceRequest } from './requestContext';
export declare function configureAccessTokenEndpoint(router: Router, config: OpenId4VcIssuerModuleConfig): void;
export declare function handleTokenRequest(config: OpenId4VcIssuerModuleConfig): (request: OpenId4VcIssuanceRequest, response: Response, next: NextFunction) => Promise<void>;
