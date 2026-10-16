import { Button, EmptyState } from '@librechat/client';
import { Archive, SearchX } from 'lucide-react';

export const NoItems = () => (
  <div className="w-96">
    <EmptyState
      icon={Archive}
      title="No archived chats"
      description="Conversations you archive will show up here."
    />
  </div>
);

export const WithAction = () => (
  <div className="w-96">
    <EmptyState
      icon={SearchX}
      title="Couldn't load files"
      description="The file service didn't respond."
      action={<Button variant="outline">Retry</Button>}
    />
  </div>
);
