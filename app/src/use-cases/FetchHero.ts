import { Hero } from '../domain/Hero'
import { User } from '../domain/User'
import { Database, MarvelAPI } from '../infrastructure'

export default class FetchHero {
  constructor(private marvelApi: MarvelAPI, private database: Database) {}

  async execute(heroId: Hero['id'], currentUsername: User['name']) {
    const hero = await this.marvelApi.hero(heroId)

    // Why is not parallelized hero petition?
    // Because that previous call validates if hero exists
    const [comments, puntuation, liked] = await Promise.all([
      this.database.heroComments(heroId),
      this.database.heroPuntuationByUsername(currentUsername, heroId),
      this.database.heroLikeByUsername(currentUsername, heroId),
    ])

    return {
      hero,
      liked,
      comments,
      puntuation,
    }
  }
}
