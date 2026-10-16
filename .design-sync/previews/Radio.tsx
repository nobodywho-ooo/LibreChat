import { Radio } from '@librechat/client';

const options = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export const Default = () => <Radio options={options} value="light" />;

export const FullWidth = () => (
  <div className="w-96">
    <Radio options={options} value="system" fullWidth />
  </div>
);
