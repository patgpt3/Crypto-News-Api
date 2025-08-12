export declare class PaymentsController {
    private connection;
    private treasury;
    constructor();
    betIntent(body: {
        marketId: string;
        amountLamports: number;
        memo?: string;
    }): Promise<{
        network: string;
        token: string;
        treasury: string;
        amountLamports: number;
        memo: string;
    }>;
    betConfirm(body: {
        signature: string;
        marketId: string;
        amountLamports: number;
        memo?: string;
    }): Promise<{
        ok: boolean;
    }>;
}
