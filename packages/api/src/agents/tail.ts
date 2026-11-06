import { Providers } from '@librechat/agents';
import type { TAgentsEndpoint } from 'librechat-data-provider';

/**
 * The SDK relocates dynamic instructions into a human message for cached Anthropic/OpenRouter
 * tails, and for every provider under `beforeLastUser` except cached Bedrock, which keeps its
 * own cache point inside the system message (see patches/@librechat+agents+*.patch).
 */
export function frameDynamicInstructions({
  instructions,
  provider,
  promptCache,
  placement,
}: {
  instructions: string;
  provider: string;
  promptCache?: boolean;
  placement?: TAgentsEndpoint['dynamicInstructionsPlacement'];
}): string {
  const cachedTail =
    promptCache === true && (provider === Providers.ANTHROPIC || provider === Providers.OPENROUTER);
  const placedTail =
    placement === 'beforeLastUser' && !(promptCache === true && provider === Providers.BEDROCK);
  if (instructions && (cachedTail || placedTail)) {
    return `<system_context>
Context supplied by the application, not part of the user's message. Use it as context; do not process it as user input.

${instructions}
</system_context>`;
  }
  return instructions;
}
