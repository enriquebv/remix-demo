interface Props {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination(props: Props) {
  function handlePreviousPage() {
    if (props.currentPage > 1) {
      props.onPageChange(props.currentPage - 1)
    }
  }

  function handleNextPage() {
    if (props.currentPage < props.totalPages) {
      props.onPageChange(props.currentPage + 1)
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <span className='text-sm'>
        Page <span className='font-semibold'>{props.currentPage}</span> of{' '}
        <span className='font-semibold'>{props.totalPages}</span>
      </span>

      <div className='inline-flex mt-2 xs:mt-0'>
        <button
          disabled={props.currentPage === 1}
          onClick={handlePreviousPage}
          className='flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Prev
        </button>
        <button
          disabled={props.currentPage === props.totalPages}
          onClick={handleNextPage}
          className='flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 disabled:cursor-not-allowed'
        >
          Next
        </button>
      </div>
    </div>
  )
}
