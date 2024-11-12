import { Comment } from '../domain/Comment'
import { DetailedHero } from '../domain/DetailedHero'
import { Hero } from '../domain/Hero'
import { User } from '../domain/User'

export interface Database {
  heroComments(heroId: Hero['id']): Promise<Comment[]>
  puntuationByUsername(username: User['name']): Promise<number | null>
  likeStatusByUsername(username: User['name'], heroId: Hero['id']): Promise<boolean>
  saveHeroLikeStatus(authorId: User['id'], heroId: string, status: boolean): Promise<void>
  addHeroComment(authorId: User['id'], heroId: string, uuid: string, comment: string): Promise<void>
  setHeroPuntuation(authorUsername: User['name'], heroId: Hero['id'], puntuation: number): Promise<void>
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  total: number
  isFirstPage: boolean
  isLastPage: boolean
  totalPages: number
}

export interface MarvelAPI {
  heroes(itemsPerPage: number, page: number): Promise<PaginatedResponse<Hero>>
  hero(id: Hero['id']): Promise<DetailedHero>
}
