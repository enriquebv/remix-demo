import { useMemo, useState } from 'react'
// We use a type to avoid relating to a back-end implementation
import { type Action } from '../../routes/api.hero.$id'
import type { Comment } from '../domain/Comment'
import useNotification from './useNotification'

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
  const [state, setState] = useState({
    ...props.initialValues,
    comment: '',
  })

  async function fetchApi(action: Action, payload: Record<string, unknown>) {
    const response = await fetch(`/api/hero/${props.heroId}`, {
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

  async function postComment() {
    const prevComment = state.comment
    const uuid = crypto.randomUUID()

    try {
      setState((prevState) => ({
        ...prevState,
        comment: '',
        comments: [...prevState.comments].concat({
          uuid: uuid,
          author: props.username,
          comment: prevComment,
          createdAt: new Date().toISOString(),
        }),
      }))
      await fetchApi('comment', { comment: state.comment, uuid })

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

  async function setLikeStatus(status: boolean) {
    const prevStatus = state.liked

    setState((prevState) => ({
      ...prevState,
      liked: status,
    }))

    try {
      await fetchApi('like', { status })

      notification.success('Done!')
    } catch (error) {
      // As part of optimistic UI, we want to revert the state
      setState((prevState) => ({
        ...prevState,
        liked: prevStatus,
      }))

      notification.error('Something went wrong with the like, please try again')

      throw error
    }
  }

  async function setPuntuation(puntuation: number) {
    const prevPuntuation = state.puntuation
    setState((prevState) => ({
      ...prevState,
      puntuation,
    }))

    try {
      await fetchApi('puntuation', { puntuation })

      notification.success('Done!')
    } catch (error) {
      // As part of optimistic UI, we want to revert the state
      setState((prevState) => ({
        ...prevState,
        puntuation: prevPuntuation,
      }))

      notification.error('Something went wrong, please try again')

      throw error
    }
  }

  function setComment(comment: string) {
    setState((prevState) => ({
      ...prevState,
      comment,
    }))
  }

  const sortedComments = useMemo(
    () => state.comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [state.comments]
  )

  return {
    ...state,
    comments: sortedComments,
    postComment,
    setLikeStatus,
    setPuntuation,
    setComment,
  }
}
