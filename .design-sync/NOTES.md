# design-sync notes: LibreChat (@librechat/client) with the nobodywho brand

This clone is LibreChat v0.8.8-rc2, matching the image pinned in nobodywho/on-prem
(k3s/librechat/deployment.yaml). It syncs to the claude.ai/design project "LibreChat - nobodywho".

## Build
- Node 25 worked (.nvmrc says 24). Install with `npm ci`. Then run `cfg.buildCmd`: data-provider and
  client-package builds, then `.design-sync/prepare.mjs`.
- `prepare.mjs` must run again after any preview edit. Tailwind scans `.design-sync/previews/`, so
  classes used only by previews exist only after it reruns.
- The brand layer comes from the sibling `../on-prem` checkout: `k3s/librechat/branding/adapter.css`
  plus `clients/$CLIENT/brand/theme.css`, fonts and logos. `CLIENT` defaults to `nobodywho`, and
  `ON_PREM` overrides the path. It's copied into `packages/client/.ds-brand/` (gitignored) because
  `cfg.cssEntry` must sit inside the package.
- `packages/client/dist/style.css` holds only component-local CSS. The real styling is the client
  app's Tailwind build (`client/src/style.css` with `.design-sync/tailwind.config.cjs`).
- Upstream `@font-face` rules for Inter / Roboto Mono point at a Vite alias (`$fonts`), so
  prepare.mjs strips them. The brand replaces both families.
- `node_modules/crypto` is a throwing stub written by prepare.mjs. data-provider imports Node's
  `crypto` (the app gets a Vite polyfill), and no component hashes at render time.
- i18n: the app initializes i18next and the package doesn't. `.design-sync/i18n.ts`, added via
  `extraEntries`, inits English from `packages/client/src/locales/en/translation.json`. Without it,
  components render keys such as `com_ui_cancel`.

## Previews
- 38 core components have hand-written previews. All 76 icons have generated `Sizes` previews.
  Icons that ignore `size` (AssistantIcon, MCPIcon, MoonshotIcon, XAIcon) are sized by className.
  ListeningIcon also needs `stroke-current`. `*Paths` icons are fragments rendered inside
  `FileIcon`, using the colours from client/src/utils/files.ts.
- Not authored (state-driven): Toast (jotai toast atom). It ships as a floor card.
- Excluded via `componentSrcMap` (still exported from the bundle): ThemeSelector (needs the app's
  theme context) and VirtualizedDataTable (needs real data, column and virtualizer setup).
- `SecretInput`'s `label` renders after the input (floating-label design). Previews use a separate
  Label.
- The `CheckboxButton` checked look comes from `isCheckedClassName`.
- `Combobox` .d.ts extraction picked the wrong interface. The real props are in
  `cfg.dtsPropsFor.Combobox`.
- The .d.ts extractor filters @types/react props, so native HTML and Radix props are missing from
  most contracts. conventions.md tells the agent they pass through.

## Known render warns
- TooltipAnchor `[RENDER_THIN]`: icon-only anchor, and the tooltip shows only on hover.
- `[TOKENS_MISSING]` for --tw-shadow-color, --bg-surface-hover, and the Radix accordion/collapsible
  height vars: these are runtime or unused.
- `[FONT_MISSING]` for Inter, Roboto Mono, Söhne*, Andale/Ubuntu Mono: upstream CSS references
  them, but the brand adapter overrides html/body/.font-sans/.font-mono with Inter Tight and
  IBM Plex Mono, which do ship. Accepted as the brand's deliberate replacement.

## Re-sync risks
- The brand CSS is read from `../on-prem` at build time, so a brand change there needs a rebuild
  and re-sync. The LibreChat tag here must match on-prem's pinned image, so bump both together.
- adapter.css targets LibreChat v0.8.8 variable names. An upstream rename silently drops brand
  colours, so re-check the preview cards after any LibreChat bump.
- The crypto stub and i18n entry assume data-provider's and the package's current imports.
