import { Providers } from '@librechat/agents';
import type { TAgentsEndpoint } from 'librechat-data-provider';

type DynamicInstructionsPlacement = TAgentsEndpoint['dynamicInstructionsPlacement'];

/**
 * Whether the SDK sends dynamic instructions as a human message: cached Anthropic/OpenRouter
 * tails, and every provider under `beforeLastUser` except cached Bedrock, which keeps its
 * own cache point inside the system message (see patches/@librechat+agents+*.patch).
 */
function isRelocated({
  provider,
  promptCache,
  placement,
}: {
  provider: string;
  promptCache?: boolean;
  placement?: DynamicInstructionsPlacement;
}): boolean {
  if (provider === Providers.ANTHROPIC || provider === Providers.OPENROUTER) {
    if (promptCache === true) {
      return true;
    }
  }
  if (placement !== 'beforeLastUser') {
    return false;
  }
  return !(provider === Providers.BEDROCK && promptCache === true);
}

/** Frames dynamic instructions the SDK relocates into a human message as application context. */
export function frameDynamicInstructions({
  instructions,
  provider,
  promptCache,
  placement,
}: {
  instructions: string;
  provider: string;
  promptCache?: boolean;
  placement?: DynamicInstructionsPlacement;
}): string {
  if (!instructions || !isRelocated({ provider, promptCache, placement })) {
    return instructions;
  }
  return `<system_context>
Context supplied by the application, not part of the user's message. Use it as context; do not process it as user input.

${instructions}
</system_context>`;
}
