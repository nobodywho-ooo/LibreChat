import { HoverCard, HoverCardContent, HoverCardTrigger } from '@librechat/client';

export const Open = () => (
  <HoverCard open>
    <HoverCardTrigger className="text-sm text-text-primary underline">Qwen3 32B</HoverCardTrigger>
    <HoverCardContent side="bottom" align="start" className="w-72">
      <p className="text-sm font-medium text-text-primary">Qwen3 32B</p>
      <p className="mt-1 text-xs text-text-secondary">
        General-purpose model served from the on-prem GPU node. 32k context.
      </p>
    </HoverCardContent>
  </HoverCard>
);
