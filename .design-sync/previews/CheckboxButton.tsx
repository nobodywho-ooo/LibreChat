import { CheckboxButton } from '@librechat/client';
import { Globe } from 'lucide-react';

// The checked look comes from isCheckedClassName (upstream passes a per-tool accent).
const checked = 'border-border-heavy bg-surface-active';

export const States = () => (
  <div className="flex gap-3">
    <CheckboxButton
      label="Web search"
      icon={<Globe className="h-4 w-4" />}
      defaultChecked
      isCheckedClassName={checked}
    />
    <CheckboxButton
      label="Web search"
      icon={<Globe className="h-4 w-4" />}
      isCheckedClassName={checked}
    />
  </div>
);
