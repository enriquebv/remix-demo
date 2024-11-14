import { Hero } from '../domain/Hero'
import { Database, MarvelAPI } from '../infrastructure'

const PODIUM_COUNT = 3

export default class FetchHeroStats {
  constructor(private marvelApi: MarvelAPI, private database: Database) {}

  async execute() {
    const stats = await this.database.heroesStats()
    const leaderBoard: { heroId: Hero['id']; points: number }[] = []

    stats.likes.forEach(({ heroId, count }) => {
      leaderBoard.push({ heroId, points: count })
    })

    stats.commentsCount.forEach(({ heroId, count }) => {
      const foundInLeaderBoard = leaderBoard.find(({ heroId: leaderBoardHeroId }) => leaderBoardHeroId === heroId)

      const points = count * 2

      if (foundInLeaderBoard) {
        foundInLeaderBoard.points += points
        return
      }

      leaderBoard.push({ heroId, points })
    })

    const leaderBoardHeroIds = leaderBoard
      .sort((a, b) => b.points - a.points)
      .map(({ heroId }) => heroId)
      .slice(0, PODIUM_COUNT)

    // Probably fetching multiple detailed heroes is not the best
    // but Marvel API doesn't provide a way to get a list of simple heroes
    const leaderBoardHeroes = await Promise.all(leaderBoardHeroIds.map((heroId) => this.marvelApi.hero(heroId)))

    return leaderBoardHeroes
  }
}
