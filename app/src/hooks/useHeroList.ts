import { useEffect, useMemo, useState } from 'react'
import { Hero } from '../domain/Hero'

export const HeroListState = {
  Idle: 'idle',
  Loading: 'loading',
  Revalidating: 'revalidating',
  Error: 'error',
} as const

type HeroListState = (typeof HeroListState)[keyof typeof HeroListState]

interface HeroListProps {
  page: number
}

export default function useHeroList(props: HeroListProps) {
  const [state, setState] = useState<HeroListState>(HeroListState.Idle)
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
  })
  // IMPORTANT: Probably trying to store in memory is not a good idea,
  // but currently is fast.
  const [pages, setPages] = useState<{ page: number; data: Hero[] }[]>([])

  const page = useMemo<Hero[]>(() => pages.find((page) => page.page === props.page)?.data ?? [], [pages, props.page])

  async function fetchPage(page: number) {
    setState(HeroListState.Loading)
    const response = await fetch('/api/hero?page=' + page)
    const json = await response.json()

    setPages((prev) => {
      let updated = [...prev]

      // Remove the page if it exists
      updated = updated.filter((page) => page.page !== json.page)

      // Append new data
      updated.push({
        page: json.page,
        data: json.data,
      })

      return updated
    })
    setPagination(() => ({
      totalItems: json.total,
      totalPages: json.totalPages,
    }))
    setState(() => HeroListState.Idle)
  }

  useEffect(() => {
    fetchPage(props.page)
  }, [props.page])

  return {
    state,
    page,
    pagination,
    currentPageIsLoading: page.length === 0,
  }
}
