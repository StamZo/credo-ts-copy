import * as z from '../../../utils/zod';
export declare const zKmsDeleteKeyOptions: z.ZodObject<{
    /**
     * The `kid` for the key.
     */
    keyId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    keyId: string;
}, {
    keyId: string;
}>;
export type KmsDeleteKeyOptions = z.output<typeof zKmsDeleteKeyOptions>;
