import { SegmentedMeter } from '@librechat/client';

export const Storage = () => (
  <div className="w-96">
    <SegmentedMeter
      max={100}
      segments={[
        { id: 'files', value: 42, slot: 1 },
        { id: 'images', value: 18, slot: 2 },
        { id: 'archived', value: 9, slot: 3, hatched: true },
      ]}
    />
  </div>
);
