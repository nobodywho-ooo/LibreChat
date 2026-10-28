import { SelectDropDown } from '@librechat/client';

export const Default = () => (
  <div className="w-72">
    <SelectDropDown
      title="Model"
      value="Qwen3 32B"
      setValue={() => {}}
      availableValues={['Qwen3 32B', 'Llama 3.3 70B', 'Mistral Small 3']}
      showLabel
    />
  </div>
);
