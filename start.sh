#!/bin/sh
set -e

if [ -z "${DATABASE_URL}" ]; then
  echo "DATABASE_URL no está definido; abortando." >&2
  exit 1
fi

echo "Aplicando migraciones..."
npx prisma migrate deploy

if [ "${SEED_DATABASE}" = "true" ]; then
  echo "Ejecutando seed de base de datos..."
  npm run db:seed
else
  echo "Seed omitido (establece SEED_DATABASE=true para activarlo)."
fi

echo "Iniciando servidor Next.js..."
exec node server.js
