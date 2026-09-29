# Bytespace Interface Archive

This static bundle preserves original React components from `elnugget/bytespace`:
workspace cards, activity graphs, animated counters, output previews, workflow
analytics, run outputs and history, the sign-in form, execution demo, scheduling
calendar, trigger network, and context animation.
Exact source revisions and bundled modules are recorded in
`public/showcases/bytespace/provenance.json`.

## Rebuild

The build expects the original Bytespace checkout and the archived `portfolio-sites`
checkout (with its cmd0 and bot0 dependencies installed):

```sh
npm --prefix scripts/bytespace-showcase ci --legacy-peer-deps
node scripts/build-bytespace-showcase.mjs /path/to/bytespace /path/to/portfolio-sites
```

The resulting HTML, JavaScript, CSS, fonts, and optimized transparent artwork are
committed static assets. Neither source checkout is required at runtime.

## Isolation and Adaptations

- Original preview workspace fixtures are enriched with illustrative output data.
- Authentication actions and the service-backed workspace page are excluded.
- Sign-in fields are read-only examples; submission opens the local preview.
- Navigation is adapted locally. Account mutations and live-run controls are omitted.
- The Sales overview, expanded agents, workflow analytics and execution results
  render as separate, always-visible sections. No tab or modal hides these views.
- The analytics JSX is extracted from OwnerAgentView without its service lifecycle.
  Original WorkflowPreview, WorkflowNode, TriggerNode, RunOutputDisplay and
  LatestRunItem supply the underlying UI. Fixtures are synthetic and internally
  consistent across the graphs, cards and run history.
- Workspace pagination, reveal buttons and disconnected editing controls are
  omitted. The card row is visible from first paint rather than waiting on motion
  and layout initialization. Workflow nodes fit their measured container without
  panning, scroll capture or viewport controls.
- Images, fonts, and avatar variants are served locally. No remote favicons load.
- The iframe CSP disables network connections and form submissions.
- Tailwind 3 styles are compiled inside the iframe, isolated from the host site.
- Layout overrides support narrow screens and a light theme.
- Nine allowlisted `?view=` routes render individual studies in the host grid.
- Analytics and results load their original chart/diagram libraries through a
  separate local module, so the existing six studies do not load those libraries.
- Unframed embeds measure their content with ResizeObserver, including after hydration
  and local interaction. Same-origin messages are validated against the source frame.
- The original execution timer's captured index and unmount cleanup are corrected.
- Motion preferences are respected by the wrapper; execution can be started manually.

The original repositories are not modified by this build.
