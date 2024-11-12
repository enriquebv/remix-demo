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
  /**
   * Prefetch the next 3 pages and store it in memory to create an smoother experience.
   * Disable it to get a not so smooth experience, or if you are DDOSing the API.
   */
  prefetch?: boolean
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

  async function fetchPage(pageToFetch: number) {
    const alreadyFetched = pages.find((page) => page.page === pageToFetch)

    if (alreadyFetched) {
      return
    }

    setState(HeroListState.Loading)
    const response = await fetch('/api/hero?page=' + pageToFetch)
    const json = await response.json()

    setPages((prev) => [...prev, { page: json.page, data: json.data }])

    setPagination(() => ({
      totalItems: json.total,
      totalPages: json.totalPages,
    }))

    setState(() => HeroListState.Idle)
  }

  // TODO: Move to imperative to avoid issues
  useEffect(() => {
    fetchPage(props.page)

    if (props.prefetch) {
      fetchPage(props.page + 1)
      fetchPage(props.page + 2)
      fetchPage(props.page + 3)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.page])

  return {
    state,
    page,
    pagination,
    currentPageIsLoading: page.length === 0,
  }
}
