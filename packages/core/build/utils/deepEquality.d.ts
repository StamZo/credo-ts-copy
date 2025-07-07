export declare function deepEquality(x: any, y: any): boolean;
/**
 * @note This will only work for primitive array equality
 */
export declare function equalsIgnoreOrder<Item = string>(a: Array<Item>, b: Array<Item>): boolean;
/**
 * @note This will only work for primitive array equality
 */
export declare function equalsWithOrder<Item = string>(lhs: Array<Item>, rhs: Array<Item>): boolean;
