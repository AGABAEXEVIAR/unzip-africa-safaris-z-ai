// Prisma client singleton — server-side only.
//
// This file MUST only be imported from server-side code:
//   • Server Components (top-level `async function` in app/ files)
//   • Server Actions ("use server" functions)
//   • API route handlers (app/api/*/route.ts)
//
// Never import this module from a Client Component ("use client"). Prisma
// connects to MySQL using DATABASE_URL which is a server secret — exposing
// it to the browser would leak the database credentials.
//
// The singleton pattern below prevents Next.js dev hot-reload from spawning
// a new PrismaClient on every HMR, which would exhaust MySQL connection
// limits. We stash the instance on globalThis so it survives across HMR.

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
