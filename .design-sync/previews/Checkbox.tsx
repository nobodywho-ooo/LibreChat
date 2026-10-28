import { Checkbox, Label } from '@librechat/client';

export const States = () => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <Checkbox id="c1" defaultChecked />
      <Label htmlFor="c1">Save chat history</Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="c2" />
      <Label htmlFor="c2">Share usage statistics</Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="c3" checked="indeterminate" />
      <Label htmlFor="c3">Select all conversations</Label>
    </div>
  </div>
);
