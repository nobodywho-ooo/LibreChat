import { Plugin } from '@librechat/client';

export const Sizes = () => (
  <div className="text-text-primary flex items-end gap-4">
    <Plugin size={16} className="text-text-primary" />
    <Plugin size={24} className="text-text-primary" />
    <Plugin size={32} className="text-text-primary" />
  </div>
);
