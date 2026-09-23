# Original Cmd0 Hero

This standalone bundle preserves the light-mode Cmd0 homepage artwork and animation above the Chrome Extension desktop demo. It is separate from the six UI study bundles so those frames do not download the hero's artwork or React Flow runtime.

Rebuild from the original local checkout:

```sh
node scripts/build-bytespace-hero.mjs /path/to/portfolio-sites
```

The build uses the archived app's existing dependencies, extracts the builder JSX from `TitleSectionNew.tsx`, and imports its original `MountainScene`, React Flow renderer, workflow fixture, and positioning JSON. Artwork is copied without resizing or recompression. `provenance.json` records source and asset hashes.

The host scales a 1280px desktop composition as one unit, including on mobile. A 32px top inset preserves the mountain peaks. Marketing text, signup controls and the rest of the original homepage are excluded. The original mountain, squad and node timings remain unchanged; the builder enters at 1.6 seconds. Replay remounts the original scene.

The iframe is only loaded when the section enters view. Same-origin, source-checked messages start the entrance and pause the builder's CSS animations offscreen or in a hidden tab. Reduced-motion preferences skip the original entrance and disable moving connections. CSP blocks network connections and forms. No production accounts or services are connected.

The original preload helper references legacy PNGs, including an unused nonexistent third squad phase. The adapter instead preloads the two WebP layers actually rendered. The workflow preview's delayed viewport setter is cleaned up on unmount, and debug logs are omitted.
