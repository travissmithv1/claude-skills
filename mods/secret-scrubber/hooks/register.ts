import type { Register } from 'claude-code'

type Rule = { pattern: RegExp; replace: (match: string, ...groups: string[]) => string }

const tagged = (label: string) => () => `[REDACTED:${label}]`

const SECRET_NAME = '[A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|PASSWD|API_?KEY|PRIVATE_?KEY|ACCESS_?KEY|CREDENTIALS?)[A-Z0-9_]*'
const JSON_SECRET_NAME = '[A-Za-z0-9_-]*(?:secret|token|password|passwd|api_?key|apikey|private_?key|access_?key)[A-Za-z0-9_-]*'

// Specific formats first, so a key inside `NAME=value` gets its own label.
const RULES: Rule[] = [
  {
    pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
    replace: tagged('private-key'),
  },
  { pattern: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g, replace: tagged('aws-access-key') },
  { pattern: /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{22,})\b/g, replace: tagged('github-token') },
  { pattern: /\bsk-ant-[A-Za-z0-9_-]{20,}/g, replace: tagged('anthropic-key') },
  { pattern: /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}/g, replace: tagged('openai-key') },
  { pattern: /\bxox[abposr]-[A-Za-z0-9-]{10,}/g, replace: tagged('slack-token') },
  { pattern: /\b[sr]k_(?:live|test)_[A-Za-z0-9]{16,}/g, replace: tagged('stripe-key') },
  { pattern: /\bAIza[0-9A-Za-z_-]{35}\b/g, replace: tagged('google-api-key') },
  { pattern: /\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{16,}/g, replace: tagged('jwt') },
  {
    pattern: /\b(Bearer\s+)(?!\[REDACTED)[A-Za-z0-9._~+/=-]{16,}/g,
    replace: (_m, prefix) => `${prefix}[REDACTED]`,
  },
  {
    pattern: /\b([a-z][a-z0-9+.-]*:\/\/[^\s:/@]+:)(?!\[REDACTED)[^\s@/]+(@)/g,
    replace: (_m, head, at) => `${head}[REDACTED]${at}`,
  },
  {
    pattern: new RegExp(`\\b(${SECRET_NAME}\\s*[=:]\\s*["']?)(?![$<\\[])([^\\s"']{8,})`, 'g'),
    replace: (_m, head) => `${head}[REDACTED]`,
  },
  {
    pattern: new RegExp(`("${JSON_SECRET_NAME}"\\s*:\\s*")(?!\\[REDACTED)([^"]{8,})"`, 'gi'),
    replace: (_m, head) => `${head}[REDACTED]"`,
  },
]

export function redact(input: string): { text: string; count: number } {
  let count = 0
  const text = RULES.reduce(
    (current, { pattern, replace }) =>
      current.replace(pattern, (...args) => {
        count += 1
        return replace(...(args as [string, ...string[]]))
      }),
    input,
  )

  return { text, count }
}

export function redactDeep<T>(value: T): { value: T; count: number } {
  if (typeof value === 'string') {
    const { text, count } = redact(value)
    return { value: text as T, count }
  }
  if (Array.isArray(value)) {
    let count = 0
    const items = value.map(item => {
      const cleaned = redactDeep(item)
      count += cleaned.count
      return cleaned.value
    })
    return { value: items as T, count }
  }
  if (value !== null && typeof value === 'object') {
    let count = 0
    const entries = Object.entries(value).map(([key, item]) => {
      const cleaned = redactDeep(item)
      count += cleaned.count
      return [key, cleaned.value]
    })
    return { value: Object.fromEntries(entries) as T, count }
  }

  return { value, count: 0 }
}

export const register: Register = on => {
  on('tool.call', async ($, e, next) => {
    const ran = await next(e)
    if (ran.deny !== undefined) return ran

    if (ran.isError) {
      const { text, count } = redact(ran.text ?? String(ran.result ?? ''))
      if (count === 0) return ran
      $.ui.toast(`secret-scrubber: redacted ${count} secret(s) from ${e.tool} error`)
      return { deny: text }
    }

    const { value, count } = redactDeep(ran.result)
    if (count === 0) return ran
    $.ui.toast(`secret-scrubber: redacted ${count} secret(s) from ${e.tool} output`)
    return { result: value, context: ran.context }
  }).catch(($, e, next) =>
    next.called ? { deny: `${$.plugin.name}: the scrubber failed, so the result was withheld.` } : next(e),
  )
}
