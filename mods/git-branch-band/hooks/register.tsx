import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Divergence, RepoStatus } from '../types'

const repo = atom({ plugin: 'git-branch-band', key: 'repo' } as const, null as RepoStatus | null)

const POLL_MS = 5000
const GIT_TIMEOUT_MS = 3000

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await refresh($)
    $.clock.every(POLL_MS, () => refresh($))

    return next(e)
  })

  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const result = await next(e)
    await refresh($)

    return result
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const status = await read($, repo)

    if (e.props.hasSurvey || status === null) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box>
        <Text dimColor>⎇ </Text>
        <Text color="cyan">{status.branch}</Text>
        {status.upstream && status.upstream.ahead > 0 && <Text color="green"> ↑{status.upstream.ahead}</Text>}
        {status.upstream && status.upstream.behind > 0 && <Text color="red"> ↓{status.upstream.behind}</Text>}
        {status.changes > 0 && <Text color="yellow"> · {describeChanges(status.changes)}</Text>}
      </Box>
    )
  })
}

function describeChanges(count: number): string {
  return count === 1 ? '1 change' : `${count} changes`
}

async function refresh($: EngineInterface): Promise<void> {
  const status = await readRepoStatus($)
  await update($, repo, () => status)
}

async function readRepoStatus($: EngineInterface): Promise<RepoStatus | null> {
  try {
    const branch = await currentBranch($)
    if (branch === null) {
      return null
    }

    const [changes, upstream] = await Promise.all([countChanges($), compareWithUpstream($)])

    return { branch, changes, upstream }
  } catch {
    return null
  }
}

async function currentBranch($: EngineInterface): Promise<string | null> {
  const head = await git($, ['symbolic-ref', '--quiet', '--short', 'HEAD'])
  if (head.exitCode === 0) {
    return head.stdout.trim()
  }

  const detached = await git($, ['rev-parse', '--short', 'HEAD'])
  return detached.exitCode === 0 ? `detached @ ${detached.stdout.trim()}` : null
}

async function countChanges($: EngineInterface): Promise<number> {
  const status = await git($, ['status', '--porcelain'])
  if (status.exitCode !== 0) {
    return 0
  }

  return status.stdout.split('\n').filter(line => line.length > 0).length
}

async function compareWithUpstream($: EngineInterface): Promise<Divergence | null> {
  const counts = await git($, ['rev-list', '--left-right', '--count', '@{upstream}...HEAD'])
  if (counts.exitCode !== 0) {
    return null
  }

  const [behind = 0, ahead = 0] = counts.stdout.trim().split(/\s+/).map(Number)
  return { ahead, behind }
}

function git($: EngineInterface, args: string[]) {
  return $.process.run(['git', ...args], { timeoutMs: GIT_TIMEOUT_MS })
}
