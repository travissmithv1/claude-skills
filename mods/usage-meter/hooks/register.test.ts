import { expect, mock, test } from 'claude-code/testing'

import { describeLimits, formatResetIn } from './register'

const NOW = Date.parse('2026-10-11T12:00:00Z')

test('formats time until reset', async () => {
  expect(formatResetIn('2026-10-11T14:14:00Z', NOW)).toBe('2h14m')
  expect(formatResetIn('2026-10-11T12:09:00Z', NOW)).toBe('9m')
  expect(formatResetIn('2026-10-14T15:00:00Z', NOW)).toBe('3d3h')
  expect(formatResetIn('2026-10-11T11:00:00Z', NOW)).toBe('now')
})

test('describes each rate-limit window', async () => {
  expect(
    describeLimits(
      [
        { kind: 'five_hour', percentUsed: 23.5, resetsAt: '2026-10-11T14:14:00Z' },
        { kind: 'seven_day', percentUsed: 41 },
      ],
      NOW,
    ),
  ).toBe('5h ▰▰▱▱▱▱▱▱▱▱ 24% (resets 2h14m) · 7d ▰▰▰▰▱▱▱▱▱▱ 41%')
})

test('says so when there is no reading yet', async () => {
  expect(describeLimits([], NOW)).toBe(undefined)
})

const PROMPT_HINT = {
  surface: 'terminal',
  component: 'PromptHint',
  requestId: 'prompt-hint',
  props: { isDraft: false, isWorking: false, hint: '? for shortcuts' },
} as const

test('a rate-limit measurement replaces the prompt hint with a colored line', async ($, on) => {
  mock.clock(on, { now: NOW })
  on('session.measure', ($, e) => ({ changed: e.changed }))
  on('ui.render', () => ({ type: 'Text', children: ['? for shortcuts'] }))

  await $.session.measure({
    context: { window: 200_000 },
    rateLimits: [{ kind: 'seven_day', percentUsed: 90 }],
    changed: ['rateLimits'],
  })

  expect(await $.ui.render(PROMPT_HINT)).toEqual({
    type: 'Text',
    props: { color: 'merged', wrap: 'truncate-end' },
    children: ['7d ▰▰▰▰▰▰▰▰▰▱ 90%'],
  })
})
