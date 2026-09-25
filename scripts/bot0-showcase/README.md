# bot0 Portfolio Showcase

This is a locally bundled copy of the original `Bot0TerminalShell` from
`FindKar1/portfolio-sites`, not a screenshot or a rewritten approximation.
`public/showcases/bot0/provenance.json` records the source commit and modules.

The normal portfolio build serves the committed static bundle. No monorepo
checkout or additional runtime dependency is required for deployment.

To update the bundle, use a checkout of that repository with its dependencies
installed:

```sh
node scripts/build-bot0-showcase.mjs /path/to/portfolio-sites
```

The build imports the original shell, model roster, sidebar, rich input,
status bar, and context footer. Adapters expose the shell, use plain local
images instead of Next's image runtime, and export browser-only core models.
The frame supplies the original light theme and mobile session/notebook tabs.

The iframe's content security policy blocks all connections and form
submission. No live Electron API, account, credential, or backend is supplied.
A local adapter holds model-panel settings in memory and returns an unavailable
result for live catalog lookups. Settings disappear when the iframe reloads.
Model selection, filters, input, sidebar controls, and visual feedback are
preserved; service actions are the original demo's no-op handlers.

UI copy, models, pricing, and sample research output are historical demo data,
not current service claims. The surrounding portfolio labels this explicitly.

To regenerate optimized product imagery:

```sh
node scripts/prepare-product-designs.mjs /path/to/original-images /path/to/portfolio-sites
```

The original files stay outside the public directory. The script writes WebP
previews and full-size viewer versions with their dimensions in the manifest.

The healthcare narrative artwork comes from
`apps/bytespace/public/landing/healthcare-narrative-visual.webp` in
`FindKar1/portfolio-sites` (revision `001de7f6f099d5dff01dd5ef547001d2bf4de49d`).
It is the brand illustration used in `HealthcareNarrativeSection.tsx`, not
documentation of a hospital deployment. Regenerate only this asset with:

```sh
node scripts/prepare-product-designs.mjs /path/to/original-images /path/to/portfolio-sites labs-healthcare
```
