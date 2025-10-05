import { describe, expect, it } from 'bun:test'
import { get__account, type AccountResult, type ClientConfig } from './accounts'

import * as alpacaAccounts from '../../../testAccountsConfigs/alpacaAccounts.json'

describe('get__account', () => {
    const accountExpected: AccountResult = {
        brokerAccountId: "brokerAccountId",
        unified: {
            id: "c448514f-1d20-4a6c-b101-1c9ea22d80ac",
            account_number: "PA3R86ESIBPH",
            account_name: "PA3R86ESIBPH",
            status: "ACTIVE",
            currency: "USD",
            created_at: "2025-06-23T01:59:56.130102Z",
            platform: "alpaca",
            framework: "alpaca",
            cash: 15303.3,
            total_value: 110844.88,
            buying_power: 126148.18,
            total_invested: 95541.58,
            short_market_value: 0,
            long_market_value: 95541.58,
            withdrawable_cash: 15303.3,
            short_value: 0,
            long_value: 95541.58,
            margin_used: "UNKNOWN-ROY",
            margin_cost: "UNKNOWN-ROY",
        },


    };
    it('get__account alpaca__PA3R86ESIBPH alpaca', async () => {
        const res = await get__account({
            clientConfig: {
                ...alpacaAccounts['alpaca__PA3R86ESIBPH']
            }
        })

        // console.log(res);


        expect(res.brokerAccountId).toBe(alpacaAccounts['alpaca__PA3R86ESIBPH']?.brokerAccountId)
        expect(res.unified.status).toBeString()
        Object.keys(accountExpected?.unified || {}).forEach((key) => {

            expect(res.unified).toHaveProperty(key)
        })
    })
    it('get__account FOREX.comCA__22901827 alpaca', async () => {
        const res = await get__account({
            clientConfig: {
                ...alpacaAccounts['FOREX.comCA__22901827']
            }
        })

        // console.log(res);


        // expect(res.brokerAccountId).toBe(alpacaAccounts['FOREX.comCA__22901827']?.brokerAccountId)
        // expect(res.status).toBeString()
        // Object.keys(accountExpected).forEach((key) => {

        //     expect(res).toHaveProperty(key)
        // })
    })
})