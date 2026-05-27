// ============================================
// VideoPlayer — YouTube iframe + API
// ============================================
import { useEffect, useRef, useCallback } from 'react';
import { extractYoutubeId } from '../../utils/helpers';

export default function VideoPlayer({
  youtubeUrl,
  onPlayerReady,
  onSegmentEnd,
  segment,
}) {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const videoId = extractYoutubeId(youtubeUrl);

  // ── INIT YOUTUBE PLAYER ──
  const initPlayer = useCallback(() => {
    if (!videoId || !window.YT) return;

    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch (e) { /* ignore */ }
    }

    playerRef.current = new window.YT.Player('lessonVideo', {
      events: {
        onReady: (event) => {
          if (onPlayerReady) onPlayerReady(event.target);
          if (segment) playSegmentNow(event.target, segment);
        },
      },
    });
  }, [videoId, onPlayerReady, segment]);

  // ── PLAY SEGMENT ──
  const playSegmentNow = (player, seg) => {
    if (!player || !seg) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    player.seekTo(seg.startTime, true);
    player.playVideo();

    intervalRef.current = setInterval(() => {
      try {
        const t = player.getCurrentTime();
        if (t >= seg.endTime) {
          player.pauseVideo();
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          if (onSegmentEnd) onSegmentEnd();
        }
      } catch {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 200);
  };

  // Re-play when segment changes
  useEffect(() => {
    if (segment && playerRef.current?.seekTo) {
      playSegmentNow(playerRef.current, segment);
    }
  }, [segment]);

  // Init on mount
  useEffect(() => {
    // Wait for YT API
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const check = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(check);
          initPlayer();
        }
      }, 200);
      return () => clearInterval(check);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (e) { /* ignore */ }
      }
    };
  }, [videoId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!videoId) {
    return (
      <div className="yt-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
        No video URL
      </div>
    );
  }

  return (
    <div className="yt-wrap">
      <iframe
        id="lessonVideo"
        width="700"
        height="400"
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`}
        allowFullScreen
      />
    </div>
  );
}
