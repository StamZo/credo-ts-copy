export declare function importSecureEnvironment(): {
    sign: (id: string, message: Uint8Array) => Promise<Uint8Array>;
    getPublicBytesForKeyId: (id: string) => Promise<Uint8Array>;
    generateKeypair: (id: string) => Promise<void>;
    deleteKey: (id: string) => Promise<void>;
    KeyAlreadyExistsError: typeof Error;
    KeyNotFoundError: typeof Error;
};
