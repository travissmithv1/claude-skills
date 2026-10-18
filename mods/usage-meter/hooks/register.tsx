import { atom, read, update } from 'claude-code'
import type { Register, SessionRateLimit } from 'claude-code'

const BAR_WIDTH = 10
const COLOR = 'merged'
const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const line = atom({ plugin: 'usage-meter', key: 'line' } as const, null)

const LABELS: Record<string, string> = {
  five_hour: '5h',
  seven_day: '7d',
  spend_limit: 'spend',
}

function bar(percent: number): string {
  const filled = Math.max(0, Math.min(BAR_WIDTH, Math.round((percent / 100) * BAR_WIDTH)))
  return '▰'.repeat(filled) + '▱'.repeat(BAR_WIDTH - filled)
}

export function formatResetIn(resetsAt: string, now: number): string {
  const left = Date.parse(resetsAt) - now
  if (!(left > 0)) return 'now'

  const days = Math.floor(left / DAY)
  const hours = Math.floor((left % DAY) / HOUR)
  const minutes = Math.floor((left % HOUR) / MINUTE)

  if (days > 0) return `${days}d${hours}h`
  if (hours > 0) return `${hours}h${minutes}m`
  return `${minutes}m`
}

function describeLimit({ kind, percentUsed, resetsAt }: SessionRateLimit, now: number): string {
  const label = LABELS[kind] ?? kind
  const reset = resetsAt ? ` (resets ${formatResetIn(resetsAt, now)})` : ''
  return `${label} ${bar(percentUsed)} ${Math.round(percentUsed)}%${reset}`
}

export function describeLimits(limits: readonly SessionRateLimit[], now: number): string | undefined {
  if (limits.length === 0) return undefined
  return limits.map(limit => describeLimit(limit, now)).join(' · ')
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    const { rateLimits } = await $.session.usage()
    const text = describeLimits(rateLimits, await $.clock.now()) ?? null
    await update($, line, () => text)

    return result
  })

  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('rateLimits')) {
      const text = describeLimits(e.rateLimits, await $.clock.now()) ?? null
      await update($, line, () => text)
    }

    return next(e)
  })

  on('ui.render', { component: 'PromptHint' }, async ($, e, next) => {
    const text = await read($, line)
    if (text === null) {
      return next(e)
    }

    const { Text } = $.ui.resolve(e)

    return <Text color={COLOR} wrap="truncate-end">{text}</Text>
  })
}
