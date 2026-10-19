import type { On } from 'claude-code'
import { expect, mock, test } from 'claude-code/testing'

const DAY_MS = 24 * 60 * 60 * 1000
const NOW = Date.parse('2026-10-19T15:00:00Z')
const MEMORY = '/home/dev/.claude/projects/-work-acme/memory'

const modelReply = `# Initiatives

## Ops visibility
_Last updated: 2026-10-19_
**State:** First slice in review.
**Open:**
- Decide whether to split PR 1301

## Thirty days old
_Last updated: 2026-09-19_
**State:** Kept: pruning is by calendar day, so 30 days old survives the time of day.
**Open:**
- nothing

## Thirty-one days old
_Last updated: 2026-09-18_
**State:** First slice in review.
**Open:**
- Decide whether to split PR 1301

## Old thing
_Last updated: 2026-09-01_
**State:** Finished long ago.
**Open:**
- nothing
`

const wire = (on: On, files: Record<string, string>, forks: string[]) => {
  mock.env(on, { HOME: '/home/dev' })
  on('session.root', () => ({ value: '/work/acme/packages/backend' }))
  on('clock.now', () => ({ value: NOW }))
  on('fs.exists', (_$, e) => ({ value: e.path === MEMORY || e.path in files }))
  on('fs.read', (_$, e) => {
    const text = files[e.path]
    if (text === undefined) throw new Error(`missing ${e.path}`)
    return { value: text }
  })
  on('fs.write', (_$, e) => {
    files[e.path] = e.text
    return { value: undefined }
  })
  on('model.fork', (_$, e) => {
    forks.push(e.prompt)
    return { value: { isAnswered: true as const, text: '```markdown\n' + modelReply + '```', usage: { input_tokens: 0, output_tokens: 0 } as never } }
  })
  on('ui.toast', () => ({ value: undefined }))
  on('skill.prompt', (_$, e) => ({ text: e.text }))
}

test('commit-message refreshes the initiatives file and prunes stale entries', async ($, on) => {
  const files: Record<string, string> = { [`${MEMORY}/MEMORY.md`]: '- [Other](other.md) — hook\n' }
  const forks: string[] = []
  wire(on, files, forks)

  const result = await $.skill.prompt({ skill: 'commit-message', text: 'Write the subject line.' })

  expect(result.text).toBe('Write the subject line.')
  expect(forks).toHaveLength(1)
  expect(forks[0]).toContain('Today is 2026-10-19')
  expect(forks[0]).toContain('# Initiatives')

  const written = files[`${MEMORY}/initiatives.md`] ?? ''
  expect(written).toContain('## Ops visibility')
  expect(written).not.toContain('## Old thing')
  expect(written).toContain('## Thirty days old')
  expect(written).not.toContain('## Thirty-one days old')
  expect(written.startsWith('# Initiatives')).toBe(true)
  expect(files[`${MEMORY}/MEMORY.md`]).toContain('[Initiatives](initiatives.md)')
  expect(files[`${MEMORY}/MEMORY.md`]).toContain('[Other](other.md)')
})

test('the existing file feeds the prompt and the index line is not duplicated', async ($, on) => {
  const files: Record<string, string> = {
    [`${MEMORY}/initiatives.md`]: '# Initiatives\n\n## Existing\n_Last updated: 2026-10-01_\n**State:** here.\n',
    [`${MEMORY}/MEMORY.md`]: '- [Initiatives](initiatives.md) — hook\n',
  }
  const forks: string[] = []
  wire(on, files, forks)

  await $.skill.prompt({ skill: 'commit-message', text: 'x' })

  expect(forks[0]).toContain('## Existing')
  expect((files[`${MEMORY}/MEMORY.md`] ?? '').split('initiatives.md')).toHaveLength(2)
})

test('other skills are left alone', async ($, on) => {
  const forks: string[] = []
  wire(on, {}, forks)

  const result = await $.skill.prompt({ skill: 'pr-description', text: 'describe it' })

  expect(result.text).toBe('describe it')
  expect(forks).toHaveLength(0)
})
