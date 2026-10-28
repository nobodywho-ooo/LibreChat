import { Clipboard } from '@librechat/client';

export const Sizes = () => (
  <div className="text-text-primary flex items-end gap-4">
    <Clipboard size={16} className="text-text-primary" />
    <Clipboard size={24} className="text-text-primary" />
    <Clipboard size={32} className="text-text-primary" />
  </div>
);
