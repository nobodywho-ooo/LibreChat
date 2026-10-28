import { ListeningIcon } from '@librechat/client';

// Sized and stroked by className: the svg has no size prop and no stroke of its own.
export const Sizes = () => (
  <div className="text-text-primary flex items-end gap-4">
    <ListeningIcon className="text-text-primary h-4 w-4 stroke-current" />
    <ListeningIcon className="text-text-primary h-6 w-6 stroke-current" />
    <ListeningIcon className="text-text-primary h-8 w-8 stroke-current" />
  </div>
);
