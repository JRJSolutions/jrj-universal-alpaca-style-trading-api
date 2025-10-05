import { describe, expect, it } from 'bun:test'
import { get__account } from './accounts'

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
    };
    it('get__account 1 alpaca', async () => {
        const res = await get__account({
            clientConfig: {
                ...alpacaAccounts['a1']
            }
        })


        expect(res.brokerAccountId).toBe(alpacaAccounts['a1']?.brokerAccountId)
        expect(res.status).toBeString()
        Object.keys(accountExpected).forEach((key) => {

            expect(res).toHaveProperty(key)
        })
    })
})