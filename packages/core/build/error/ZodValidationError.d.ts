import { z } from 'zod';
import { CredoError } from './CredoError';
export declare class ZodValidationError extends CredoError {
    readonly zodError: z.ZodError;
    constructor(message: string, zodError: z.ZodError);
}
