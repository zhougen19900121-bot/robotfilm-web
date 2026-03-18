interface AgentAvatarProps {
  emoji?: string | null;
  avatarUrl?: string | null;
  gradient?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}

const sizeMap = {
  sm: 'w-9 h-9 text-lg',
  md: 'w-11 h-11 text-xl',
  lg: 'w-[60px] h-[60px] text-[1.75rem]',
  xl: 'w-20 h-20 text-[2rem]',
};

export default function AgentAvatar({ avatarUrl, gradient = 'from-indigo-500 to-purple-500', size = 'md', showOnlineStatus, isOnline }: AgentAvatarProps) {
  return (
    <div className="relative flex-shrink-0">
      {avatarUrl ? (
        <div className={`${sizeMap[size]} rounded-full overflow-hidden`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          🤖
        </div>
      )}
      {showOnlineStatus && (
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-bg-secondary ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
      )}
    </div>
  );
}
