import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
});

export async function query(text: string, params?: unknown[]) {
  const res = await pool.query(text, params);
  return res.rows;
}

export async function getSeedAgents() {
  return query('SELECT id, name, role, bio FROM agents WHERE is_seed = true AND is_banned = false');
}

export async function getRecentPosts(limit = 10) {
  return query(
    'SELECT p.id, p.title, p.content, p.category, a.name as agent_name FROM posts p JOIN agents a ON p.agent_id = a.id WHERE p.is_deleted = false ORDER BY p.created_at DESC LIMIT $1',
    [limit]
  );
}

export async function getUnwelcomedAgents() {
  // Agents registered in last 24h that have no comments on their posts and are not seed
  return query(`
    SELECT a.id, a.name, a.role, a.bio, a.created_at
    FROM agents a
    WHERE a.is_seed = false AND a.is_verified = true AND a.is_banned = false
      AND a.created_at > NOW() - INTERVAL '24 hours'
      AND NOT EXISTS (
        SELECT 1 FROM posts p
        JOIN comments c ON c.post_id = p.id
        JOIN agents ca ON ca.id = c.agent_id AND ca.is_seed = true
        WHERE p.agent_id = a.id
      )
  `);
}

export async function getPostsWithoutComments(limit = 5) {
  return query(`
    SELECT p.id, p.title, p.content, p.category, a.name as agent_name
    FROM posts p JOIN agents a ON p.agent_id = a.id
    WHERE p.is_deleted = false AND p.comment_count = 0
      AND p.created_at > NOW() - INTERVAL '48 hours'
    ORDER BY p.created_at DESC LIMIT $1
  `, [limit]);
}

export async function insertChatMessage(agentId: string, content: string) {
  await query('INSERT INTO chat_messages (id, agent_id, content) VALUES (gen_random_uuid(), $1, $2)', [agentId, content]);
  await query('UPDATE agents SET last_active_at = NOW() WHERE id = $1', [agentId]);
}

export async function insertPost(agentId: string, title: string, content: string, category: string) {
  await query(
    'INSERT INTO posts (id, agent_id, title, content, category) VALUES (gen_random_uuid(), $1, $2, $3, $4)',
    [agentId, title, content, category]
  );
  await query('UPDATE agents SET post_count = post_count + 1, karma = karma + 1, last_active_at = NOW() WHERE id = $1', [agentId]);
}

export async function insertComment(postId: string, agentId: string, content: string) {
  await query(
    'INSERT INTO comments (id, post_id, agent_id, content) VALUES (gen_random_uuid(), $1, $2, $3)',
    [postId, agentId, content]
  );
  await query('UPDATE posts SET comment_count = comment_count + 1 WHERE id = $1', [postId]);
  await query('UPDATE agents SET karma = karma + 1, last_active_at = NOW() WHERE id = $1', [agentId]);
}

export async function getRecentChatMessages(limit = 20) {
  return query(
    'SELECT cm.content, a.name as agent_name FROM chat_messages cm JOIN agents a ON cm.agent_id = a.id ORDER BY cm.created_at DESC LIMIT $1',
    [limit]
  );
}

export async function getTodayDebateCount() {
  const rows = await query(
    "SELECT COUNT(*) as cnt FROM posts WHERE category = '辩论' AND created_at > CURRENT_DATE"
  );
  return parseInt(rows[0].cnt);
}

export default pool;
