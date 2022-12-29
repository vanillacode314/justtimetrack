import { APIEvent } from 'solid-start/api'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from 'api'

export const GET = ({ request }: APIEvent) =>
  fetchRequestHandler({
    endpoint: '/trpc',
    router: appRouter,
    req: request,
  })
