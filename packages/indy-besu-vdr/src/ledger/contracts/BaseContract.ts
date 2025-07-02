import { Signer } from 'ethers'
import { IndyBesuSigner } from '../IndyBesuSigner'
import { LedgerClient, Transaction } from 'indy2-vdr'

export class BaseContract {
  protected client: LedgerClient

  constructor(client: LedgerClient) {
    this.client = client
  }

  public async signAndSubmit(transaction: Transaction, signer: IndyBesuSigner, timeoutMs: number = 30000) {
    console.log('🔐 Signing transaction...')
    await signer.signTransaction(transaction)
    console.log('✅ Transaction signed')
    
    console.log('📤 Submitting transaction...')
    const transactionHash = await this.client.submitTransaction(transaction)
    console.log('✅ Transaction submitted, hash:', Buffer.from(transactionHash).toString('hex'))
    
    console.log('⏳ Waiting for transaction receipt...')
    
    // Add timeout to prevent hanging
    const receiptPromise = this.client.getReceipt(transactionHash)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Transaction receipt timeout after ${timeoutMs}ms`))
      }, timeoutMs)
    })
    
    try {
      const receipt = await Promise.race([receiptPromise, timeoutPromise])
      console.log('✅ Transaction receipt received')
      return receipt
    } catch (error: any) {
      if (error.message.includes('timeout')) {
        console.warn('⚠️  Transaction receipt timed out, but transaction may still be pending')
        console.warn('Transaction hash:', Buffer.from(transactionHash).toString('hex'))
        
        // Return a minimal success response instead of hanging
        return {
          status: 'pending',
          transactionHash: Buffer.from(transactionHash).toString('hex'),
          message: 'Transaction submitted but receipt timed out'
        }
      }
      throw error
    }
  }
}