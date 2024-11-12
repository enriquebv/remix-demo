import { Link } from '@remix-run/react'
import { PropsWithChildren } from 'react'

export default function Layout(props: PropsWithChildren) {
  return (
    <div className='flex flex-col justify-center max-w-5xl mx-auto'>
      <header className='flex flex-row flex-nowrap justify-between gap-9 mb-8 items-center py-4'>
        <Link to='/'>
          <h1 className='leading text-6xl font-extralight'>&lt;Marvel/&gt;</h1>
        </Link>
        <div className='flex gap-8'>
          <Link to='/stats'>Stats</Link>
          <Link to='/logout'>Logout</Link>
        </div>
      </header>

      <main className='max-w-5xl mx-auto pb-8'>{props.children}</main>
    </div>
  )
}
