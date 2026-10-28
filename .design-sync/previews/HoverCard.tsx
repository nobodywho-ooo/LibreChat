import { HoverCard, HoverCardContent, HoverCardTrigger } from '@librechat/client';

export const Open = () => (
  <HoverCard open>
    <HoverCardTrigger className="text-text-primary text-sm underline">Qwen3 32B</HoverCardTrigger>
    <HoverCardContent side="bottom" align="start" className="w-72">
      <p className="text-text-primary text-sm font-medium">Qwen3 32B</p>
      <p className="text-text-secondary mt-1 text-xs">
        General-purpose model served from the on-prem GPU node. 32k context.
      </p>
    </HoverCardContent>
  </HoverCard>
);
