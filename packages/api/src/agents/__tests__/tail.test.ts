import { Providers } from '@librechat/agents';
import { frameDynamicInstructions } from '~/agents/tail';

const frame = (
  provider: string,
  promptCache?: boolean,
  placement?: 'system' | 'beforeLastUser',
): string => frameDynamicInstructions({ instructions: 'TIME', provider, promptCache, placement });

const isFramed = (text: string) => text.startsWith('<system_context>') && text.includes('TIME');

describe('frameDynamicInstructions', () => {
  it('frames cached Anthropic and OpenRouter tails', () => {
    expect(isFramed(frame(Providers.ANTHROPIC, true))).toBe(true);
    expect(isFramed(frame(Providers.OPENROUTER, true))).toBe(true);
  });

  it('leaves system-message instructions unframed by default', () => {
    expect(frame(Providers.ANTHROPIC, false)).toBe('TIME');
    expect(frame(Providers.OPENAI)).toBe('TIME');
    expect(frame(Providers.OPENAI, undefined, 'system')).toBe('TIME');
  });

  it('frames every provider the beforeLastUser placement relocates', () => {
    expect(isFramed(frame(Providers.OPENAI, undefined, 'beforeLastUser'))).toBe(true);
    expect(isFramed(frame(Providers.ANTHROPIC, false, 'beforeLastUser'))).toBe(true);
    expect(isFramed(frame(Providers.BEDROCK, false, 'beforeLastUser'))).toBe(true);
  });

  it('keeps cached Bedrock unframed, since its tail stays in the system message', () => {
    expect(frame(Providers.BEDROCK, true, 'beforeLastUser')).toBe('TIME');
  });

  it('returns empty instructions unchanged', () => {
    expect(
      frameDynamicInstructions({
        instructions: '',
        provider: Providers.OPENAI,
        placement: 'beforeLastUser',
      }),
    ).toBe('');
  });
});
