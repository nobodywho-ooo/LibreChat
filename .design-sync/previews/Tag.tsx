import { Tag } from '@librechat/client';

export const Variants = () => (
  <div className="flex flex-wrap gap-2">
    <Tag label="Neutral" variant="neutral" />
    <Tag label="Info" variant="info" />
    <Tag label="Ready" variant="success" />
    <Tag label="Quota low" variant="warning" />
    <Tag label="Failed" variant="error" />
  </div>
);

export const Removable = () => (
  <div className="flex flex-wrap gap-2">
    <Tag label="finance" onRemove={() => {}} />
    <Tag label="q3-planning" onRemove={() => {}} />
  </div>
);
