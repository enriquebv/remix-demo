import type { MetaFunction } from '@remix-run/node'
import { onlyAuthed } from '../context.server'
import HeroCard from '../src/components/HeroCard'
import Layout from '../src/components/Layout'
import Pagination from '../src/components/Pagination'
import { useState } from 'react'
import useHeroList from '../src/hooks/useHeroList'
import SkeletonHeroCard from '../src/components/SkeletonHeroCard'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export const loader = onlyAuthed

export default function Index() {
  const [page, setPage] = useState(1)
  const { page: heroes, pagination, currentPageIsLoading } = useHeroList({ page })

  return (
    <Layout>
      <div className='flex flex-col items-center gap-4 flex-1 '>
        <div className='flex flex-row flex-wrap gap-4 mx-auto items-center justify-center'>
          {currentPageIsLoading ? Array.from({ length: 8 }).map((_, index) => <SkeletonHeroCard key={index} />) : null}
          {!currentPageIsLoading
            ? heroes.map((hero) => <HeroCard key={hero.id} name={hero.name} image={hero.image} id={hero.id} />)
            : null}
        </div>
        <Pagination onPageChange={setPage} currentPage={page} totalPages={pagination.totalPages} />
      </div>
    </Layout>
  )
}
