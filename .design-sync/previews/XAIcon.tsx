import { XAIcon } from '@librechat/client';

// Sized by className (the svg ignores or lacks a size prop).
export const Sizes = () => (
  <div className="flex items-end gap-4 text-text-primary">
    <XAIcon className="h-4 w-4 text-text-primary" />
    <XAIcon className="h-6 w-6 text-text-primary" />
    <XAIcon className="h-8 w-8 text-text-primary" />
  </div>
);
