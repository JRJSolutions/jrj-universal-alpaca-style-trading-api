// ----- Types
export type Platform = 'alpaca';
export type Framework = 'alpaca';
export type AccountStatus = 'ACTIVE' | 'UNKNOWN' | string;

// Minimal Alpaca fields used by your logic
export interface AlpacaMinimal {
  id: string;
  account_number: string;
  status: string;
  currency: string;
  created_at: string;
  cash: string;
  equity: string;
  buying_power: string;
  long_market_value: string;
  short_market_value: string;
}

// Final unified shape your function returns
export interface UnifiedAccountAlpaca {
  id: string;
  account_number: string;
  account_name: string;
  status: AccountStatus;
  currency: string;
  created_at: string;
  platform: Platform;   // 'alpaca'
  framework: Framework; // 'alpaca'

  cash: number;
  total_value: number;
  buying_power: number;
  total_invested: number;
  short_market_value: number;
  long_market_value: number;

  withdrawable_cash: number;
  short_value: number;
  long_value: number;

  // you currently set these to the literal string below
  margin_used: string;  // "UNKNOWN-ROY"
  margin_cost: string;  // "UNKNOWN-ROY"
}

// ----- Your function, logic untouched
export const alpaca_get_account_unifier = (
  platformSpecificResult: AlpacaMinimal
): UnifiedAccountAlpaca => {
  const res: any = {
    id: platformSpecificResult.id,
    account_number: platformSpecificResult.account_number,
    account_name: platformSpecificResult.account_number,
    status: platformSpecificResult.status,
    currency: platformSpecificResult.currency,
    created_at: platformSpecificResult.created_at,
    platform: 'alpaca',              // <- discriminant satisfied
    framework: 'alpaca',
    cash: parseFloat(platformSpecificResult.cash),
    total_value: parseFloat(platformSpecificResult.equity),
    buying_power: parseFloat(platformSpecificResult.buying_power),
    total_invested:
      parseFloat(platformSpecificResult.long_market_value) +
      Math.abs(parseFloat(platformSpecificResult.short_market_value)),
    short_market_value: Math.abs(parseFloat(platformSpecificResult.short_market_value)),
    long_market_value: Math.abs(parseFloat(platformSpecificResult.long_market_value)),
  };

  res['withdrawable_cash'] = res['cash'] - 1.5 * res['short_market_value']
  res['withdrawable_cash'] = res['withdrawable_cash'] < 0 ? 0 : res['withdrawable_cash']

  res['short_value'] = res['short_market_value']
  res['long_value'] = res['long_market_value']

  res['margin_used'] = "UNKNOWN-ROY"
  res['margin_cost'] = "UNKNOWN-ROY"

  return res as UnifiedAccountAlpaca;
};
