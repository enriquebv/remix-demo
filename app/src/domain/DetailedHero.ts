export class DetailedHero {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly image: string,
    readonly comics: string[]
  ) {}
}
