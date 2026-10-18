import { describe, expect, test } from 'claude-code/testing'

import { redact, redactDeep } from './register'

// Fakes assembled at run time so this file never holds a scannable key.
const AWS_KEY = 'AKIA' + 'IOSFODNN7EXAMPLE'
const GITHUB_TOKEN = 'ghp_' + 'a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8'
const ANTHROPIC_KEY = 'sk-ant-' + 'api03-' + 'x'.repeat(40)
const OPENAI_KEY = 'sk-proj-' + 'Y'.repeat(40)
const SLACK_TOKEN = 'xoxb-' + '1234567890-abcdefghijkl'
const STRIPE_KEY = 'sk_live_' + 'Z'.repeat(24)
const GOOGLE_KEY = 'AIza' + 'S'.repeat(35)
const JWT = 'eyJhbGciOiJIUzI1NiJ9' + '.eyJzdWIiOiIxMjM0NTY3ODkwIn0' + '.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U'

describe('redact', () => {
  const BARE: [string, string, string][] = [
    ['AWS access key', AWS_KEY, 'aws-access-key'],
    ['GitHub token', GITHUB_TOKEN, 'github-token'],
    ['Anthropic key', ANTHROPIC_KEY, 'anthropic-key'],
    ['OpenAI key', OPENAI_KEY, 'openai-key'],
    ['Slack token', SLACK_TOKEN, 'slack-token'],
    ['Stripe key', STRIPE_KEY, 'stripe-key'],
    ['Google API key', GOOGLE_KEY, 'google-api-key'],
    ['JWT', JWT, 'jwt'],
  ]
  for (const [name, secret, label] of BARE) {
    test(`hides a bare ${name}`, async () => {
      const { text, count } = redact(`found ${secret} here`)
      expect(text).toBe(`found [REDACTED:${label}] here`)
      expect(count).toBe(1)
    })
  }

  test('hides a private key block whole', async () => {
    const pem = '-----BEGIN RSA PRIVATE KEY-----\nMIIEow\nabc\n-----END RSA PRIVATE KEY-----'
    expect(redact(`key:\n${pem}\ndone`).text).toBe('key:\n[REDACTED:private-key]\ndone')
  })

  test('keeps the name of an env-style secret and hides its value', async () => {
    const env = 'DB_PASSWORD=hunter2hunter2\nMY_API_KEY="abcdef123456"\nPORT=3000'
    expect(redact(env).text).toBe('DB_PASSWORD=[REDACTED]\nMY_API_KEY="[REDACTED]"\nPORT=3000')
  })

  test('hides a secret value in JSON', async () => {
    expect(redact('{"client_secret": "s3cr3tvalue99"}').text).toBe('{"client_secret": "[REDACTED]"}')
  })

  test('hides credentials in a URL and a bearer token', async () => {
    expect(redact('postgres://admin:pa55word@db.local/app').text).toBe(
      'postgres://admin:[REDACTED]@db.local/app',
    )
    expect(redact('Authorization: Bearer abcdef1234567890abcdef').text).toBe(
      'Authorization: Bearer [REDACTED]',
    )
  })

  test('leaves ordinary text and code alone', async () => {
    const code = 'const apiKey = process.env.API_KEY\nTOKEN_LIMIT=4096\nhttps://example.com/path'
    expect(redact(code)).toEqual({ text: code, count: 0 })
  })
})

test('redactDeep cleans every string in a result record', async () => {
  const { value, count } = redactDeep({ stdout: `key ${AWS_KEY}`, lines: [GITHUB_TOKEN], code: 0 })
  expect(value).toEqual({ stdout: 'key [REDACTED:aws-access-key]', lines: ['[REDACTED:github-token]'], code: 0 })
  expect(count).toBe(2)
})

test('a tool result reaches Claude with its secrets redacted', async ($, on) => {
  on('tool.call', ($, e) => ({
    result: { stdout: `AWS_ACCESS_KEY_ID=${AWS_KEY}`, stderr: '', interrupted: false },
    text: `AWS_ACCESS_KEY_ID=${AWS_KEY}`,
  }) as never)
  on('ui.toast', () => ({ value: undefined }) as never)

  const ran = await $.tool.call({ tool: 'Bash', command: 'env' })

  expect(JSON.stringify(ran)).not.toContain(AWS_KEY)
  expect((ran.result as { stdout: string }).stdout).toBe('AWS_ACCESS_KEY_ID=[REDACTED:aws-access-key]')
})

test('an errored tool call has its error text redacted', async ($, on) => {
  on('tool.call', () => ({ isError: true, result: `bad token ${GITHUB_TOKEN}`, text: `bad token ${GITHUB_TOKEN}` }) as never)
  on('ui.toast', () => ({ value: undefined }) as never)

  const ran = await $.tool.call({ tool: 'Bash', command: 'gh auth status' })

  expect(JSON.stringify(ran)).not.toContain(GITHUB_TOKEN)
})

test('a clean result passes through untouched', async ($, on) => {
  const answer = { result: { stdout: 'hello', stderr: '', interrupted: false }, text: 'hello' }
  on('tool.call', () => answer as never)

  const ran = await $.tool.call({ tool: 'Bash', command: 'echo hello' })

  expect(ran).toEqual(answer)
})
