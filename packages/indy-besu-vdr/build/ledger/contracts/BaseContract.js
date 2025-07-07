"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseContract = void 0;
class BaseContract {
    constructor(client, config) {
        this.client = client;
        this.config = config;
    }
    async signAndSubmit(transaction, signer, timeoutMs) {
        // Use mock mode if configured
        if (this.config?.skipBlockchainWrites) {
            return this.mockSignAndSubmit(transaction);
        }
        const actualTimeout = timeoutMs || this.config?.transactionTimeoutMs || 30000;
        const maxRetries = this.config?.maxRetries || 3;
        let lastError = null;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔐 Signing transaction (attempt ${attempt}/${maxRetries})...`);
                signer.signTransaction(transaction);
                console.log('✅ Transaction signed');
                console.log('📤 Submitting transaction...');
                const submitPromise = this.client.submitTransaction(transaction);
                const submitTimeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => {
                        reject(new Error(`Transaction submission timed out after ${actualTimeout}ms`));
                    }, actualTimeout);
                });
                const transactionHash = await Promise.race([submitPromise, submitTimeoutPromise]);
                console.log('✅ Transaction submitted, hash:', Buffer.from(transactionHash).toString('hex'));
                console.log('⏳ Waiting for transaction receipt...');
                const receiptPromise = this.client.getReceipt(transactionHash);
                const receiptTimeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => {
                        reject(new Error(`Transaction receipt timeout after ${actualTimeout}ms`));
                    }, actualTimeout);
                });
                try {
                    const receipt = await Promise.race([receiptPromise, receiptTimeoutPromise]);
                    console.log('✅ Transaction receipt received');
                    return receipt;
                }
                catch (error) {
                    if (error.message.includes('timeout')) {
                        console.warn(`⚠️  Receipt timed out on attempt ${attempt}, but transaction may still be pending`);
                        // Return success with pending status
                        return {
                            status: 'pending',
                            transactionHash: Buffer.from(transactionHash).toString('hex'),
                            message: 'Transaction submitted but receipt timed out',
                            attempt
                        };
                    }
                    throw error;
                }
            }
            catch (error) {
                lastError = error;
                console.error(`❌ Attempt ${attempt} failed:`, error.message);
                if (attempt < maxRetries) {
                    const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                    console.log(`⏱️  Waiting ${backoffMs}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, backoffMs));
                }
            }
        }
        throw lastError || new Error('Transaction failed after all retries');
    }
    async mockSignAndSubmit(transaction) {
        console.log('🎭 Mock mode: Simulating blockchain transaction...');
        // Simulate some processing time
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
            status: 'success',
            transactionHash: '0x' + Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex'),
            blockNumber: Math.floor(Math.random() * 1000000),
            gasUsed: '21000',
            mock: true
        };
    }
}
exports.BaseContract = BaseContract;
//# sourceMappingURL=BaseContract.js.map