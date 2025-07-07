export declare function isObject(item: unknown): item is Record<string, unknown>;
/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export declare function mergeDeep(target: unknown, ...sources: Array<unknown>): unknown;
