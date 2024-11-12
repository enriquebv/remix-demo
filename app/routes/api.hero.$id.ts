import { ActionFunctionArgs } from '@remix-run/node'
import authenticate, { UnauthenticatedError } from '../context.server'
import { HeroNotFound } from '../src/infrastructure/exceptions'

export const Action = {
  Like: 'like',
  Comment: 'comment',
  Puntuation: 'puntuation',
} as const

export type Action = (typeof Action)[keyof typeof Action]

export async function action({ request, params }: ActionFunctionArgs) {
  const { userSetHeroLikeStatus, userSetHeroPuntuation, userAddHeroComment, session } = await authenticate(request)
  const { action, payload } = await request.json()

  // Only PUT is allowed
  if (request.method !== 'PUT') {
    throw new Response(null, {
      status: 405,
    })
  }

  // Hero ID is required
  if (!params.id) {
    throw new Response(
      JSON.stringify({
        error: 'Missing hero id',
      }),
      {
        status: 400,
      }
    )
  }

  try {
    switch (action) {
      case Action.Like:
        await userSetHeroLikeStatus(params.id, session.username, payload.status)
        break
      case Action.Puntuation:
        await userSetHeroPuntuation(params.id, session.username, payload.puntuation)
        break
      case Action.Comment:
        await userAddHeroComment(params.id, session.username, payload.uuid, payload.comment)
        break
      default:
        throw new Error('Invalid action')
    }
    throw new Response(null, {
      status: 204,
    })
  } catch (error) {
    // Probably this need to be moved to a global error handler
    if (error instanceof UnauthenticatedError) {
      throw new Response(null, {
        status: 401,
      })
    }

    if (error instanceof HeroNotFound) {
      throw new Response(null, {
        status: 404,
      })
    }

    throw error
  }
}
