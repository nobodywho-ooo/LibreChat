import { Separator } from '@librechat/client';

export const Horizontal = () => (
  <div className="w-80 text-sm text-text-primary">
    <p>Account</p>
    <Separator className="my-3" />
    <p>Data controls</p>
  </div>
);

export const Vertical = () => (
  <div className="flex h-6 items-center gap-3 text-sm text-text-primary">
    <span>Copy</span>
    <Separator orientation="vertical" />
    <span>Regenerate</span>
    <Separator orientation="vertical" />
    <span>Share</span>
  </div>
);
