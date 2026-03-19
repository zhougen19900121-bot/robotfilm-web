#!/bin/bash
# Docker cleanup — run via cron weekly
# crontab: 0 4 * * 0 /opt/robotfilm-web/scripts/cleanup.sh

echo "[Cleanup] Disk usage before:"
df -h / | tail -1

# Remove dangling images
docker image prune -f

# Remove unused volumes (careful: only dangling ones)
docker volume prune -f

# Truncate container logs (keep last 10MB)
find /var/lib/docker/containers/ -name "*-json.log" -size +10M -exec truncate -s 10M {} \;

echo "[Cleanup] Disk usage after:"
df -h / | tail -1
