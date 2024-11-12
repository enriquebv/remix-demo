import { createCookie } from '@remix-run/node' // or cloudflare/deno

export const sessionCookie = createCookie('session', {
  maxAge: 604_800, // one week
  httpOnly: true,
})
