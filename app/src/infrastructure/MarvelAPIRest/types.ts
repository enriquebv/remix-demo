export interface CharactersListResponse {
  data: {
    total: number
    count: number
    results: {
      id: number
      name: string
      thumbnail: {
        path: string
        extension: string
      }
    }[]
  }
}

export interface CharacterDetailResponse {
  data: {
    results: {
      id: number
      name: string
      description: string
      thumbnail: {
        path: string
        extension: string
      }
      comics: {
        items: {
          name: string
        }[]
      }
    }[]
  }
}
