import { PrismaClient } from '@prisma/client'
import { Database } from '.'
import { Comment } from '../domain/Comment'
import { Hero } from '../domain/Hero'

export default class DatabasePrisma implements Database {
  private client = new PrismaClient()

  // TODO: Paginate
  async heroComments(heroId: string): Promise<Comment[]> {
    const comments = await this.client.heroComment.findMany({
      where: {
        heroId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return comments.map((comment) => ({
      uuid: comment.uuid,
      author: comment.authorUsername,
      comment: comment.comment,
      createdAt: comment.createdAt.toISOString(),
    }))
  }

  async heroPuntuationByUsername(username: string, heroId: Hero['id']): Promise<number | null> {
    const puntuation = await this.client.heroPuntuation.findFirst({
      where: {
        authorUsername: username,
        heroId,
      },
    })

    return puntuation?.puntuation ?? null
  }

  async heroLikeByUsername(username: string, heroId: string): Promise<boolean> {
    const like = await this.client.heroLike.findFirst({
      where: {
        heroId,
        authorUsername: username,
      },
    })

    return !!like
  }

  async saveHeroLikeStatus(authorUsername: string, heroId: string, status: boolean) {
    const currentLike = await this.client.heroLike.findFirst({
      where: {
        heroId,
        authorUsername,
      },
    })

    switch (true) {
      // Already liked or disliked
      case status && currentLike !== null:
      case !status && !currentLike:
        return
      // Like
      case status && !currentLike:
        await this.client.heroLike.create({
          data: {
            heroId,
            authorUsername,
          },
        })
        break
      // Dislike
      case !status && currentLike !== null:
        await this.client.heroLike.delete({
          where: {
            id: currentLike.id,
          },
        })
        break
    }
  }

  async setHeroPuntuation(authorUsername: string, heroId: string, puntuation: number) {
    const currentPuntuation = await this.client.heroPuntuation.findFirst({
      where: {
        heroId,
        authorUsername,
      },
    })

    // If not set, create it
    if (!currentPuntuation) {
      await this.client.heroPuntuation.create({
        data: {
          heroId,
          authorUsername,
          puntuation,
        },
      })

      return
    }

    // If already set, update it
    await this.client.heroPuntuation.update({
      where: {
        id: currentPuntuation.id,
      },
      data: {
        puntuation,
      },
    })
  }

  async addHeroComment(authorId: string, heroId: string, uuid: string, comment: string) {
    await this.client.heroComment.create({
      data: {
        heroId,
        uuid,
        authorUsername: authorId,
        comment,
      },
    })
  }
}
