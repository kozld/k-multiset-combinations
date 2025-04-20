import { db } from '../src/db/client'
import fs from 'fs'
import path from 'path'

const migrationsDir = path.resolve(__dirname, '../db/migrations')

async function runMigrations() {
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'))

  for (const file of files) {
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')
    await db.query(content)
    console.log(`Applied: ${file}`)
  }

  await db.end()
}

runMigrations()
