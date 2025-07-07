import * as z from '../../../utils/zod';
export declare const zKmsRandomBytesOptions: z.ZodObject<{
    /**
     * The number of random bytes to genreate
     */
    length: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    length: number;
}, {
    length: number;
}>;
export type KmsRandomBytesOptions = z.output<typeof zKmsRandomBytesOptions>;
/**
 * The generated random bytes
 */
export type KmsRandomBytesReturn = Uint8Array;
