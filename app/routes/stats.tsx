import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import Layout from '../src/components/Layout'
import { redirect, useLoaderData } from '@remix-run/react'
import authenticate, { UnauthenticatedError } from '../context.server'
import HeroCard from '../src/components/HeroCard'

export const meta: MetaFunction = () => {
  return [{ title: 'Stats | <Marvel/>' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const {
      fetchStats,
      session: { username },
    } = await authenticate(request)
    const stats = await fetchStats()

    return json({
      username,
      stats,
    })
  } catch (error) {
    // Probably this need to be moved to a global error handler
    if (error instanceof UnauthenticatedError) {
      return redirect('/login')
    }

    throw error
  }
}

export default function HeroPage() {
  const { stats, username } = useLoaderData<typeof loader>()

  if (stats.length === 0) {
    return (
      <Layout>
        <p className='text-5xl text-center mt-20'>No one has liked or commented in any hero yet. 😔</p>
      </Layout>
    )
  }

  return (
    <Layout>
      <h1 className='text-6xl mb-4'>
        Hello <span className='italic'>{username}</span>!
      </h1>
      <p className='text-4xl mb-8'>The best heroes are:</p>

      <ol className='flex flex-nowrap gap-4'>
        {stats.map((hero, index) => (
          <li key={hero.id}>
            <p className='text-2xl'>Place: {index + 1}</p>
            <HeroCard name={hero.name} image={hero.image} id={hero.id} />
          </li>
        ))}
      </ol>
    </Layout>
  )
}
