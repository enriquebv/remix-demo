import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'
import authenticate, { UnauthenticatedError } from '../context.server'

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const ctx = await authenticate(request)
    const page = Math.max(Number(new URL(request.url).searchParams.get('page')), 1)

    if (Number.isNaN(page)) {
      throw new Error('Page must be a number')
    }

    const heroes = await ctx.listHeroes(8, page)

    return json(heroes)
  } catch (error) {
    // Probably this need to be moved to a global error handler
    if (error instanceof UnauthenticatedError) {
      return json({ error: 'Unauthenticated' }, { status: 401 })
    }

    throw error
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const { action } = await request.json()

  console.log('action is', action)

  throw new Response(null, {
    status: 204,
  })
}
