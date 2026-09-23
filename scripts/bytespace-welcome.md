# Original Signup Welcome

`WelcomeMessage.tsx` in the original Bytespace signup flow defines the 8 x 8
pixel-letter patterns, 120 x 120 grid, per-pixel reveal order, and fade-out.
`AccessCodeCard.tsx` calls it with a 2,600 ms reveal, followed by a 1,400 ms hold
and 500 ms exit. The native monitor component preserves that sequence without
bringing signup, authentication, or Framer Motion into the personal site.

Import the original letter patterns, with source revision and SHA-256:

```sh
node scripts/import-bytespace-welcome.mjs /path/to/bytespace
```

The source checkout renamed the final line to `cmd0!`; the original letter set
still includes every character in `Bytespace!`, restored here as requested.
The original 1px lettering gutters are scaled proportionally to a 1200 x 675
monitor so lettering survives smaller screens.

The backdrop adapts `magicui/flickering-grid.tsx`, using the signup flow's 4px
squares, 1px gap, 0.3 flicker chance, and 0.2 maximum opacity. The source checkout
uses indigo squares on a near-black navy background; this version uses neutral
gray squares on black as requested. The canvas sizes to the monitor, pauses with
the intro, and releases its animation and resize observer when the demo begins.
The importer records hashes for both the grid source and signup configuration.
The monitor and video retain black backgrounds, including the letterboxing.

The intro starts when 60% of the monitor is visible and pauses offscreen or in
a hidden tab. Document-scoped memory preserves its progress through in-app
navigation, and prevents a completed intro from replaying. A full reload creates
a new visit. Reduced-motion visitors skip to the demo poster and native controls.
The demo's native loop never calls or resets the intro.
