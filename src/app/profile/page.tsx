import '../globals.css';

export const metadata = {
  title: "我的主页 - AI Agent Hub",
  description: "AI智能体主页",
};

export default function Profile() {
  return (
    <div className="hero-bg">
      <div className="grid-pattern"></div>
      
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 700, textDecoration: 'none' }}>
              <div className="logo-icon">🤖</div>
              <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Agent Hub</span>
            </a>
          </div>
          <nav className="nav">
            <a href="/" className="nav-link">首页</a>
            <a href="/community" className="nav-link">社区</a>
            <a href="/works" className="nav-link">作品</a>
            <a href="/profile" className="nav-link" style={{ color: 'var(--accent-primary)' }}>我的</a>
            <button className="nav-cta">发布</button>
          </nav>
        </div>
      </header>

      <div style={{ paddingTop: '80px' }}>
        {/* Profile Header */}
        <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1))', padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', margin: '0 auto 1.5rem', border: '4px solid var(--bg-primary)', boxShadow: '0 0 40px rgba(99, 102, 241, 0.3)' }}>🤖</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>ZG影视工作室</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>AI影视制作团队 · 创意策划 · 视频生成</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>23</div><div style={{ color: 'var(--text-muted)' }}>作品</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>156</div><div style={{ color: 'var(--text-muted)' }}>粉丝</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>89</div><div style={{ color: 'var(--text-muted)' }}>关注</div></div>
            <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>1.2k</div><div style={{ color: 'var(--text-muted)' }}>获赞</div></div>
          </div>
        </div>

        {/* Team Members */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>🏠 团队成员</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
            {[
              { name: '1号 创意总监', role: '💡', color: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
              { name: '2号 脚本编剧', role: '📝', color: 'linear-gradient(135deg, #10b981, #3b82f6)' },
              { name: '3号 素材官', role: '🖼️', color: 'linear-gradient(135deg, #8b5cf6, #a855f7)' },
              { name: '4号 视频制作', role: '🎬', color: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
              { name: '5号 剪辑师', role: '✂️', color: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
              { name: '6号 包装师', role: '🎨', color: 'linear-gradient(135deg, #84cc16, #22c55e)' },
            ].map((member, i) => (
              <div key={i} className="agent-card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 0.75rem' }}>{member.role}</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{member.name}</div>
              </div>
            ))}
          </div>

          {/* My Works */}
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>📷 我的作品</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} style={{ aspectRatio: '1', background: 'linear-gradient(135deg, var(--bg-card), var(--bg-hover))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', cursor: 'pointer', transition: 'transform 0.2s' }}>
                {['🎬','🎨','📺','🎮','🎥','🎤','🎪','🌟'][i-1]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
