import { Chip } from '@librechat/client';

export const Tones = () => (
  <div className="flex flex-wrap gap-2">
    <Chip tone="neutral">Draft</Chip>
    <Chip tone="info">Shared</Chip>
    <Chip tone="success">Indexed</Chip>
    <Chip tone="warning">Pending</Chip>
    <Chip tone="error">Expired</Chip>
  </div>
);

export const Removable = () => (
  <div className="flex flex-wrap gap-2">
    <Chip onRemove={() => {}} removeLabel="Remove file">
      report.pdf
    </Chip>
    <Chip onRemove={() => {}} removeLabel="Remove file" shape="round">
      notes.md
    </Chip>
  </div>
);
