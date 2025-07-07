import * as z from '../../../utils/zod';
export declare const zWithBackend: <Schema extends z.BaseSchema>(schema: Schema) => z.ZodIntersection<Schema, z.ZodObject<{
    backend: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    backend?: string | undefined;
}, {
    backend?: string | undefined;
}>>;
export type WithBackend<T> = T & {
    /**
     * The backend to use for creating the key. If not provided the
     * default backend for key operations will be used.
     */
    backend?: string;
};
