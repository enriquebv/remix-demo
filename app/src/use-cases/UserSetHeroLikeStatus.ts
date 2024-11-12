import { Hero } from '../domain/Hero'
import { User } from '../domain/User'
import { Database, MarvelAPI } from '../infrastructure'

export default class UserSetHeroLikeStatus {
  constructor(private marvel: MarvelAPI, private database: Database) {}

  async execute(heroId: Hero['id'], authorUsername: User['name'], status: boolean) {
    // If hero doesn't exist, will throw an error
    await this.marvel.hero(heroId)

    return await this.database.saveHeroLikeStatus(authorUsername, heroId, status)
  }
}
