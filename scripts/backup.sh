#!/bin/bash
# Database backup — run via cron daily
# crontab: 0 3 * * * /opt/robotfilm-web/scripts/backup.sh

BACKUP_DIR="/opt/robotfilm-web/backups"
KEEP_DAYS=7

mkdir -p "$BACKUP_DIR"

# Dump database from docker container
docker exec robotfilm-web-db-1 pg_dump -U aiagenthub aiagenthub | gzip > "$BACKUP_DIR/db_$(date +%Y%m%d_%H%M%S).sql.gz"

# Remove backups older than KEEP_DAYS
find "$BACKUP_DIR" -name "db_*.sql.gz" -mtime +$KEEP_DAYS -delete

echo "[Backup] Done at $(date). Files in $BACKUP_DIR:"
ls -lh "$BACKUP_DIR"
