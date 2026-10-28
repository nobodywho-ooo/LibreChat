import { Dropdown } from '@librechat/client';

export const Default = () => (
  <div className="w-64">
    <Dropdown
      label="Sort by: "
      value="updated"
      onChange={() => {}}
      options={[
        { value: 'updated', label: 'Last updated' },
        { value: 'created', label: 'Date created' },
        { value: 'title', label: 'Title' },
      ]}
    />
  </div>
);
