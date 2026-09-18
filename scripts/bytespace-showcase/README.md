# Bytespace Interface Archive

This static bundle preserves original React components from `elnugget/bytespace`:
workspace cards, activity graphs, animated counters, output previews, the sign-in
form, execution demo, scheduling calendar, trigger network, and context animation.
Exact source revisions and bundled modules are recorded in
`public/showcases/bytespace/provenance.json`.

## Rebuild

The build expects the original Bytespace checkout and the archived `portfolio-sites`
checkout (with its cmd0 and bot0 dependencies installed):

```sh
npm --prefix scripts/bytespace-showcase ci
node scripts/build-bytespace-showcase.mjs /path/to/bytespace /path/to/portfolio-sites
```

The resulting HTML, JavaScript, CSS, fonts, and optimized transparent artwork are
committed static assets. Neither source checkout is required at runtime.

## Isolation and Adaptations

- Original preview workspace fixtures are enriched with illustrative output data.
- Authentication actions and the service-backed workspace page are excluded.
- Sign-in fields are read-only examples; submission opens the local preview.
- Navigation is adapted locally. Account mutations and live-run controls are omitted.
- Table and summary buttons open local sample output dialogs.
- Images, fonts, and avatar variants are served locally. No remote favicons load.
- The iframe CSP disables network connections and form submissions.
- Tailwind 3 styles are compiled inside the iframe, isolated from the host site.
- Layout overrides support narrow screens and a light theme.
- Six allowlisted `?view=` routes render individual studies in the host page's bento grid.
- Unframed embeds measure their content with ResizeObserver, including after hydration
  and local interaction. Same-origin messages are validated against the source frame.
- The original execution timer's captured index and unmount cleanup are corrected.
- Motion preferences are respected by the wrapper; execution can be started manually.

The original repositories are not modified by this build.
