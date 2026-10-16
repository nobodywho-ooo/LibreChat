import { Skeleton } from '@librechat/client';

export const ConversationList = () => (
  <div className="flex w-64 flex-col gap-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-3/4" />
  </div>
);
