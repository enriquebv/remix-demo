import { useMemo } from 'react'
import { Comment } from '../domain/Comment'
import Button from './Button'

interface Props {
  commentValue: string
  comments: Comment[]
  onCommentChange: (comment: string) => void
  onAddComment: () => void
}

const MIN_COMMENT_LENGTH = 3
const MAC_COMMENT_LENGTH = 140

export default function Comments(props: Props) {
  const { commentValue, onCommentChange, onAddComment } = props

  const validComment = useMemo(
    () => commentValue.trim().length > MIN_COMMENT_LENGTH && commentValue.length <= MAC_COMMENT_LENGTH,
    [commentValue]
  )

  function handlePostComment() {
    if (!validComment) {
      return
    }

    onAddComment()
  }

  return (
    <section className='py-8 lg:py-16 antialiased w-full'>
      <div className='max-w-2xl mx-auto px-4'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-lg lg:text-2xl font-bold text-gray-900 dark:text-white'>
            Discussion ({props.comments.length})
          </h2>
        </div>
        <form className='mb-6'>
          <div className='py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
            <label htmlFor='comment' className='sr-only'>
              Your comment
            </label>
            <textarea
              value={commentValue}
              onChange={(e) => onCommentChange(e.target.value)}
              id='comment'
              rows={4}
              className='px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800'
              placeholder='Write a comment...'
              required
            ></textarea>
          </div>
          <Button disabled={!validComment} onClick={handlePostComment}>
            Post comment
          </Button>
          {commentValue.length > 140 && (
            <p className='mt-4 text-red-500 text-sm'>Comment must be less than 140 characters</p>
          )}
        </form>

        {props.comments.map(({ author, createdAt, comment, uuid }) => (
          <article className='p-6 text-base' key={uuid}>
            <footer className='flex justify-between items-center mb-2'>
              <div className='flex items-center'>
                <p className='inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold'>
                  {author}
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  <time title='February 8th, 2022'>{createdAt}</time>
                </p>
              </div>
            </footer>
            <p className='text-gray-500 dark:text-gray-400'>{comment}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
