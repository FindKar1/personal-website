# Bytespace Marketplace Archive

Rebuild from the original read-only Bytespace and portfolio-sites checkouts:

```sh
npm --prefix scripts/bytespace-marketplace ci
node scripts/build-bytespace-marketplace.mjs /path/to/bytespace /path/to/portfolio-sites
```

The build also uses the installed cmd0/bot0 dependencies and existing
`scripts/bytespace-showcase` tools, plus ffmpeg for video poster extraction.
The generated static bundle is committed with the site; source checkouts are
not needed at runtime. Its provenance records the source revisions and files.

## Preserved Components

- AgentCardBase: hover-video marketplace cards, app badges, keyboard activation.
- PixelBlast and VideoBackground: original light-mode pixels and floating logos.
- CardDetails, WorkflowPreview and AgentRunSettings: media, workflow, input and
  output previews, local configuration. Connected-app pulses use AnimatedBeam.
- QuickWinAgentCards and ElectricBorder: first-agent onboarding and original
  animated border, alongside the original allAgentsMarketplace film.
- ActionCardsGrid: the original pickaxe/builder entry card, character film and
  workflow preview. It opens the archived film locally instead of the store.

## Adaptations

- Listings, app combinations and table results are explicitly illustrative.
  Names draw on original preview-workspace roles. Archived browser clips and
  the original landing workflow are examples, not the original listing data.
- No creator identities, usage metrics, account actions, signup, or backend calls.
  Input configuration opens example output; it does not run an agent.
- CSP disables network connections and forms. Fonts, icons, images and videos
  are local. Existing bytespace-motion assets are reused without duplicating them.
- The host uses a native dialog for details, source-validated messages, a
  responsive horizontal card rail on mobile, and a motion pause control.
- The original global scroll trigger is removed from the floating background.
  Workflow scroll-wheel capture is disabled; explicit zoom controls remain.
- Offscreen/hidden-tab/reduced-motion media pause. PixelBlast only mounts when
  its header is visible and motion is enabled. GSAP pauses with the exhibit.
- Full detail/workflow and WebGL code are split into on-demand chunks.
- Builder card code loads near its own viewport and pauses offscreen. The
  first-agent description uses a company brief example; its artwork, layout,
  animation and input behavior are unchanged.
- The first-agent film and its electric border loop continuously while visible.
  Other featured films play once on first entering view, then hold a still frame.
  Hover or keyboard focus loops a preview; explicit replay supports touch.
  Browse Marketplace and Agent Builder reset to their opening image when hover
  and keyboard focus leave, without restarting the automatic first pass.
  Listing cards only animate on hover/focus. All previews pause offscreen.
  The host pause control also disables replay; with reduced motion enabled,
  visitors can explicitly enable motion using that same control.
- Floating logos and pixels only animate while their header is visible.

The two source repositories are never edited by this build.
