import { PropsWithChildren } from 'react'

interface ButtonProps extends PropsWithChildren {
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

export default function Button(props: ButtonProps) {
  return (
    <button
      type={props.type ?? 'button'}
      className='text-white bg-accent hover:bg-accent-darker focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 disabled:opacity-50'
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  )
}
