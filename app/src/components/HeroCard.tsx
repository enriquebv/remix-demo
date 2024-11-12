import { Link } from '@remix-run/react'

interface HeroCard {
  name: string
  image: string
  id: string
}

export default function HeroCard(props: HeroCard) {
  return (
    <div className='max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-52'>
      <Link to={`/hero/${props.id}`}>
        <img
          className='rounded-t-lg aspect-square object-cover'
          src={props.image}
          alt={props.name}
          height='206'
          width='206'
        />
      </Link>
      <div className='p-5'>
        <Link to={`/hero/${props.id}`}>
          <h5 className='mb-2 tracking-tight text-gray-900 dark:text-white'>{props.name}</h5>
        </Link>
      </div>
    </div>
  )
}
