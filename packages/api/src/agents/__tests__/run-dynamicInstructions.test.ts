import path from 'path';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import type { BaseMessage } from '@langchain/core/messages';
import type { AppConfig } from '@librechat/data-schemas';
import type { AgentInputs } from '@librechat/agents';
import { createRun } from '~/agents/run';

/**
 * Guards `endpoints.agents.dynamicInstructionsPlacement`: `createRun` must pass it to
 * every agent input, and the patched `@librechat/agents` (patches/@librechat+agents+*.patch)
 * must honor it. The second block runs the real, patched AgentContext, so it fails if
 * the patch is dropped or no longer applies.
 */

jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  })),
  format: Object.assign(
    jest.fn((fn) => () => ({ transform: fn })),
    {
      combine: jest.fn(),
      colorize: jest.fn(),
      simple: jest.fn(),
      label: jest.fn(),
      timestamp: jest.fn(),
      printf: jest.fn(),
      errors: jest.fn(),
      splat: jest.fn(),
      json: jest.fn(),
    },
  ),
  addColors: jest.fn(),
  transports: { Console: jest.fn(), DailyRotateFile: jest.fn(), File: jest.fn() },
}));

jest.mock('@librechat/data-schemas', () => ({
  ...jest.requireActual('@librechat/data-schemas'),
  logger: { debug: jest.fn(), warn: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

jest.mock('@librechat/agents', () => {
  const actual = jest.requireActual('@librechat/agents');
  return {
    ...actual,
    Run: {
      create: jest.fn().mockResolvedValue({
        processStream: jest.fn().mockResolvedValue(undefined),
      }),
    },
  };
});

jest.mock('~/agents/checkpointer', () => ({
  getAgentCheckpointer: jest.fn().mockResolvedValue({}),
}));

import { Run } from '@librechat/agents';

type Placement = AgentInputs['dynamicInstructionsPlacement'];

function makeAgent() {
  return {
    id: 'agent_1',
    provider: 'openAI',
    endpoint: 'openAI',
    model: 'gpt-4o',
    tools: [],
    model_parameters: { model: 'gpt-4o' },
    maxContextTokens: 100_000,
    toolContextMap: {},
    instructions: 'Stable instructions.',
    additional_instructions: 'The time is now.',
  };
}

async function captureAgentInputs(appConfig?: AppConfig): Promise<AgentInputs[]> {
  await createRun({
    agents: [makeAgent()] as never,
    signal: new AbortController().signal,
    streaming: true,
    streamUsage: true,
    appConfig,
  });
  const runConfig = (Run.create as jest.Mock).mock.calls[0][0] as {
    graphConfig: { agents: AgentInputs[] };
  };
  return runConfig.graphConfig.agents;
}

describe('createRun dynamicInstructionsPlacement', () => {
  beforeEach(() => jest.clearAllMocks());

  it('passes the configured placement to the agent input', async () => {
    const appConfig = {
      endpoints: { agents: { dynamicInstructionsPlacement: 'beforeLastUser' } },
    } as unknown as AppConfig;

    const [input] = await captureAgentInputs(appConfig);

    expect(input.dynamicInstructionsPlacement).toBe('beforeLastUser');
    expect(input.additional_instructions).toContain('The time is now.');
  });

  it('leaves the placement unset by default', async () => {
    const [input] = await captureAgentInputs();

    expect(input.dynamicInstructionsPlacement).toBeUndefined();
  });
});

/** The subset of the (unexported) AgentContext this test drives. */
interface AgentContextLike {
  systemRunnable?: { invoke: (messages: BaseMessage[]) => Promise<BaseMessage[]> };
}
interface AgentContextModule {
  AgentContext: { fromConfig: (inputs: AgentInputs) => AgentContextLike };
}

/** AgentContext is not exported from the package entry, so load the built module
 *  next to it; jest.mock above only replaces the entry point, not this file. */
function loadAgentContext(): AgentContextModule['AgentContext'] {
  const entry = require.resolve('@librechat/agents');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require(
    path.join(path.dirname(entry), 'agents/AgentContext.cjs'),
  ) as AgentContextModule;
  return mod.AgentContext;
}

async function render(
  placement: Placement,
  instructions: string,
  history: BaseMessage[],
): Promise<string[]> {
  const AgentContext = loadAgentContext();
  const context = AgentContext.fromConfig({
    agentId: 'agent_1',
    provider: 'openAI',
    clientOptions: {},
    instructions,
    additional_instructions: 'TIME',
    dynamicInstructionsPlacement: placement,
  } as AgentInputs);
  const messages = (await context.systemRunnable?.invoke(history)) ?? [];
  return messages.map((message) => `${message.getType()}: ${String(message.content)}`);
}

describe('patched @librechat/agents dynamic instruction placement', () => {
  const history = () => [
    new HumanMessage('user 1'),
    new AIMessage('assistant 1'),
    new HumanMessage('user 2'),
  ];

  it('appends dynamic instructions to the system message by default', async () => {
    expect(await render(undefined, 'STABLE', history())).toEqual([
      'system: STABLE\n\nTIME',
      'human: user 1',
      'ai: assistant 1',
      'human: user 2',
    ]);
  });

  it('sends them before the latest user message with beforeLastUser', async () => {
    expect(await render('beforeLastUser', 'STABLE', history())).toEqual([
      'system: STABLE',
      'human: user 1',
      'ai: assistant 1',
      'human: TIME',
      'human: user 2',
    ]);
  });

  it('omits the system message when there are no stable instructions', async () => {
    expect(await render('beforeLastUser', '', history())).toEqual([
      'human: user 1',
      'ai: assistant 1',
      'human: TIME',
      'human: user 2',
    ]);
    expect(await render('beforeLastUser', '', [new HumanMessage('user 1')])).toEqual([
      'human: TIME',
      'human: user 1',
    ]);
  });
});
