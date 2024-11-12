import { Hero } from '../domain/Hero'
import { User } from '../domain/User'
import { Database, MarvelAPI } from '../infrastructure'

export default class UserSetHeroPuntuation {
  constructor(private marvel: MarvelAPI, private database: Database) {}

  async execute(heroId: Hero['id'], authorUsername: User['name'], puntuation: number) {
    // If hero doesn't exist, will throw an error
    await this.marvel.hero(heroId)

    if (puntuation < 0 || puntuation > 10) {
      throw new Error('Puntuation must be between 0 and 10')
    }

    return await this.database.setHeroPuntuation(authorUsername, heroId, puntuation)
  }
}
