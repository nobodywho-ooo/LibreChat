import { Tabs, TabsContent, TabsList, TabsTrigger } from '@librechat/client';

export const Settings = () => (
  <Tabs defaultValue="general" className="w-96">
    <TabsList>
      <TabsTrigger value="general">General</TabsTrigger>
      <TabsTrigger value="chat">Chat</TabsTrigger>
      <TabsTrigger value="data">Data controls</TabsTrigger>
    </TabsList>
    <TabsContent value="general" className="pt-3 text-sm text-text-primary">
      Theme, language and default model for new conversations.
    </TabsContent>
  </Tabs>
);
