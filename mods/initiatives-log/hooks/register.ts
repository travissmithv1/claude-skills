import type { EngineInterface, Register } from 'claude-code'

const SKILL = 'commit-message'
const FILE = 'initiatives.md'
const INDEX = 'MEMORY.md'
const KEEP_DAYS = 30
const DAY_MS = 24 * 60 * 60 * 1000
const INDEX_LINE = `- [Initiatives](${FILE}) — initiatives in progress and their state; entries older than 30 days are pruned`
const EMPTY_FILE = '# Initiatives\n\nOne section per initiative. Each has a last-updated date, the current state, and what is open.\n'

type Engine = EngineInterface

const encodeProjectDir = (dir: string) => dir.replace(/[\/\\:]/g, '-')

const isoDate = (ms: number) => {
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const findMemoryDir = async ($: Engine, root: string, home: string) => {
  let dir = root
  while (dir) {
    const candidate = `${home}/.claude/projects/${encodeProjectDir(dir)}/memory`
    if (await $.fs.exists(candidate)) return candidate
    const parent = dir.slice(0, dir.lastIndexOf('/'))
    if (!parent || parent === dir) break
    dir = parent
  }
  return undefined
}

export const prune = (text: string, nowMs: number) => {
  const cutoff = isoDate(nowMs - KEEP_DAYS * DAY_MS)
  const [head, ...sections] = text.split(/^(?=## )/m)
  const kept: string[] = []
  const dropped: string[] = []
  for (const section of sections) {
    const title = (section.split('\n')[0] ?? '').replace(/^## /, '').trim()
    const dated = section.match(/Last updated:\s*(\d{4}-\d{2}-\d{2})/)
    const date = dated?.[1]
    if (date !== undefined && date < cutoff) dropped.push(title)
    else kept.push(section)
  }
  return { text: head + kept.join(''), kept: kept.length, dropped }
}

const stripFence = (reply: string) => {
  const trimmed = reply.trim()
  const fenced = trimmed.match(/^```[a-z]*\n([\s\S]*?)\n```$/)
  return (fenced?.[1] ?? trimmed).trim() + '\n'
}

const buildPrompt = (current: string, today: string) => `You are maintaining the user's initiatives file: a short record of the initiatives they are working on and where each one stands. Today is ${today}. Using everything that happened in this session, return the complete updated file.

Rules:
- Keep the format exactly: a top-level "# Initiatives" heading, then one "## <Initiative name>" section per initiative.
- Each section has the line "_Last updated: YYYY-MM-DD_", then "**State:**" followed by two or three sentences, then "**Open:**" followed by a short bullet list of open items, blockers, or decisions waiting on someone.
- Update the section for the initiative this session's work belongs to: set its Last updated to today, rewrite State to say what is true now, remove open items that were finished, and add new ones.
- If no existing section fits, add a new one.
- Do not touch sections this session did not advance, and do not change their Last updated date.
- Do not invent progress. Record only what this session actually did or learned.
- Keep each section under 120 words.
- Output only the markdown file content: no code fence, no commentary before or after.

Current file:
<file>
${current}</file>`

const ensureIndexed = async ($: Engine, dir: string) => {
  const path = `${dir}/${INDEX}`
  const index = (await $.fs.exists(path)) ? await $.fs.read(path) : ''
  if (index.includes(`(${FILE})`)) return
  const separator = index.length === 0 || index.endsWith('\n') ? '' : '\n'
  await $.fs.write(path, `${index}${separator}${INDEX_LINE}\n`)
}

const refresh = async ($: Engine) => {
  const home = await $.env.get('HOME')
  if (!home) return 'HOME is not set'
  const dir = await findMemoryDir($, await $.session.root(), home)
  if (!dir) return 'no memory directory for this project'

  const path = `${dir}/${FILE}`
  const current = (await $.fs.exists(path)) ? await $.fs.read(path) : EMPTY_FILE
  const now = await $.clock.now()
  const reply = await $.model.fork({ prompt: buildPrompt(current, isoDate(now)) })
  if (!reply.isAnswered) return `model gave no answer (${reply.reason})`

  const updated = stripFence(reply.text)
  if (!updated.startsWith('# ') || !updated.includes('\n## ')) return 'model reply was not an initiatives file; left unchanged'

  const result = prune(updated, now)
  await $.fs.write(path, result.text)
  await ensureIndexed($, dir)
  const pruned = result.dropped.length ? `, pruned ${result.dropped.join(', ')}` : ''
  return `initiatives updated: ${result.kept} entr${result.kept === 1 ? 'y' : 'ies'}${pruned}`
}

export const register: Register = on => {
  on('skill.prompt', { skill: SKILL }, async ($, e, next) => {
    const result = await next(e)
    try {
      $.ui.toast(`${$.plugin.name}: ${await refresh($)}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      $.ui.toast(`${$.plugin.name}: update failed: ${message}`)
    }
    return result
  })
}
