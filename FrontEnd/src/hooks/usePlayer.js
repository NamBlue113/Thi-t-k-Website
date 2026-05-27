// ============================================
// usePlayer — YouTube & Audio player management
// ============================================
import { useState, useRef, useCallback, useEffect } from 'react';

export function usePlayer() {
  const [player, setPlayer] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(null);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const pauseIntervalRef = useRef(null);

  // ── CLEANUP ──
  useEffect(() => {
    return () => {
      if (pauseIntervalRef.current) {
        clearInterval(pauseIntervalRef.current);
      }
    };
  }, []);

  // ── INIT YOUTUBE PLAYER ──
  const initYoutubePlayer = useCallback((elementId, onReady) => {
    // Cleanup existing
    if (player) {
      try { player.destroy(); } catch (e) { /* ignore */ }
    }

    const newPlayer = new window.YT.Player(elementId, {
      events: {
        onReady: () => {
          setPlayerReady(true);
          setPlayer(newPlayer);
          if (onReady) onReady(newPlayer);
        },
      },
    });

    return newPlayer;
  }, [player]);

  // ── LOAD VIDEO ──
  const loadVideo = useCallback((videoId) => {
    if (player && playerReady) {
      player.loadVideoById(videoId);
    }
  }, [player, playerReady]);

  // ── PLAY SEGMENT ──
  const playSegment = useCallback((segment) => {
    if (!player || !playerReady || !segment) return;

    if (pauseIntervalRef.current) {
      clearInterval(pauseIntervalRef.current);
    }

    player.seekTo(segment.startTime, true);
    player.playVideo();

    pauseIntervalRef.current = setInterval(() => {
      try {
        const currentTime = player.getCurrentTime();
        if (currentTime >= segment.endTime) {
          player.pauseVideo();
          clearInterval(pauseIntervalRef.current);
          pauseIntervalRef.current = null;
        }
      } catch {
        clearInterval(pauseIntervalRef.current);
        pauseIntervalRef.current = null;
      }
    }, 200);

    setCurrentSegment(segment);
  }, [player, playerReady]);

  // ── NEXT SEGMENT ──
  const nextSegment = useCallback((segments) => {
    if (!segments || !segments.length) return false;
    const next = segmentIndex + 1;
    if (next < segments.length) {
      setSegmentIndex(next);
      playSegment(segments[next]);
      return true;
    }
    return false;
  }, [segmentIndex, playSegment]);

  // ── RESET SEGMENT ──
  const resetSegments = useCallback(() => {
    if (pauseIntervalRef.current) {
      clearInterval(pauseIntervalRef.current);
      pauseIntervalRef.current = null;
    }
    setSegmentIndex(0);
    setCurrentSegment(null);
  }, []);

  // ── DESTROY ──
  const destroy = useCallback(() => {
    if (pauseIntervalRef.current) {
      clearInterval(pauseIntervalRef.current);
    }
    if (player) {
      try { player.destroy(); } catch (e) { /* ignore */ }
      setPlayer(null);
      setPlayerReady(false);
    }
    setCurrentSegment(null);
    setSegmentIndex(0);
  }, [player]);

  return {
    player,
    playerReady,
    currentSegment,
    segmentIndex,
    initYoutubePlayer,
    loadVideo,
    playSegment,
    nextSegment,
    resetSegments,
    destroy,
    setSegmentIndex,
    setCurrentSegment,
  };
}
