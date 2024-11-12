import { PrismaClient } from '@prisma/client'
import { Database } from '.'
import { Comment } from '../domain/Comment'

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

  async puntuationByUsername(username: string): Promise<number | null> {
    const puntuation = await this.client.heroPuntuation.findFirst({
      where: {
        authorUsername: username,
      },
    })

    return puntuation?.puntuation ?? null
  }

  async likeStatusByUsername(username: string, heroId: string): Promise<boolean> {
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

    // Already liked
    if (status && currentLike) {
      return
    }

    // Already disliked
    if (!status && !currentLike) {
      return
    }

    // Like
    if (status && !currentLike) {
      await this.client.heroLike.create({
        data: {
          heroId,
          authorUsername,
        },
      })
    }

    // Remove like record
    if (!status && currentLike) {
      // Probably destroying data is not a good idea
      // but for now it's fine.
      await this.client.heroLike.delete({
        where: {
          id: currentLike.id,
        },
      })
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
