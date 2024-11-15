import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import Layout from '../src/components/Layout'
import { redirect, useLoaderData, useParams } from '@remix-run/react'
import authenticate, { UnauthenticatedError } from '../context.server'
import { HeroNotFound } from '../src/infrastructure/exceptions'
import Button from '../src/components/Button'
import useHero from '../src/hooks/useHero'
import Comments from '../src/components/Comments'
import { useMemo } from 'react'
import debounce from 'debounce'
import { DetailedHero } from '../src/domain/DetailedHero'

function dataHasHero(data: unknown): data is { hero: DetailedHero } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any).hero !== undefined && (data as any).hero !== null
}

export const meta: MetaFunction = ({ data, params }) => {
  // Rare case where the data is not available
  if (!dataHasHero(data)) {
    return [{ title: `Hero #${params.id} | <Marvel/>` }]
  }

  return [{ title: `${data.hero.name} | <Marvel/>` }]
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    const {
      fetchHero,
      session: { username },
    } = await authenticate(request)
    const details = await fetchHero(params.id!, username)

    return json({
      ...details,
      username,
    })
  } catch (error) {
    // Probably this need to be moved to a global error handler
    if (error instanceof UnauthenticatedError) {
      return redirect('/login')
    }

    if (error instanceof HeroNotFound) {
      throw new Response(null, {
        status: 404,
        statusText: 'Not Found',
      })
    }

    throw error
  }
}

const EmojiPerPoint = [
  '😔', // 0
  '😕', // 1
  '😖', // 2
  '😗', // 3
  '😙', // 4
  '👍🏻', // 5
  '👌🏻', // 6
  '🙂‍↕️', // 7
  '🥹', // 8
  '😎', // 9
  '🥰', // 10
]

export default function HeroPage() {
  const params = useParams()
  const {
    hero,
    liked: initialLiked,
    comments: initialComments,
    puntuation: initialPuntuation,
    username,
  } = useLoaderData<typeof loader>()

  const {
    liked,
    setLikeStatus,
    comment,
    comments,
    setComment,
    postComment,
    puntuation,
    setPuntuation,
    saveLike,
    savePuntuation,
  } = useHero({
    heroId: params.id!,
    username,
    initialValues: {
      liked: initialLiked,
      comments: initialComments,
      puntuation: initialPuntuation,
    },
  })

  async function handleSetPuntuationPrompt() {
    // TODO: Change this for a beautiful modal in the future
    const result = window.prompt('Enter a number between 0 and 10')

    const isEmpty = result === null || result.trim() === ''

    if (isEmpty) {
      return
    }

    if (isNaN(Number(result))) {
      alert('Please enter a number between 0 and 10')
      handleSetPuntuationPrompt()
      return
    }

    const resultAsNumber = Number(result)
    const outOfRange = resultAsNumber < 0 || resultAsNumber > 10

    if (outOfRange) {
      alert('Please enter a number between 0 and 10')
      handleSetPuntuationPrompt()
      return
    }

    setPuntuation(resultAsNumber)
    await savePuntuation(resultAsNumber)
  }

  const debouncedSavePuntuation = useMemo(
    () => debounce(savePuntuation, 250),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  async function handlePuntuationChange(puntuation: number) {
    setPuntuation(puntuation)
    await debouncedSavePuntuation(puntuation)
  }

  async function toggleLike() {
    const nextValue = !liked
    await setLikeStatus(nextValue)
    await saveLike(nextValue)
  }

  return (
    <Layout>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex items-center gap-4 mb-6'>
          <img className='w-16 h-16 rounded-full' alt='img of a girl posing' src={hero.image} />
          <h1 className='text-6xl font-extralight'>{hero.name}</h1>
        </div>

        <div className='mb-12 flex gap-12'>
          <button onClick={toggleLike}>{liked ? '❤️ Liked' : 'Like'}</button>
          {puntuation === null ? (
            <Button onClick={handleSetPuntuationPrompt}>Set puntuation</Button>
          ) : (
            <div className='flex items-center gap-2'>
              <input
                id='default-range'
                type='range'
                min='0'
                max='10'
                value={puntuation}
                onChange={(event) => handlePuntuationChange(Number(event.target.value))}
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
              />
              <div className='flex flex-nowrap gap-1'>
                <span>{puntuation}/10</span>
                <span>{EmojiPerPoint[puntuation]}</span>
              </div>
            </div>
          )}
        </div>

        <div className='flex flex-col gap-4'>
          <h2 className='text-3xl'>Last comics</h2>
          <ul className='list-disc list-inside'>
            {hero.comics.map((comic) => (
              <li key={comic}>{comic}</li>
            ))}
          </ul>
        </div>

        <Comments commentValue={comment} comments={comments} onAddComment={postComment} onCommentChange={setComment} />
      </div>
    </Layout>
  )
}
