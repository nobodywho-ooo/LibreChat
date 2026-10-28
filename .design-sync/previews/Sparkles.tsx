import { Sparkles } from '@librechat/client';

export const Sizes = () => (
  <div className="text-text-primary flex items-end gap-4">
    <Sparkles size={16} className="text-text-primary" />
    <Sparkles size={24} className="text-text-primary" />
    <Sparkles size={32} className="text-text-primary" />
  </div>
);
