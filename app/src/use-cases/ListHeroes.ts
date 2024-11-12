import { MarvelAPI } from '../infrastructure'

export default class ListHeroes {
  constructor(private marvelApi: MarvelAPI) {}

  async execute(itemsPerPage: number, page: number) {
    return await this.marvelApi.heroes(itemsPerPage, page)
  }
}
