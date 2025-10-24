import { PrismaClient } from '@prisma/client'

// BUG #3: Database Connection Pool Exhaustion
// ISSUE: New PrismaClient instance created on every import in development
// This causes connection pool exhaustion under load
// MISSING: Proper singleton pattern and connection pooling configuration

const prismaClientSingleton = () => {
  return new PrismaClient({
    // BUG: No connection pool limits configured
    // BUG: No query logging for debugging
    // BUG: No error handling for connection failures
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// BUG: In development, hot reload creates new instances
// ISSUE: Should use globalThis to prevent multiple instances
const prisma = globalThis.prisma ?? prismaClientSingleton()

// BUG: This doesn't prevent connection exhaustion
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma
