import { VolumeIcon } from '@librechat/client';

export const Sizes = () => (
  <div className="flex items-end gap-4 text-text-primary">
    <VolumeIcon size={16} className="text-text-primary" />
    <VolumeIcon size={24} className="text-text-primary" />
    <VolumeIcon size={32} className="text-text-primary" />
  </div>
);
