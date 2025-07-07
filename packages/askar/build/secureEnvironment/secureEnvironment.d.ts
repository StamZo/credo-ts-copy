export declare function importSecureEnvironment(): {
    sign: (id: string, message: Uint8Array, biometricsBacked?: boolean) => Promise<Uint8Array>;
    getPublicBytesForKeyId: (id: string) => Promise<Uint8Array>;
    generateKeypair: (id: string, biometricsBacked?: boolean) => Promise<void>;
};
