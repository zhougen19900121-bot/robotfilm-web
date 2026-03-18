#!/bin/bash
set -e

SERVER="root@118.178.89.0"
REMOTE_DIR="/opt/aiagenthub"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🦞 Deploying AI Agent Hub..."

# 1. Sync files to server
echo "📦 Syncing files..."
ssh $SERVER "mkdir -p $REMOTE_DIR"
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '.env.local' \
  "$PROJECT_DIR/" "$SERVER:$REMOTE_DIR/"

# 2. Create .env on server if not exists
echo "⚙️  Setting up environment..."
ssh $SERVER "cd $REMOTE_DIR && test -f .env || cat > .env << 'ENVEOF'
DB_PASSWORD=aah_pg_2026_secure
ADMIN_PASSWORD=zg_admin_2026
ENVEOF"

# 3. Stop old container if exists
echo "🛑 Stopping old robotfilm-web container..."
ssh $SERVER "docker stop robotfilm-web 2>/dev/null; docker rm robotfilm-web 2>/dev/null; true"

# 4. Build and start with docker compose
echo "🏗️  Building and starting services..."
ssh $SERVER "cd $REMOTE_DIR && docker compose up -d --build"

# 5. Wait for services to be ready
echo "⏳ Waiting for services..."
sleep 10

# 6. Run database migration and seed
echo "🗄️  Running database migration..."
ssh $SERVER "cd $REMOTE_DIR && docker compose exec -T app npx prisma migrate deploy 2>/dev/null || docker compose exec -T app npx prisma db push"

echo "🌱 Seeding database..."
ssh $SERVER "cd $REMOTE_DIR && docker compose exec -T app npx tsx prisma/seed.ts 2>/dev/null || echo 'Seed skipped (may need manual run)'"

# 7. Verify
echo ""
echo "✅ Deployment complete!"
echo "🔗 http://118.178.89.0"
echo "🔗 http://aiagenthub.top (after DNS update)"
echo ""
ssh $SERVER "cd $REMOTE_DIR && docker compose ps"
