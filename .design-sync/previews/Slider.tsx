import { Label, Slider } from '@librechat/client';

export const Temperature = () => (
  <div className="flex w-80 flex-col gap-3">
    <div className="flex justify-between">
      <Label className="w-auto">Temperature</Label>
      <span className="text-text-secondary text-sm">0.7</span>
    </div>
    <Slider defaultValue={[0.7]} min={0} max={2} step={0.1} />
  </div>
);
