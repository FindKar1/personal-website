# Bytespace Video Wall

The video wall is adapted from Cmd0's `VirtualBrowsersSection.tsx` and the
`integration-marquee` animation in its global stylesheet. All 20 agent clips,
nine browser demos, and their original posters are copied without re-encoding.
The asset manifest records their SHA-256 hashes and source revision.

Refresh assets from the local source repository:

```sh
node scripts/import-bytespace-motion.mjs /path/to/portfolio-sites
```

The native component preserves the original 7/7/6 agent distribution, alternating
demo sequence, light-mode tile dimensions, responsive spacing, edge fades, and
60-second alternating marquee. Landing-page headers and offsets are omitted.
Two equal groups include their trailing gap to avoid a jump at the loop boundary.

Playback is muted and viewport-gated, with reduced-motion, hidden-tab, and manual
pause support. Sources are attached only as tiles become visible. Original agent
MP4s provide a fallback; duplicated tiles share cacheable URLs, unlike the source
site's per-tile cache-busting query strings. There are no connected services.
