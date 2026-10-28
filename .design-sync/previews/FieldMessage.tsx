import { FieldMessage, Input, Label } from '@librechat/client';

export const Hint = () => (
  <div className="flex w-80 flex-col gap-2">
    <Label htmlFor="n1">Agent name</Label>
    <Input id="n1" aria-describedby="m1" defaultValue="Support desk" />
    <FieldMessage id="m1" hint="Shown in the model picker." />
  </div>
);

export const Error = () => (
  <div className="flex w-80 flex-col gap-2">
    <Label htmlFor="n2">Agent name</Label>
    <Input id="n2" aria-invalid aria-describedby="m2" defaultValue="" />
    <FieldMessage id="m2" message="Name is required." />
  </div>
);
