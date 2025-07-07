"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskarModuleConfig = exports.AskarMultiWalletDatabaseScheme = void 0;
var AskarMultiWalletDatabaseScheme;
(function (AskarMultiWalletDatabaseScheme) {
    /**
     * Each wallet get its own database and uses a separate store.
     */
    AskarMultiWalletDatabaseScheme["DatabasePerWallet"] = "DatabasePerWallet";
    /**
     * All wallets are stored in a single database, but each wallet uses a separate profile.
     */
    AskarMultiWalletDatabaseScheme["ProfilePerWallet"] = "ProfilePerWallet";
})(AskarMultiWalletDatabaseScheme || (exports.AskarMultiWalletDatabaseScheme = AskarMultiWalletDatabaseScheme = {}));
/**
 * @public
 */
class AskarModuleConfig {
    constructor(options) {
        this.options = options;
    }
    /** See {@link AskarModuleConfigOptions.askar} */
    get askar() {
        return this.options.askar;
    }
    /** See {@link AskarModuleConfigOptions.multiWalletDatabaseScheme} */
    get multiWalletDatabaseScheme() {
        return this.options.multiWalletDatabaseScheme ?? AskarMultiWalletDatabaseScheme.DatabasePerWallet;
    }
    get store() {
        return this.options.store;
    }
    get enableKms() {
        return this.options.enableKms ?? true;
    }
    get enableStorage() {
        return this.options.enableStorage ?? true;
    }
}
exports.AskarModuleConfig = AskarModuleConfig;
//# sourceMappingURL=AskarModuleConfig.js.map