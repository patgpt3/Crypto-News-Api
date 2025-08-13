import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PublicKey, Connection, ParsedInstruction } from '@solana/web3.js';

@Controller('payments')
export class PaymentsController {
  private connection: Connection;
  private treasury: PublicKey;
  private priceCache: { usd: number; fetchedAt: number } = { usd: 0, fetchedAt: 0 };

  constructor() {
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.treasury = new PublicKey(process.env.SOL_TREASURY_PUBKEY || '11111111111111111111111111111111');
  }

  private async fetchSolUsd(): Promise<number> {
    const now = Date.now();
    if (this.priceCache.usd > 0 && now - this.priceCache.fetchedAt < 30_000) {
      return this.priceCache.usd;
    }
    const url = process.env.SOL_PRICE_API || 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd';
    const res = await fetch(url);
    if (!res.ok) throw new Error(`price fetch failed: ${res.status}`);
    const data = await res.json() as any;
    const usd = Number(data?.solana?.usd || 0);
    if (!usd) throw new Error('invalid price');
    this.priceCache = { usd, fetchedAt: now };
    return usd;
  }

  @Get('quote')
  async quote(@Query('usd') usdStr?: string) {
    const usd = Number(usdStr || '0');
    if (!(usd > 0)) throw new Error('usd must be > 0');
    const price = await this.fetchSolUsd();
    const lamports = Math.floor((usd / price) * 1e9);
    return { usd, priceUsdPerSol: price, lamports };
  }

  @Post('bet-intent')
  async betIntent(@Body() body: { marketId: string; amountLamports?: number; usdAmount?: number; memo?: string }) {
    const { marketId } = body;
    let { amountLamports } = body;
    if (!marketId) throw new Error('marketId required');
    if (!amountLamports) {
      const usd = Number(body.usdAmount || 0);
      if (usd > 0) {
        const price = await this.fetchSolUsd();
        amountLamports = Math.floor((usd / price) * 1e9);
      }
    }
    if (!amountLamports || amountLamports <= 0) throw new Error('amountLamports must be > 0');
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


