import * as z from '../../../utils/zod';
export declare const zKmsGetPublicKeyOptions: z.ZodObject<{
    /**
     * The key id of the key to get the public bytes for.
     */
    keyId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    keyId: string;
}, {
    keyId: string;
}>;
export type KmsGetPublicKeyOptions = z.output<typeof zKmsGetPublicKeyOptions>;
