import { ListeningIcon } from '@librechat/client';

// Sized and stroked by className: the svg has no size prop and no stroke of its own.
export const Sizes = () => (
  <div className="flex items-end gap-4 text-text-primary">
    <ListeningIcon className="h-4 w-4 stroke-current text-text-primary" />
    <ListeningIcon className="h-6 w-6 stroke-current text-text-primary" />
    <ListeningIcon className="h-8 w-8 stroke-current text-text-primary" />
  </div>
);
