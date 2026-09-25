# Healthcare animations

The two views reuse the original `PixelatedCanvas` and `HeroChipScene` from
the Bytespace healthcare homepage in one layered composition. The pixel field
fills the width behind a centered DNA helix on desktop and mobile.
Its responsive canvas height keeps pixels square.
Rebuild from the source checkout with its
dependencies installed.

```sh
node scripts/build-healthcare-motion.mjs /path/to/portfolio-sites
```

The build preserves the original DNA geometry, lighting and particle animation.
It locks the original field to its DNA preview mode, with no protein or compute
transitions. The group starts centered and the fixed DNA camera fills the frame
vertically with a small clearance. A replacement scene
wrapper removes the homepage scroll cutoff and uses parent visibility messages
instead. Each frame stops work offscreen, respects reduced motion, and responds
to pointer movement only within its own bounds. Reduced motion shows the helix
without a continuous render loop. The pixel view becomes a static rendering.

The iframe bundle is split so the pixel view does not load Three.js. It has no
service connections. Source hashes and the unchanged image hash are recorded in
`public/showcases/healthcare-motion/provenance.json`.
