import type { AgentContext, Logger } from '@credo-ts/core';
import type { Oauth2ErrorCodes, Oauth2ServerErrorResponseError } from '@openid4vc/oauth2';
import type { NextFunction, Request, Response } from 'express';
import { Oauth2ResourceUnauthorizedError } from '@openid4vc/oauth2';
export interface OpenId4VcRequest<RC extends Record<string, unknown> = Record<string, never>> extends Request {
    requestContext?: RC & OpenId4VcRequestContext;
}
export interface OpenId4VcRequestContext {
    agentContext: AgentContext;
}
export declare function sendUnauthorizedError(response: Response, next: NextFunction, logger: Logger, error: unknown | Oauth2ResourceUnauthorizedError, status?: number): void;
export declare function sendOauth2ErrorResponse(response: Response, next: NextFunction, logger: Logger, error: Oauth2ServerErrorResponseError): void;
export declare function sendUnknownServerErrorResponse(response: Response, next: NextFunction, logger: Logger, error: unknown): void;
export declare function sendNotFoundResponse(response: Response, next: NextFunction, logger: Logger, internalReason: string): void;
export declare function sendErrorResponse(response: Response, next: NextFunction, logger: Logger, status: number, errorCode: Oauth2ErrorCodes | string, errorDescription?: string, additionalPayload?: Record<string, unknown>, error?: Error): void;
export declare function sendJsonResponse(response: Response, next: NextFunction, body: any, contentType?: string, status?: number): void;
export declare function getRequestContext<T extends OpenId4VcRequest<any>>(request: T): NonNullable<T['requestContext']>;
