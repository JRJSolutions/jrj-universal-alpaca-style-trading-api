import { alpacaApiCall } from "./alpacaApiUtils";

export const alpaca_get__account = async ({ clientConfig }) => {


    const result = await alpacaApiCall({
        clientConfig,
        endPoint: 'v2/account',
        method: 'get',
    })


    return {

        ...result,
        referenceDoc: "https://docs.alpaca.markets/reference/getaccount-1"
    }

}