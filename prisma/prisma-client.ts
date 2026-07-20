import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { withAccelerate } from '@prisma/extension-accelerate'

const connectionString = process.env.DATABASE_URL ?? process.env.PRISMA_DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in .env')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter }).$extends(withAccelerate())