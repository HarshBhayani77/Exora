#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL database at database:5432..."
until nc -z -v -w3 database 5432 2>/dev/null; do
  echo "Database is not ready yet - retrying in 2 seconds..."
  sleep 2
done
echo "✅ Database connection established!"

if [ "$SKIP_MIGRATE" != "true" ]; then
  echo "🔄 Applying Prisma migrations..."
  npx prisma migrate deploy || npx prisma db push --skip-generate

  echo "🌱 Seeding initial database records..."
  npm run db:seed || true
else
  echo "⏩ Skipping migrations and seeds (handled by primary backend service)"
fi

echo "🚀 Starting Exora server on port ${PORT:-3001}..."
exec "$@"
