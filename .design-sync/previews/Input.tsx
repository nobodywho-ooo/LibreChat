import { Input, Label } from '@librechat/client';

export const WithLabel = () => (
  <div className="flex w-80 flex-col gap-2">
    <Label htmlFor="display-name">Display name</Label>
    <Input id="display-name" defaultValue="Ada Lovelace" />
  </div>
);

export const Placeholder = () => (
  <div className="flex w-80 flex-col gap-2">
    <Label htmlFor="search-chats">Search conversations</Label>
    <Input id="search-chats" placeholder="Search by title or message…" />
  </div>
);

export const Disabled = () => (
  <div className="flex w-80 flex-col gap-2">
    <Label htmlFor="api-endpoint">Endpoint URL</Label>
    <Input id="api-endpoint" disabled defaultValue="http://vllm.chat.svc:8000/v1" />
  </div>
);
