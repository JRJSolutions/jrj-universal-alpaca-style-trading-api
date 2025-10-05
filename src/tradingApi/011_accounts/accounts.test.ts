import { describe, expect, it } from 'bun:test'
import { get__account, type ClientConfig } from './accounts'

import * as alpacaAccounts from '../../../testAccountsConfigs/alpacaAccounts.json'

describe('get__account', () => {
    const accountExpected = {
        brokerAccountId: "brokerAccountId",
        id: "id",
        account_number: "brokerAccountId",
        status: "status",
        currency: "currency",
        created_at: "created_at",
        platform: "platform",
        platformSpecificResult: {},


        // cash = float(a.cash)
        // total_value = float(a.equity)
        // buying_power = float(a.buying_power)
        // total_invested = float(a.long_market_value) + abs(float(a.short_market_value))
        // short_market_value = abs(float(a.short_market_value))
        // long_market_value = abs(float(a.long_market_value))
        // withdrawable_cash = cash - 1.5 * short_market_value
        // withdrawable_cash = 0 if withdrawable_cash<0 else withdrawable_cash

        // Total Value, alpaca -> equity
        // Invested Fund, 
        // Short Value,
        // Long Value,
        // Cash,
        // Withdrawable Cash, 
        // Buying Power, 
        // Margin Used,
        // Margin Cost
    };
    it('get__account alpaca__PA3R86ESIBPH alpaca', async () => {
        const res = await get__account({
            clientConfig: {
                ...alpacaAccounts['alpaca__PA3R86ESIBPH']
            }
        })

        console.log(res);


        expect(res.brokerAccountId).toBe(alpacaAccounts['alpaca__PA3R86ESIBPH']?.brokerAccountId)
        expect(res.status).toBeString()
        Object.keys(accountExpected).forEach((key) => {

            expect(res).toHaveProperty(key)
        })
    })
    it('get__account FOREX.comCA__22901827 alpaca', async () => {
        const res = await get__account({
            clientConfig: {
                ...alpacaAccounts['FOREX.comCA__22901827']
            }
        })

        console.log(res);


        expect(res.brokerAccountId).toBe(alpacaAccounts['FOREX.comCA__22901827']?.brokerAccountId)
        // expect(res.status).toBeString()
        // Object.keys(accountExpected).forEach((key) => {

        //     expect(res).toHaveProperty(key)
        // })
    })
})