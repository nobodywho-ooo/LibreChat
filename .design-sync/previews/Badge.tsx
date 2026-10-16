import { Badge } from '@librechat/client';
import { Globe, Code, Image } from 'lucide-react';

export const ComposerBadges = () => (
  <div className="flex gap-2">
    <Badge label="Web search" icon={Globe} isAvailable isActive />
    <Badge label="Code" icon={Code} isAvailable />
    <Badge label="Images" icon={Image} isAvailable={false} />
  </div>
);
