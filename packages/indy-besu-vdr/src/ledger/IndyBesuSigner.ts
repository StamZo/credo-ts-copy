import { BytesLike, computeAddress, concat, getBytes, Signature, SigningKey } from 'ethers'
import { Transaction } from 'indy2-vdr'

export class IndyBesuSigner {
  public readonly address: string
  private readonly signingKey: SigningKey

  constructor(secretKey: Uint8Array) {
    this.signingKey = new SigningKey(secretKey)
    this.address = computeAddress(this.signingKey.compressedPublicKey)
  }

  public signTransaction(transaction: Transaction) {
    const bytesToSign = transaction.getSigningBytes()
    const signature = this.signingKey.sign(bytesToSign)
    transaction.setSignature({
      recovery_id: signature.yParity,
      signature: getBytes(concat([signature.r, signature.s])),
    })
  }
}
