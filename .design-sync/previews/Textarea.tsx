import { Label, Textarea } from '@librechat/client';

export const Default = () => (
  <div className="flex w-96 flex-col gap-2">
    <Label htmlFor="custom-instructions">Custom instructions</Label>
    <Textarea
      id="custom-instructions"
      rows={4}
      defaultValue="Answer in British English. Keep replies short and cite the internal wiki when you can."
    />
  </div>
);

export const Placeholder = () => (
  <div className="flex w-96 flex-col gap-2">
    <Label htmlFor="feedback">Feedback</Label>
    <Textarea id="feedback" rows={3} placeholder="What could the answer have done better?" />
  </div>
);
