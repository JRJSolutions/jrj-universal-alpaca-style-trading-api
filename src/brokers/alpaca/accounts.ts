import { alpacaApiCall } from "./alpacaApiUtils";

export const alpaca_get__account: any = async ({ clientConfig }) => {


    const result = await alpacaApiCall({
        clientConfig,
        endPoint: 'v2/account',
        method: 'get',
    })

    if (result?.ok) {
        return {
            ...result,
            data: {
                ...result?.data,
                referenceDoc: "https://docs.alpaca.markets/reference/getaccount-1"
            }
        }
    }

    return result

}