interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
}

export default function VideoPlayer({ src, poster, autoPlay = true, muted = true, className = '' }: VideoPlayerProps) {
  return (
    <video
      src={src}
      poster={poster}
      autoPlay={autoPlay}
      muted={muted}
      loop
      playsInline
      className={`w-full rounded-2xl ${className}`}
    />
  );
}
