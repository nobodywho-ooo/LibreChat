import { FormInput } from '@librechat/client';

// `field` is a react-hook-form ControllerRenderProps; a static stand-in here.
const field = (name: string, value: string) =>
  ({ name, value, onChange: () => {}, onBlur: () => {}, ref: () => {} }) as any;

export const Default = () => (
  <div className="w-80">
    <FormInput
      field={field('agentName', 'Support desk')}
      label="Agent name"
      placeholder="e.g. Support desk"
    />
  </div>
);

export const Empty = () => (
  <div className="w-80">
    <FormInput
      field={field('description', '')}
      label="Description"
      placeholder="What this agent helps with"
    />
  </div>
);
