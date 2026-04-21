import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Music2, ExternalLink, Play, Pause, AlertCircle } from "lucide-react";

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string | null;
  albumArtSmall: string | null;
  previewUrl: string | null;
  spotifyUrl: string | null;
  duration: number;
  addedAt: string;
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function TrackRow({ track, isPlaying, onTogglePlay }: {
  track: SpotifyTrack;
  isPlaying: boolean;
  onTogglePlay: () => void;
}) {
  return (
    <div className="group flex items-center gap-4 py-3 px-4 rounded-lg transition-colors hover:bg-muted/30 border-b border-border/20 last:border-b-0">
      {/* Album art */}
      <div className="w-12 h-12 rounded overflow-hidden bg-muted shrink-0 relative">
        {track.albumArtSmall ? (
          <img
            src={track.albumArtSmall}
            alt={track.album}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music2 className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
        {track.previewUrl && (
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isPlaying
              ? <Pause className="w-5 h-5 text-white" />
              : <Play className="w-5 h-5 text-white ml-0.5" />
            }
          </button>
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className="font-serif font-bold text-primary text-sm truncate">{track.name}</p>
        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
      </div>

      {/* Album name (hidden on mobile) */}
      <p className="hidden md:block text-xs text-muted-foreground truncate max-w-[200px]">
        {track.album}
      </p>

      {/* Duration */}
      <span className="text-xs text-muted-foreground font-mono shrink-0">
        {formatDuration(track.duration)}
      </span>

      {/* Spotify link */}
      {track.spotifyUrl && (
        <a
          href={track.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 text-muted-foreground hover:text-secondary transition-colors opacity-0 group-hover:opacity-100"
          title="Open in Spotify"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
}

export default function Music() {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/api/spotify/recently-saved?limit=30")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setError(data.hint || data.error);
        } else {
          setTracks(data.tracks || []);
          setTotal(data.total || 0);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handleTogglePlay = (track: SpotifyTrack) => {
    if (!track.previewUrl) return;

    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(track.previewUrl);
    audio.volume = 0.5;
    audio.play().catch(() => {});
    audio.onended = () => setPlayingId(null);
    audioRef.current = audio;
    setPlayingId(track.id);
  };

  if (loading) {
    return (
      <Layout>
        <section className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-3 mb-12">
              <div className="h-10 w-36 bg-muted/60 rounded animate-pulse" />
              <div className="h-5 w-72 bg-muted/40 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3 px-4">
                  <div className="w-12 h-12 bg-muted/50 rounded animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-muted/40 rounded animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                    <div className="h-3 w-32 bg-muted/30 rounded animate-pulse" style={{ animationDelay: `${i * 80 + 40}ms` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-24 px-6 md:px-12 min-h-screen">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">
              Music
            </h1>
            <p className="text-muted-foreground max-w-lg">
              Recently saved tracks from Spotify — a running log of what I've been listening to.
            </p>
          </div>

          {error ? (
            <div className="flex items-start gap-3 p-6 bg-card rounded-lg border border-border/50">
              <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-primary text-sm mb-1">Spotify not connected</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{error}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Track list */}
              <div className="bg-card/50 rounded-lg border border-border/30 overflow-hidden">
                {/* Column headers */}
                <div className="flex items-center gap-4 py-2 px-4 border-b border-border/30 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="w-12 shrink-0">&nbsp;</span>
                  <span className="flex-1">Title</span>
                  <span className="hidden md:block max-w-[200px]">Album</span>
                  <span className="shrink-0 font-mono">Time</span>
                  <span className="w-3.5 shrink-0">&nbsp;</span>
                </div>

                {tracks.map((track) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    isPlaying={playingId === track.id}
                    onTogglePlay={() => handleTogglePlay(track)}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="text-center py-8 mt-8 border-t border-border/20">
                <p className="text-sm text-muted-foreground">
                  Showing {tracks.length} of {total} saved track{total !== 1 ? "s" : ""}
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
