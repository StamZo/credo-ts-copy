"use strict";
// Utils for Mixins in TypeScript
// @see https://www.typescriptlang.org/docs/handbook/mixins.html
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compose = Compose;
/**
 * Apply a list of mixins functions to a base class. Applies extensions in order
 *
 * @param Base Base class
 * @param extensions List of mixin functions that will extend the base class.
 *
 * @example
 * Compose(BaseClass, [TransportDecorated, SignatureDecorated])
 */
function Compose(Base, extensions) {
    // It errors without casting to any, but function + typings works
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return extensions.reduce((extended, extend) => extend(extended), Base);
}
//# sourceMappingURL=mixins.js.map