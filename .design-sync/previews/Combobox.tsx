import { Combobox } from '@librechat/client';

export const Default = () => (
  <div className="w-72">
    <Combobox
      ariaLabel="Language"
      selectedValue="English"
      items={['English', 'Čeština', 'Deutsch', 'Français']}
      setValue={() => {}}
      searchPlaceholder="Search languages"
      selectPlaceholder="Select a language"
      isCollapsed={false}
    />
  </div>
);
