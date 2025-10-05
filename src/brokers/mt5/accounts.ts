import { mt5ApiCall } from "./mt5ApiUtils";

export const mt5_get__account: any = async ({ clientConfig }) => {


    const result = await mt5ApiCall({
        clientConfig,
        endPoint: 'mt5',
        method: 'post',
        body: {
            "method": "account_info",
            "params": []
        }
    })


    return {

        ...result,
        referenceDoc: "https://www.mql5.com/en/docs/python_metatrader5/mt5accountinfo_py"
    }

}