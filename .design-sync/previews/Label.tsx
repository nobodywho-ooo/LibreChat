import { Input, Label } from '@librechat/client';

export const Variants = () => (
  <div className="flex w-80 flex-col gap-4">
    <Label variant="section">Model parameters</Label>
    <div className="flex flex-col gap-2">
      <Label htmlFor="max-tokens">Max output tokens</Label>
      <Input id="max-tokens" defaultValue="4096" />
    </div>
  </div>
);
