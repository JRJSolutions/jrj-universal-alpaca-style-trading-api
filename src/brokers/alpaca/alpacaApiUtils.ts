export interface AlpacaApiResponse<T = any> {
    ok: boolean;                     // whether request succeeded
    status: number;                  // HTTP status
    data?: T;                        // parsed JSON response (if valid)
    raw?: string;                    // raw text (if JSON failed)
    error?: string;                  // human-readable error message
}

export const alpacaApiCall = async <T = any>({
    clientConfig,
    endPoint,
    method = 'get',
    body = {},
}: {
    clientConfig: {
        brokerEndpoint: string;
        brokerKeyId: string;
        brokerKeyPass: string;
    };
    endPoint: string;
    method?: string;
    body?: Record<string, any>;
}): Promise<AlpacaApiResponse<T>> => {
    const baseUrl = clientConfig?.brokerEndpoint;
    const url = `${baseUrl}/${endPoint}`;

    const options: RequestInit = {
        method,
        headers: {
            accept: 'application/json',
            'APCA-API-KEY-ID': clientConfig?.brokerKeyId,
            'APCA-API-SECRET-KEY': clientConfig?.brokerKeyPass,
        },
        ...(method.toLowerCase() !== 'get' && body
            ? { body: JSON.stringify(body) }
            : {}),
    };

    try {
        const response = await fetch(url, options);

        const text = await response.text();
        let data: T | undefined = undefined;

        try {
            data = JSON.parse(text);
        } catch {
            // Leave data undefined; maybe raw text only
        }

        if (!response.ok) {
            return {
                ok: false,
                status: response.status,
                data,
                // raw: text,
                error:
                    (data as any)?.message ||
                    `HTTP ${response.status}: ${response.statusText}`,
            };
        }

        return {
            ok: true,
            status: response.status,
            data,
            // raw: text,
        };
    } catch (error: any) {
        return {
            ok: false,
            status: -1,
            error: `Network or fetch error: ${error?.message || String(error)}`,
        };
    }
};
