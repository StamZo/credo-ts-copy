/// <reference types="jest" />
/// <reference types="node" />

declare global {
  namespace NodeJS {
    interface Global {
      crypto: Crypto;
    }
  }
}

export {};