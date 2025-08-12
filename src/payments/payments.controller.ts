import { Body, Controller, Post } from '@nestjs/common';
import { PublicKey, Connection, ParsedInstruction } from '@solana/web3.js';

@Controller('payments')
export class PaymentsController {
  private connection: Connection;
  private treasury: PublicKey;

  constructor() {
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.treasury = new PublicKey(process.env.SOL_TREASURY_PUBKEY || '11111111111111111111111111111111');
  }

  @Post('bet-intent')
  async betIntent(@Body() body: { marketId: string; amountLamports: number; memo?: string }) {
    const { marketId, amountLamports } = body;
    if (!marketId || !amountLamports) {
      throw new Error('marketId and amountLamports required');
    }
    const memo = body.memo || JSON.stringify({ t: 'bet', m: marketId, ts: Date.now() });
    return {
      network: 'solana',
      token: 'SOL',
      treasury: this.treasury.toBase58(),
      amountLamports,
      memo,
    };
  }

  @Post('bet-confirm')
  async betConfirm(@Body() body: { signature: string; marketId: string; amountLamports: number; memo?: string }) {
    const { signature, marketId, amountLamports, memo } = body;
    if (!signature || !marketId || !amountLamports) throw new Error('missing fields');

    const tx = await this.connection.getParsedTransaction(signature, { maxSupportedTransactionVersion: 0, commitment: 'confirmed' });
    if (!tx) throw new Error('transaction not found');

    const pre = tx.meta?.preBalances || [];
    const post = tx.meta?.postBalances || [];
    const keys = (tx.transaction.message as any).accountKeys as any[];
    let treasuryIndex = -1;
    for (let i = 0; i < keys.length; i++) {
      try {
        const pk = typeof keys[i] === 'string' ? new PublicKey(keys[i]) : new PublicKey(keys[i].pubkey || keys[i]);
        if (pk.equals(this.treasury)) { treasuryIndex = i; break; }
      } catch {}
    }
    if (treasuryIndex < 0) throw new Error('treasury not in tx accounts');

    const delta = (post[treasuryIndex] ?? 0) - (pre[treasuryIndex] ?? 0);
    if (delta < amountLamports * 0.98) throw new Error('insufficient amount received');

    // Optional: confirm memo instruction present
    const hasMemo = (tx.transaction.message.instructions as ParsedInstruction[] | any[]).some((ix: any) => {
      try {
        const pid = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
        return (ix.programId?.toBase58?.() === pid) || (ix.program === 'spl-memo');
      } catch { return false; }
    });
    if (!hasMemo && memo) {
      // allow missing memo if not enforced, otherwise you can parse inner instructions
    }

    // At this point payment is verified; you can now record the bet in your markets service
    // For now return ok:true; frontend will then call the existing placeBet API to update odds
    return { ok: true };
  }
}


