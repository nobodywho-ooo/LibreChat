import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@librechat/client';

const models = (
  <SelectContent>
    <SelectItem value="qwen">Qwen3 32B</SelectItem>
    <SelectItem value="llama">Llama 3.3 70B</SelectItem>
    <SelectItem value="mistral">Mistral Small 3</SelectItem>
  </SelectContent>
);

export const Closed = () => (
  <Select defaultValue="qwen">
    <SelectTrigger className="w-64">
      <SelectValue />
    </SelectTrigger>
    {models}
  </Select>
);

export const Open = () => (
  <Select defaultValue="qwen" open>
    <SelectTrigger className="w-64">
      <SelectValue />
    </SelectTrigger>
    {models}
  </Select>
);
