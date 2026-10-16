import { Label, Switch } from '@librechat/client';

export const Settings = () => (
  <div className="flex w-80 flex-col gap-4">
    <div className="flex items-center justify-between">
      <Label htmlFor="s1" className="w-auto">
        Show thinking
      </Label>
      <Switch id="s1" defaultChecked />
    </div>
    <div className="flex items-center justify-between">
      <Label htmlFor="s2" className="w-auto">
        Send with Enter
      </Label>
      <Switch id="s2" />
    </div>
  </div>
);
