import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Button from './Button'

describe('Button test:', () => {
  afterEach(cleanup)

  it('should render component', () => {
    render(<Button />)
  })

  it('should render child', () => {
    render(<Button>Button content</Button>)
    screen.getByText('Button content')
  })

  it('should trigger onClick', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Button content</Button>)

    screen.getByText('Button content').click()
    expect(onClick).toHaveBeenCalled()
  })
})
