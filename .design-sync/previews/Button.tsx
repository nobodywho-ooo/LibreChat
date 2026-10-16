import { Button } from '@librechat/client';

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button>New chat</Button>
    <Button variant="submit">Save changes</Button>
    <Button variant="outline">Cancel</Button>
    <Button variant="secondary">Export</Button>
    <Button variant="ghost">Skip</Button>
    <Button variant="destructive">Delete conversation</Button>
    <Button variant="link">Learn more</Button>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button size="sm" variant="outline">
      Small
    </Button>
    <Button variant="outline">Default</Button>
    <Button size="lg" variant="outline">
      Large
    </Button>
  </div>
);

export const Disabled = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Button disabled>Sending…</Button>
    <Button variant="submit" disabled>
      Save changes
    </Button>
  </div>
);
