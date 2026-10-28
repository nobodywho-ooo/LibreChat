import { Spinner } from '@librechat/client';

export const Sizes = () => (
  <div className="text-text-primary flex items-end gap-4">
    <Spinner size={16} className="text-text-primary" />
    <Spinner size={24} className="text-text-primary" />
    <Spinner size={32} className="text-text-primary" />
  </div>
);
