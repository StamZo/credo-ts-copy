import type { AgentContext } from '@credo-ts/core';
type TenantRecordAskarStoreConfig = {
    key: string;
};
/**
 * Store the aksar store config associated with a context correlation id. If multi-tenancy is not used
 * this method won't do anything as we can just use the store config from the default context. However
 * if multi-tenancy is used, we will store the askar store config in the tenant record metadata so it can
 * be queried when a wallet is opened.
 *
 * This method will only be used when using the DatabasePerWallet database scheme, where each wallet has it's own
 * database and also it's own encryption key.
 */
export declare function storeAskarStoreConfigForContextCorrelationId(agentContext: AgentContext, config: TenantRecordAskarStoreConfig): Promise<void>;
export declare function getAskarStoreConfigForContextCorrelationId(agentContext: AgentContext): Promise<TenantRecordAskarStoreConfig>;
export {};
