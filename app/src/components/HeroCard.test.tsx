import { render, screen } from '@testing-library/react'
import { createRemixStub, RemixStubProps } from '@remix-run/testing'
import { beforeAll, describe, expect, test } from 'vitest'
import HeroCard from './HeroCard'

describe('HeroCard', () => {
  let App: (props: RemixStubProps) => JSX.Element

  beforeAll(async () => {
    App = createRemixStub([
      {
        path: '/',
        Component: () => <HeroCard id='123' name='Iron-Man' image='https://google.es' />,
      },
    ])

    await render(<App />)
  })

  test('renders a hero card', () => {
    screen.getByText('Iron-Man')
  })

  test('has link with hero id', async () => {
    const links = screen.getAllByRole('link')

    expect(links.some((link) => link.getAttribute('href') === '/hero/123')).toBe(true)
  })
})
