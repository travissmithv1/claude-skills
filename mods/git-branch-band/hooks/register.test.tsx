import { describe, expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On } from 'claude-code'

const BAND = {
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 80,
    scroll: { offset: 0, bodyRows: 10 },
    view: {},
  },
} as const

type Repo = { branch: string; status?: string; upstream?: { ahead: number; behind: number } } | null

const ok = (stdout: string) => ({ value: { exitCode: 0, stdout, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } })
const notARepo = { value: { exitCode: 128, stdout: '', stderr: 'not a git repository', isStdoutTruncated: false, isStderrTruncated: false } }

function fakeSession(on: On, repo: () => Repo) {
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('process.run', ($, e) => {
    const current = repo()
    if (current === null) return notARepo
    if (e.argv.includes('symbolic-ref')) return ok(`${current.branch}\n`)
    if (e.argv.includes('status')) return ok(current.status ?? '')
    if (e.argv.includes('rev-list') && current.upstream) {
      return ok(`${current.upstream.behind}\t${current.upstream.ahead}\n`)
    }
    return notARepo
  })
}

async function bandFor($: Engine, on: On, repo: Repo) {
  mock.clock(on)
  fakeSession(on, () => repo)
  await $.session.start(start)
  return $.ui.mount({ plugin: 'git-branch-band', surface: 'terminal', ...BAND })
}

const start = { cwd: '/repo', surface: 'terminal', isInteractive: true } as const

describe('git-branch-band', () => {
  test('shows the current branch above the prompt', async ($, on) => {
    mock.clock(on)
    fakeSession(on, () => ({ branch: 'feature/login' }))
    await $.session.start(start)

    for (const surface of ['terminal', 'desktop'] as const) {
      const ui = await $.ui.mount({ plugin: 'git-branch-band', surface, ...BAND })
      expect(await ui.find({ type: 'Text', text: /feature\/login/ })).toBeDefined()
      await ui.unmount()
    }
  })

  test('picks up a branch switch on the next poll', async ($, on) => {
    const clock = mock.clock(on)
    let current = 'main'
    fakeSession(on, () => ({ branch: current }))
    await $.session.start(start)

    current = 'develop'
    await clock.advance(5000)

    const ui = await $.ui.mount({ plugin: 'git-branch-band', surface: 'terminal', ...BAND })
    expect(await ui.find({ type: 'Text', text: /develop/ })).toBeDefined()
    await ui.unmount()
  })

  test('shows nothing outside a git repository', async ($, on) => {
    mock.clock(on)
    fakeSession(on, () => null)
    on('ui.render', { component: 'AbovePrompt' }, ($, e) => {
      const { Text } = $.ui.resolve(e)
      return <Text key="engine">engine band</Text>
    })
    await $.session.start(start)

    const ui = await $.ui.mount({ plugin: 'git-branch-band', surface: 'terminal', ...BAND })
    expect(await ui.find({ type: 'Text', text: /⎇/ })).toBeUndefined()
    await ui.unmount()
  })

  test('counts uncommitted changes', async ($, on) => {
    const ui = await bandFor($, on, { branch: 'main', status: ' M a.ts\n?? b.ts\nA  c.ts\n' })
    expect(await ui.find({ type: 'Text', text: /3 changes/ })).toBeDefined()
    await ui.unmount()
  })

  test('says change, not changes, for one', async ($, on) => {
    const ui = await bandFor($, on, { branch: 'main', status: ' M a.ts\n' })
    expect(await ui.find({ type: 'Text', text: /1 change\b/ })).toBeDefined()
    await ui.unmount()
  })

  test('shows no count when the tree is clean', async ($, on) => {
    const ui = await bandFor($, on, { branch: 'main', status: '' })
    expect(await ui.find({ type: 'Text', text: /change/ })).toBeUndefined()
    await ui.unmount()
  })

  test('shows commits ahead of and behind upstream', async ($, on) => {
    const ui = await bandFor($, on, { branch: 'main', upstream: { ahead: 2, behind: 1 } })
    expect(await ui.find({ type: 'Text', text: /↑2/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /↓1/ })).toBeDefined()
    await ui.unmount()
  })

  test('leaves out a zero side', async ($, on) => {
    const ui = await bandFor($, on, { branch: 'main', upstream: { ahead: 3, behind: 0 } })
    expect(await ui.find({ type: 'Text', text: /↑3/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /↓/ })).toBeUndefined()
    await ui.unmount()
  })

  test('shows no arrows without an upstream', async ($, on) => {
    const ui = await bandFor($, on, { branch: 'main' })
    expect(await ui.find({ type: 'Text', text: /[↑↓]/ })).toBeUndefined()
    expect(await ui.find({ type: 'Text', text: /main/ })).toBeDefined()
    await ui.unmount()
  })
})
