import type { MetaFunction, ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import Input from '../src/components/Input'
import Button from '../src/components/Button'
import { useEffect, useState } from 'react'
import { Form, json, useActionData } from '@remix-run/react'
import { sessionCookie } from '../cookies.server'

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }]
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const username = String(formData.get('username'))

  if (!username) {
    const error = { username: 'required' }
    return json({ error }, { status: 400 })
  }

  // Go to protected app
  return redirect(`/`, {
    headers: {
      'Set-Cookie': await sessionCookie.serialize(username),
    },
  })
}

export default function Index() {
  const [username, setUsername] = useState<string>('')
  const [missingUsername, setMissingUsername] = useState<boolean>(false)
  const actionData = useActionData<typeof action>()

  // When form responses with an error
  useEffect(() => {
    if (actionData?.error?.username === 'required') {
      setMissingUsername(true)
    }
  }, [actionData])

  function handleUsernameChange(username: string) {
    setUsername(username)

    if (username.length > 0) {
      setMissingUsername(false)
    } else {
      setMissingUsername(true)
    }
  }

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='flex flex-col items-center gap-16'>
        <header className='flex flex-col items-center gap-9'>
          <h1 className='leading text-6xl font-extralight'>&lt;Marvel/&gt;</h1>
        </header>

        <Form method='post' className='flex flex-row gap-1 items-center'>
          <Input
            value={username}
            onChange={handleUsernameChange}
            label='Username'
            placeholder='Example: Thanos'
            name='username'
            helpText='Pick an username to use the app'
            error={missingUsername ? 'Required' : undefined}
          />
          <Button type='submit'>Enter</Button>
        </Form>
      </div>
    </div>
  )
}
