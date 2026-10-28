import { AnimatedTabs } from '@librechat/client';

// Tab spacing comes from the caller (upstream passes tabClassName too).
export const Default = () => (
  <div className="w-96">
    <AnimatedTabs
      tabListClassName="flex items-center gap-4 border-b border-border-light"
      tabClassName="px-1 pb-2 pt-1 text-sm text-text-secondary"
      tabPanelClassName="pt-3 text-sm text-text-primary"
      tabs={[
        { id: 'files', label: 'Files', content: '12 files attached to this assistant.' },
        { id: 'prompts', label: 'Prompts', content: 'Saved prompts' },
        { id: 'memories', label: 'Memories', content: 'Memories' },
      ]}
    />
  </div>
);
