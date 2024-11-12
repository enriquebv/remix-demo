import { Hero } from '../domain/Hero'
import { User } from '../domain/User'
import { Database, MarvelAPI } from '../infrastructure'

export default class UserAddHeroComment {
  constructor(private marvel: MarvelAPI, private database: Database) {}

  async execute(heroId: Hero['id'], authorUsername: User['name'], uuid: string, comment: string) {
    // If hero doesn't exist, will throw an error
    await this.marvel.hero(heroId)

    if (comment.length < 3) {
      throw new Error('Comment must be greater than 3 characters')
    }

    if (comment.length > 140) {
      throw new Error('Comment must be less than 140 characters')
    }

    return await this.database.addHeroComment(authorUsername, heroId, uuid, comment)
  }
}
