import { alpaca_get__account } from "../../brokers/alpaca/accounts"

export const get__account = async ({ clientConfig }) => {
    const platform = clientConfig?.platform

    const result: any = {
        brokerAccountId: clientConfig?.brokerAccountId,
        id: null,
        account_number: null,
        status: null,
        currency: null,
        created_at: null,
        platform: null,
        platformSpecificResult: null,
    }

    if (platform == 'alpaca') {
        const alpacaRes: any = await alpaca_get__account({ clientConfig })
        result['id'] = alpacaRes.id
        result['account_number'] = alpacaRes.account_number
        result['status'] = alpacaRes.status
        result['currency'] = alpacaRes.currency
        result['created_at'] = alpacaRes.created_at
        result['platform'] = 'alpaca'
        result['platformSpecificResult'] = alpacaRes
    }

    return result
}