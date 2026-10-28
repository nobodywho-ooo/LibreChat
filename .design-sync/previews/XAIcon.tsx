import { XAIcon } from '@librechat/client';

// Sized by className (the svg ignores or lacks a size prop).
export const Sizes = () => (
  <div className="text-text-primary flex items-end gap-4">
    <XAIcon className="text-text-primary h-4 w-4" />
    <XAIcon className="text-text-primary h-6 w-6" />
    <XAIcon className="text-text-primary h-8 w-8" />
  </div>
);
