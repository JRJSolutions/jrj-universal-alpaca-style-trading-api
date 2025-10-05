// ---- Platforms & frameworks
export type Platform = 'alpaca' | 'FOREX.comCA';
export type Framework = 'alpaca' | 'mt5';

export interface ClientConfig {
    platform: Platform;
    framework: Framework;
    brokerAccountId?: string;
}

// ---- Shared / top-level result shape
export type AccountStatus = 'ACTIVE' | 'UNKNOWN' | string;

export interface BaseAccountResult {
    brokerAccountId?: string;
    backEndRes?: any,
    execution?: any
}

// ---- Alpaca specific
export interface AlpacaAccount {
    id: string;
    admin_configurations: Record<string, unknown>;
    user_configurations: unknown | null;
    account_number: string;
    status: 'ACTIVE' | string;
    crypto_status?: string;
    options_approved_level?: number;
    options_trading_level?: number;
    currency: string;
    buying_power: string;
    regt_buying_power: string;
    daytrading_buying_power: string;
    effective_buying_power: string;
    non_marginable_buying_power: string;
    options_buying_power?: string;
    bod_dtbp: string;
    cash: string;
    accrued_fees: string;
    portfolio_value: string;
    pattern_day_trader: boolean;
    trading_blocked: boolean;
    transfers_blocked: boolean;
    account_blocked: boolean;
    created_at: string; // ISO
    trade_suspended_by_user: boolean;
    multiplier: string;
    shorting_enabled: boolean;
    equity: string;
    last_equity?: string;
    long_market_value: string;
    short_market_value: string;
    position_market_value: string;
    initial_margin: string;
    maintenance_margin: string;
    last_maintenance_margin?: string;
    sma?: string;
    daytrade_count?: number;
    balance_asof?: string; // e.g. "2025-10-03"
    crypto_tier?: number;
    intraday_adjustments?: string;
    pending_reg_taf_fees?: string;
    referenceDoc?: string; // URL
    // Allow forward-compat keys:
    [k: string]: unknown;
}

export interface AlpacaAccountResult extends BaseAccountResult {
    platform?: 'alpaca';
    framework?: 'alpaca';
    platformSpecificResult?: AlpacaAccount | null;
    unified?: UnifiedAccountAlpaca;
    backEndRes?: UnifiedAccountAlpaca;
}

// ---- MT5 (FOREX.comCA) specific
export interface Mt5Account {
    login: number;
    trade_mode: number;
    leverage: number;
    limit_orders: number;
    margin_so_mode: number;
    trade_allowed: boolean;
    trade_expert: boolean;
    margin_mode: number;
    currency_digits: number;
    fifo_close: boolean;
    balance: number;
    credit: number;
    profit: number;
    equity: number;
    margin: number;
    margin_free: number;
    margin_level: number;
    margin_so_call: number;
    margin_so_so: number;
    margin_initial: number;
    margin_maintenance: number;
    assets: number;
    liabilities: number;
    commission_blocked: number;
    name: string;
    server: string;
    currency: string; // e.g., "CAD"
    company: string;
    referenceDoc?: string; // URL
    created_at?: string; // if you ever set/pipe one through
    [k: string]: unknown;
}

export interface Mt5AccountResult extends BaseAccountResult {
    platform: 'FOREX.comCA';
    framework: 'mt5';
    unified?: any;
    platformSpecificResult: Mt5Account | null;
}

// ---- Unified result type
export type AccountResult = AlpacaAccountResult | Mt5AccountResult;

// ---- Type guards (optional, handy)
export const isAlpacaResult = (r: AccountResult): r is AlpacaAccountResult =>
    r.platform === 'alpaca';

export const isMt5Result = (r: AccountResult): r is Mt5AccountResult =>
    r.platform === 'FOREX.comCA';

import { alpaca_get_account_unifier, type UnifiedAccountAlpaca } from '../../../unifiers/alpaca_get_account_unifier';
// ---- Function signature with types
import { alpaca_get__account } from '../../brokers/alpaca/accounts';
import { mt5_get__account } from '../../brokers/mt5/accounts';
import { diffMsTs } from '../../helpers/diffMsTs';


export async function get__account(
    { clientConfig }: { clientConfig: ClientConfig }
): Promise<AccountResult> {
    // common fields you want to reuse; NOT typed as AccountResult


    if (clientConfig.platform === 'alpaca') {
        const start = new Date()
        const res = await alpaca_get__account({ clientConfig });
        const alpacaRes: AlpacaAccount = res?.data;
        delete res.data

        const unified = alpaca_get_account_unifier(alpacaRes)


        const finish = new Date()

        const r: AlpacaAccountResult = {
            brokerAccountId: clientConfig?.brokerAccountId,
            unified: unified,
            // ...unified,
            platformSpecificResult: alpacaRes,
            backEndRes: res,
            execution: {
                start: start.toISOString(),
                finish: finish.toISOString(),
                duration: diffMsTs(start, finish)
            },
            platform: 'alpaca',
            framework: 'alpaca'
        };
        return r;
    }

    if (clientConfig.platform === 'FOREX.comCA') {
        const forex: Mt5Account = await mt5_get__account({ clientConfig });

        console.log(JSON.stringify(forex));

        // const r: Mt5AccountResult = {
        //     ...base,
        //     id: `${clientConfig.platform}__${forex.login}`,
        //     account_number: String(forex.login),
        //     account_name: forex.name,
        //     status: forex.trade_allowed ? 'ACTIVE' : 'UNKNOWN',
        //     currency: forex.currency,
        //     created_at: forex.created_at,    // may be undefined per your data
        //     platform: 'FOREX.comCA',         // <- discriminant satisfied
        //     framework: 'mt5',
        //     platformSpecificResult: forex,
        // };
        // return r;
    }

    // If you might add more platforms later, fail fast for unknown ones:
    throw new Error(`Unsupported platform: ${String(clientConfig.platform)}`);
}
