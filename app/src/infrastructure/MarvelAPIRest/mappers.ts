import { DetailedHero } from '../../domain/DetailedHero'
import { Hero } from '../../domain/Hero'
import { CharacterDetailResponse, CharactersListResponse } from './types'

export function characterToHero(character: CharactersListResponse['data']['results'][number]): Hero {
  return {
    id: character.id.toString(),
    name: character.name,
    image: [character.thumbnail.path, character.thumbnail.extension].join('.'),
  }
}

export function characterToDetailedHero(character: CharacterDetailResponse['results'][number]): DetailedHero {
  return new DetailedHero(
    character.id.toString(),
    character.name,
    character.description,
    [character.thumbnail.path, character.thumbnail.extension].join('.'),
    character.comics.items.map((comic) => comic.name)
  )
}
