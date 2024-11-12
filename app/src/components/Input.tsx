interface InputProps {
  label: string
  name: string
  placeholder?: string
  prefix?: string | React.ReactNode
  value: string
  onChange: (value: string) => void
  helpText?: string
  error?: string
  required?: boolean
}

export default function Input(props: InputProps) {
  return (
    <div>
      <label htmlFor={props.name} className={`block text-sm font-medium ${props.error ? 'text-red-500' : ''}`}>
        {props.label}
      </label>
      <div className='relative mt-2 rounded-md shadow-sm'>
        <input
          required={props.required}
          type='text'
          name={props.name}
          id={props.name}
          className={`block text-sm w-full rounded-md border-0 py-1.5 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 ${
            props.error ? 'focus:ring-red-600 text-red-500 placeholder:text-red-300 outline-red-400' : ''
          }`}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>

      {props.helpText && !props.error ? <p className='mt-2 text-sm text-gray-500'>{props.helpText}</p> : null}
      {props.error ? <p className='mt-2 text-sm text-red-500'>{props.error}</p> : null}
    </div>
  )
}
