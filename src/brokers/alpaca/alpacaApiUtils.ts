export const alpacaApiCall = async ({
    clientConfig,
    endPoint,
    method,
    body = {}
}) => {
    const baseUrl = `https://${clientConfig?.isPaper ? 'paper-' : ''}api.alpaca.markets`;

    const options = {
        //
        method: method,
        headers: {
            accept: 'application/json',
            'APCA-API-KEY-ID': clientConfig?.brokerKeyId,
            'APCA-API-SECRET-KEY': clientConfig?.brokerKeyPass
        },
        ...(method !== 'get' && body ? {
            body: JSON.stringify(body)
        } : {})
    };

    const resultRaw = await fetch(`${baseUrl}/${endPoint}`, options)

    const resultText = await resultRaw.text()

    let resJson = {}

    try {
        resJson = JSON.parse(resultText)
        return resJson
    }
    catch (err) {
        //
    }




    return resultText
}