# Ente Mariammekku 🌸💗

A personal, mobile-first lily garden with romantic quotes and cinematic word-by-word captions.

## Open the site
**GitHub Pages:** https://jithinpatrick05.github.io/lily-garden-for-ente-Mariamma/

## Experience
- The original textured stargazer lilies remain unchanged, with additional light blooms along desktop edges.
- The supplied `assets/Lovesong.mp3` is played using the built-in HTML audio player.
- Play, pause, rewind 10 seconds, and scrub the track with the compact control dock.
- Intro and interlude quotes glide horizontally; the lyrics reveal word by word with subtle downward cinematic motion and brief phrase dissolves.
- Caption movement is driven directly by `audio.currentTime` every animation frame, rather than queued CSS transitions, so play, pause, and seeking do not accumulate visual drift.
- Respect `prefers-reduced-motion` settings; the original lily animations and mobile layouts are preserved.

## Sync notes
The supplied timestamps in `timedLrc` align lyric **lines**. Individual word times are estimated by the `WORD_PROFILES` and `getWordTimes()` functions in `index.html`. This is clock-synchronized cinematic animation, **not** a claim of verified phoneme-level forced alignment. If words in a particular line start early or late, adjust its per-word timing profile or add verified word timestamps for that recording.

Styling for the cinematic reveal is isolated in `cinematic-lyrics.css`; flower art and original backup version are unchanged.

## Original backup
A snapshot of the site before the 28 October 2026 cinematic update is stored in branch `backup/before-cinematic-lyrics-2026-10-28`.
