import { Sidebar } from '@librechat/client';

export const Sizes = () => (
  <div className="flex items-end gap-4 text-text-primary">
    <Sidebar size={16} className="text-text-primary" />
    <Sidebar size={24} className="text-text-primary" />
    <Sidebar size={32} className="text-text-primary" />
  </div>
);
