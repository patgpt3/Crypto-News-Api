"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const web3_js_1 = require("@solana/web3.js");
let PaymentsController = class PaymentsController {
    constructor() {
        const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
        this.connection = new web3_js_1.Connection(rpcUrl, 'confirmed');
        this.treasury = new web3_js_1.PublicKey(process.env.SOL_TREASURY_PUBKEY || '11111111111111111111111111111111');
    }
    async betIntent(body) {
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
    async betConfirm(body) {
        const { signature, marketId, amountLamports, memo } = body;
        if (!signature || !marketId || !amountLamports)
            throw new Error('missing fields');
        const tx = await this.connection.getParsedTransaction(signature, { maxSupportedTransactionVersion: 0, commitment: 'confirmed' });
        if (!tx)
            throw new Error('transaction not found');
        const pre = tx.meta?.preBalances || [];
        const post = tx.meta?.postBalances || [];
        const accountKeys = tx.transaction.message.accountKeys || [];
        const treasuryIndex = accountKeys.findIndex((k) => {
            try {
                return (typeof k === 'string' ? new web3_js_1.PublicKey(k) : k).equals(this.treasury);
            }
            catch {
                return false;
            }
        });
        if (treasuryIndex < 0)
            throw new Error('treasury not in tx');
        const delta = (post[treasuryIndex] || 0) - (pre[treasuryIndex] || 0);
        if (delta < amountLamports * 0.98)
            throw new Error('insufficient amount received');
        const hasMemo = tx.transaction.message.instructions.some((ix) => {
            try {
                const pid = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
                return (ix.programId?.toBase58?.() === pid) || (ix.program === 'spl-memo');
            }
            catch {
                return false;
            }
        });
        if (!hasMemo && memo) {
        }
        return { ok: true };
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('bet-intent'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "betIntent", null);
__decorate([
    (0, common_1.Post)('bet-confirm'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "betConfirm", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map