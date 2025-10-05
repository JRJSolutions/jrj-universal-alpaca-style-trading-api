export const mt5ApiCall = async ({
    clientConfig,
    endPoint,
    method,
    body = {}
}) => {
    const baseUrl = clientConfig?.brokerEndpoint;

    const options = {
        //
        method: method,
        headers: {
            accept: 'application/json',
            'MT-X-API-TOKEN': clientConfig?.brokerKeyPass
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