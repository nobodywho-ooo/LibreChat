# LibreChat UI, nobodywho brand

These are LibreChat's own React components (`@librechat/client`), available as `window.LibreChatClient.*`. They're styled with LibreChat's compiled Tailwind CSS and re-skinned by the nobodywho brand layer: paper/white surfaces with rust accents in light mode, ink with amber accents in dark mode. Radius is 0 everywhere and there are no shadows. Text is set in Inter Tight, and code in IBM Plex Mono. Everything is already in `styles.css`, so don't add other fonts, rounded corners or drop shadows.

## Setup

- You don't need a provider. i18n is initialized by the bundle (English), so built-in strings such as the dialogs' "Cancel" render as text.
- To switch to dark mode, add the `dark` class to `<html>` (`document.documentElement.classList.add('dark')`). The brand tokens switch with it.
- Don't wrap in `ThemeProvider`. It writes LibreChat's stock theme as inline CSS variables, which override the brand.
- Overlays (`OGDialog`, `AlertDialog`, `DropdownMenu`, `Select`, `HoverCard`) are Radix primitives. Control them with `open` / `onOpenChange`.
- HTML and Radix props (`placeholder`, `value`, `disabled`, `onClick`, `onCheckedChange`, `onValueChange`, `type`, ...) pass through to the underlying element, although each `<Name>.d.ts` lists only the component's own props.

## Styling: semantic Tailwind classes

Use LibreChat's semantic utilities. The brand maps all of them, so never hard-code hex values or Tailwind's grey/green palette.

| Purpose | Classes |
|---|---|
| Page and panel backgrounds | `bg-presentation` (main), `bg-surface-primary-alt` (sidebar), `bg-surface-secondary`, `bg-surface-tertiary`, `bg-surface-dialog`, `bg-surface-chat` |
| Hover and selected states | `hover:bg-surface-hover`, `bg-surface-active`, `bg-surface-active-alt` |
| Primary action | `bg-surface-submit` + `text-text-on-status` (rust in light mode, amber in dark), or `<Button variant="submit">` |
| Accent | `bg-accent-primary`, `text-accent-primary` |
| Text | `text-text-primary`, `text-text-secondary`, `text-text-tertiary`, `text-link` |
| Borders | `border-border-light`, `border-border-medium`, `border-border-heavy`, `border-border-xheavy` |
| Status | `<Alert variant>` / `<Tag variant>` / `<Chip tone>` with `info`, `success`, `warning`, `error` or `neutral` |

Use ordinary Tailwind layout utilities (`flex`, `gap-*`, `p-*`, `w-*`) for layout glue. The raw tokens are CSS variables holding RGB triplets, so use them as `rgb(var(--surface-primary))` or `rgb(var(--brand-accent))`, never bare.

## Where the truth lives

- `styles.css` imports `fonts/fonts.css` and `_ds_bundle.css`. The bundle CSS is LibreChat's Tailwind build, followed by the brand adapter (`--brand-*` mapped onto LibreChat variables) and the nobodywho `theme.css`. Read its `html:root` / `html.dark` blocks before choosing colours.
- Each component's API is in `components/<group>/<Name>/<Name>.d.ts`. Usage examples are in `<Name>.prompt.md`.

## Main components

`Button` (variants: `default`, `submit`, `outline`, `secondary`, `ghost`, `destructive`, `link`), `IconButton`, `Input`, `Textarea`, `Label`, `Checkbox`, `Switch`, `Radio`, `Slider`, `Select*`, `Dropdown`, `DropdownMenu*`, `Tabs*`, `Accordion*`, `OGDialog*` and `OGDialogTemplate` (the app's dialogs), `AlertDialog*`, `Table*`, `Tag`, `Chip`, `Alert`, `EmptyState`, `Avatar`, `Progress`, `Skeleton`, `TooltipAnchor`, plus 76 icons (`SendIcon`, `NewChatIcon`, `Spinner`, …).

```jsx
const { OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle, OGDialogDescription,
  OGDialogFooter, Button } = window.LibreChatClient;

<OGDialog open>
  <OGDialogContent className="w-11/12 max-w-md">
    <OGDialogHeader>
      <OGDialogTitle>Archive conversation?</OGDialogTitle>
      <OGDialogDescription>You can restore it from Settings at any time.</OGDialogDescription>
    </OGDialogHeader>
    <OGDialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="submit">Archive</Button>
    </OGDialogFooter>
  </OGDialogContent>
</OGDialog>
```
