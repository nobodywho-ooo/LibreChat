import { Label, SecretInput } from '@librechat/client';

// `label` renders after the input (meant for floating-label styling), so a
// plain stacked field uses a separate Label.
export const ApiKey = () => (
  <div className="flex w-96 flex-col gap-2">
    <Label htmlFor="api-key">API key</Label>
    <SecretInput id="api-key" defaultValue="sk-nbw-4f9a2c7e1b8d" showCopy />
  </div>
);
