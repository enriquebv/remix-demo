import { useMemo, useRef, useState } from 'react'
import useNotification from './useNotification'
// We use a type to avoid relating to a back-end implementation
import { type Action } from '../../routes/api.hero.$id'
import type { Comment } from '../domain/Comment'

interface Props {
  heroId: string
  username: string
  initialValues: {
    liked: boolean
    comments: Comment[]
    puntuation: number | null
  }
}

export default function useHero(props: Props) {
  const notification = useNotification()
  // We use two refs to store original state and mutated one
  // to detect on save if something changed and trigger the remote side effect.
  // This enables the use of optimistic UI, because we can revert the state if something goes wrong.
  const originalValues = useRef(structuredClone(props.initialValues))
  const updatedValues = useRef(structuredClone(props.initialValues))
  const [state, setState] = useState({
    ...structuredClone(props.initialValues),
    comment: '',
  })
  const fetchApi = useMemo(() => createFetchApi(props.heroId), [props.heroId])

  // Comments sorted by date
  const sortedComments = useMemo(
    () => state.comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [state.comments]
  )

  async function setLikeStatus(status: boolean) {
    setState((prevState) => ({
      ...prevState,
      liked: status,
    }))
    updatedValues.current.liked = status
  }

  async function setPuntuation(puntuation: number) {
    setState((prevState) => ({
      ...prevState,
      puntuation,
    }))
    updatedValues.current.puntuation = puntuation
  }

  function setComment(comment: string) {
    setState((prevState) => ({
      ...prevState,
      comment,
    }))
  }

  async function save() {
    let somethingSaved = false

    const likedChange = originalValues.current.liked !== updatedValues.current.liked

    if (likedChange) {
      try {
        await fetchApi('like', { status: state.liked })
        originalValues.current.liked = state.liked
        updatedValues.current.liked = state.liked
        somethingSaved = true
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          liked: originalValues.current.liked,
        }))
        updatedValues.current.liked = originalValues.current.liked

        notification.error('Something went wrong, please try again')
        throw error
      }
    }

    const puntuationChanged = originalValues.current.puntuation !== updatedValues.current.puntuation
    if (puntuationChanged) {
      try {
        await fetchApi('puntuation', { puntuation: state.puntuation })
        originalValues.current.puntuation = state.puntuation
        updatedValues.current.puntuation = state.puntuation
        somethingSaved = true
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          puntuation: originalValues.current.puntuation,
        }))
        updatedValues.current.puntuation = originalValues.current.puntuation

        notification.error('Something went wrong, please try again')
        throw error
      }
    }

    if (somethingSaved) {
      console.log('updated')
      notification.success('Done!')
    }
  }

  async function postComment() {
    const prevComment = state.comment
    const uuid = crypto.randomUUID()

    const nextComment: Comment = {
      uuid: uuid,
      author: props.username,
      comment: state.comment,
      createdAt: new Date().toISOString(),
    }

    try {
      setState((prevState) => ({
        ...prevState,
        comment: '',
        comments: [...prevState.comments, nextComment],
      }))
      await fetchApi('comment', { comment: state.comment, uuid })
      originalValues.current.comments = [...originalValues.current.comments, nextComment]

      notification.success('Done!')
    } catch (error) {
      // As part of optimistic UI, we want to revert the state
      setState((prevState) => ({
        ...prevState,
        comment: prevComment,
        comments: prevState.comments.filter((comment) => comment.uuid !== uuid),
      }))

      notification.error('Something went wrong, please try again')
    }
  }

  return {
    ...state,
    comments: sortedComments,
    postComment,
    setLikeStatus,
    setPuntuation,
    setComment,
    save,
  }
}

function createFetchApi(heroId: string) {
  return async function fetchApi(action: Action, payload: Record<string, unknown>) {
    const response = await fetch(`/api/hero/${heroId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        payload,
      }),
    })

    if (!response.ok) {
      throw new Error('Something went wrong')
    }
  }
}
