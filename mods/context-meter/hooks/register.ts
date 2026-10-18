import type { Register, SessionContextUsage } from 'claude-code'

const BAR_WIDTH = 10

function trimZero(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '')
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${trimZero(n / 1_000_000)}M`
  if (n >= 1_000) return `${trimZero(n / 1_000)}k`
  return String(n)
}

function bar(percent: number): string {
  const filled = Math.max(0, Math.min(BAR_WIDTH, Math.round((percent / 100) * BAR_WIDTH)))
  return '▰'.repeat(filled) + '▱'.repeat(BAR_WIDTH - filled)
}

export function describeContext({ tokens = 0, window, percent }: SessionContextUsage): string {
  const used = percent ?? (window > 0 ? Math.round((tokens / window) * 100) : 0)
  return `ctx ${bar(used)} ${used}% · ${formatTokens(tokens)} / ${formatTokens(window)} tokens`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    const { context } = await $.session.usage()
    $.ui.status(describeContext(context))

    return result
  })

  on('session.measure', ($, e, next) => {
    if (e.changed.includes('context')) {
      $.ui.status(describeContext(e.context))
    }

    return next(e)
  })
}
