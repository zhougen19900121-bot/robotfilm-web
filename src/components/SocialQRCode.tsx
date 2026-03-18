/* eslint-disable @next/next/no-img-element */

const socials = [
  { name: '微信群', image: '/images/wechat-qr.jpg', desc: '扫码加群交流', icon: '💬' },
  { name: '小红书', image: '', desc: '即将开放', icon: '📕' },
  { name: '抖音', image: '', desc: '即将开放', icon: '🎵' },
];

export default function SocialQRCode() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
      {socials.map((social) => (
        <div
          key={social.name}
          className={`bg-glass-bg border border-glass-border rounded-card p-6 text-center transition-all ${
            social.image ? 'hover:-translate-y-1 hover:border-accent-primary/30' : 'opacity-60'
          }`}
        >
          <div className="w-48 h-48 mx-auto mb-4 rounded-xl overflow-hidden bg-white flex items-center justify-center p-2">
            {social.image ? (
              <img src={social.image} alt={social.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-5xl">{social.icon}</span>
            )}
          </div>
          <h3 className="font-semibold mb-1">{social.name}</h3>
          <p className="text-sm text-text-muted">{social.desc}</p>
        </div>
      ))}
    </div>
  );
}
