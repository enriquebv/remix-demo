import { MarvelAPI, PaginatedResponse } from '..'
import { Hero } from '../../domain/Hero'
import crypto from 'crypto'
import type { CharactersListResponse, CharacterDetailResponse } from './types'
import { characterToDetailedHero, characterToHero } from './mappers'
import { DetailedHero } from '../../domain/DetailedHero'
import { HeroNotFound } from '../exceptions'

class ApiError extends Error {
  constructor(readonly response: Response) {
    super('Something went wrong fetching data from Marvel API')
  }
}

export default class MarvelAPIRest implements MarvelAPI {
  constructor(private publicKey: string, private privateKey: string) {}

  private async fetchApi<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    // More info: https://developer.marvel.com/documentation/authorization
    const timestamp = Date.now().toString()

    const hash = crypto
      .createHash('md5')
      .update(timestamp + this.privateKey + this.publicKey)
      .digest('hex')

    const queryParams = new URLSearchParams({
      ts: timestamp,
      apikey: this.publicKey,
      hash,
    })

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value.toString())
      })
    }

    const response = await fetch(`https://gateway.marvel.com:443/v1/public/${endpoint}?${queryParams.toString()}`, {
      method: 'GET',
    })

    if (!response.ok) {
      const isJsonResponse = response.headers.get('Content-Type')?.includes('application/json')

      console.error(`https://gateway.marvel.com:443/v1/public/${endpoint}?${queryParams.toString()}`)

      if (isJsonResponse) {
        const json = await response.json()
        console.error(json)
      }

      throw new ApiError(response)
    }

    const json = await response.json()

    return json
  }

  async heroes(itemsPerPage: number, page: number): Promise<PaginatedResponse<Hero>> {
    const response = await this.fetchApi<CharactersListResponse>('characters', {
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
    })

    const lastPage = Math.ceil(response.data.total / itemsPerPage)

    return {
      data: response.data.results.map(characterToHero),
      total: response.data.total,
      isFirstPage: page === 1,
      isLastPage: page === lastPage,
      page,
      totalPages: lastPage,
    }
  }

  async hero(id: Hero['id']): Promise<DetailedHero> {
    const response = await this.fetchApi<CharacterDetailResponse>(`characters/${id}`)

    if (!response.data.results.length) {
      throw new HeroNotFound(id)
    }

    return characterToDetailedHero(response.data.results[0])
  }
}
