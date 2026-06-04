"use client";

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function YouTubeEmbed({
  url,
  title,
}: {
  url: string;
  title?: string;
}) {
  const videoId = getYouTubeId(url);

  if (videoId) {
    return (
      <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title ?? "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
      <video className="w-full h-full" controls src={url}>
        Tarayıcınız video oynatmayı desteklemiyor.
      </video>
    </div>
  );
}
