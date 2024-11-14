import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { sessionCookie } from './cookies.server'
import { Database, MarvelAPI } from './src/infrastructure'
import MarvelAPIRest from './src/infrastructure/MarvelAPIRest'
import ListHeroes from './src/use-cases/ListHeroes'
import FetchHero from './src/use-cases/FetchHero'
import DatabasePrisma from './src/infrastructure/Database'
import UserSetHeroLikeStatus from './src/use-cases/UserSetHeroLikeStatus'
import UserSetHeroPuntuation from './src/use-cases/UserSetPuntuation'
import UserAddHeroComment from './src/use-cases/UserAddHeroComment'
import FetchHeroStats from './src/use-cases/FetchHeroStats'

export class UnauthenticatedError extends Error {
  constructor() {
    super('Unauthenticated')
  }
}

export default async function authenticate(request: Request) {
  const cookieHeader = request.headers.get('Cookie')
  const username = await sessionCookie.parse(cookieHeader)

  if (!username) {
    throw new UnauthenticatedError()
  }

  // Top-level dependencies
  const marvelApi: MarvelAPI = new MarvelAPIRest(process.env.MARVEL_API_PUBLIC_KEY!, process.env.MARVEL_API_SECRET_KEY!)
  const database: Database = new DatabasePrisma()

  // Use cases
  const listHeroesUseCase = new ListHeroes(marvelApi)
  const fetchHeroUseCase = new FetchHero(marvelApi, database)
  const userSetHeroLikeStatusUseCase = new UserSetHeroLikeStatus(marvelApi, database)
  const userSetHeroPuntuationUseCase = new UserSetHeroPuntuation(marvelApi, database)
  const userAddHeroCommentUseCase = new UserAddHeroComment(marvelApi, database)
  const fetchStats = new FetchHeroStats(marvelApi, database)

  return {
    session: { username },
    listHeroes: listHeroesUseCase.execute.bind(listHeroesUseCase),
    fetchHero: fetchHeroUseCase.execute.bind(fetchHeroUseCase),
    userSetHeroLikeStatus: userSetHeroLikeStatusUseCase.execute.bind(userSetHeroLikeStatusUseCase),
    userSetHeroPuntuation: userSetHeroPuntuationUseCase.execute.bind(userSetHeroPuntuationUseCase),
    userAddHeroComment: userAddHeroCommentUseCase.execute.bind(userAddHeroCommentUseCase),
    fetchStats: fetchStats.execute.bind(fetchStats),
  }
}

/**
 * Use this function to protect routes that require authentication
 * @example
 * export const loader = onlyAuthed
 */
export const onlyAuthed = async ({ request }: LoaderFunctionArgs) => {
  try {
    await authenticate(request)
    return Response.json({})
  } catch (error) {
    // Probably this need to be moved to a global error handler
    if (error instanceof UnauthenticatedError) {
      return redirect('/login')
    }

    throw error
  }
}
