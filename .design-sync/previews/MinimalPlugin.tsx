import { MinimalPlugin } from '@librechat/client';

export const Sizes = () => (
  <div className="flex items-end gap-4 text-text-primary">
    <MinimalPlugin size={16} className="text-text-primary" />
    <MinimalPlugin size={24} className="text-text-primary" />
    <MinimalPlugin size={32} className="text-text-primary" />
  </div>
);
