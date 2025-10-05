import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'
import * as z from 'zod'

const app = new Elysia()
    .use(
        openapi({
            references: fromTypes()
        })
    )
    .get('/', ({ body, status }) => {
        // debugger
        return { test: 'hello' as const }
    })
    .post('/json', ({ body, status }) => body, {
        body: t.Object({
            hello: t.String()
        }),
        mapJsonSchema: {
            zod: z.toJSONSchema
        }
    })
    .listen(3599)

console.log(
    `🦊 jrj-universal-alpaca-style-trading-api is running at ${app.server?.hostname}:${app.server?.port}`
)