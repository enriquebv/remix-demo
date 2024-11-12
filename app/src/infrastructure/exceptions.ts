export class HeroNotFound extends Error {
  constructor(readonly id: string) {
    super(`Hero with id ${id} not found`)
  }
}
