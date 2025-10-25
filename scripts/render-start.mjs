import { execSync } from 'node:child_process'

const run = (command) => {
  console.log(`\n$ ${command}`)
  execSync(command, { stdio: 'inherit' })
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL no está definido. Abortando arranque.')
  process.exit(1)
}

try {
  run('npx prisma migrate deploy')

  if (process.env.SEED_DATABASE === 'true') {
    run('npm run db:seed')
  } else {
    console.log('Seed omitido (SEED_DATABASE distinto de "true").')
  }

  run('next start')
} catch (error) {
  console.error('Fallo en la secuencia de arranque:', error)
  process.exit(1)
}
