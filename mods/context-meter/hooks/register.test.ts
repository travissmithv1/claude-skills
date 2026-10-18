import { expect, test } from 'claude-code/testing'

import { describeContext, formatTokens } from './register'

test('formats token counts compactly', async () => {
  expect(formatTokens(950)).toBe('950')
  expect(formatTokens(84_123)).toBe('84.1k')
  expect(formatTokens(200_000)).toBe('200k')
  expect(formatTokens(1_000_000)).toBe('1M')
})

test('describes the window fill with a bar', async () => {
  expect(describeContext({ tokens: 84_123, window: 200_000, percent: 42 })).toBe(
    'ctx ▰▰▰▰▱▱▱▱▱▱ 42% · 84.1k / 200k tokens',
  )
  expect(describeContext({ window: 200_000 })).toBe('ctx ▱▱▱▱▱▱▱▱▱▱ 0% · 0 / 200k tokens')
})

test('a context measurement sets the status line', async ($, on) => {
  const lines: (string | undefined)[] = []
  on('ui.status', ($, e, next) => {
    lines.push(e.text)
    return { value: undefined }
  })
  on('session.measure', ($, e) => ({ changed: e.changed }))

  await $.session.measure({
    context: { tokens: 150_000, window: 200_000, percent: 75 },
    rateLimits: [],
    changed: ['context'],
  })

  expect(lines.at(-1)).toBe('ctx ▰▰▰▰▰▰▰▰▱▱ 75% · 150k / 200k tokens')
})
