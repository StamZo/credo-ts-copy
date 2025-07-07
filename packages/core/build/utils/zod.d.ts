import { z } from 'zod';
export type BaseSchema = z.Schema<any, any, any>;
export declare function parseWithErrorHandling<Schema extends BaseSchema>(schema: Schema, data: unknown, customErrorMessage?: string): z.output<Schema>;
declare const zUniqueArray: <const TItem extends BaseSchema>(item: TItem) => z.ZodEffects<z.ZodArray<TItem, "many">, TItem["_output"][], TItem["_input"][]>;
declare const zOptionalToUndefined: <const TItem extends BaseSchema>(item: TItem) => z.ZodOptional<z.ZodEffects<TItem, undefined, z.input<TItem>>>;
declare const zBase64Url: z.ZodString;
export * from 'zod';
export { zUniqueArray as uniqueArray, zOptionalToUndefined as optionalToUndefined, zBase64Url as base64Url };
