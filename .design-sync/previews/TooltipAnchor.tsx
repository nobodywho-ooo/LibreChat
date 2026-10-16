import { TooltipAnchor } from '@librechat/client';
import { Paperclip } from 'lucide-react';

// The tooltip itself shows on hover; the static card shows the anchor.
export const Anchor = () => (
  <TooltipAnchor
    description="Attach files"
    render={
      <button
        type="button"
        aria-label="Attach files"
        className="flex size-9 items-center justify-center rounded-full text-text-primary hover:bg-surface-hover"
      >
        <Paperclip className="h-5 w-5" />
      </button>
    }
  />
);
