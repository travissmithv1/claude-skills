export type Divergence = { ahead: number; behind: number }

export type RepoStatus = { branch: string; changes: number; upstream: Divergence | null }

declare module 'claude-code' {
  interface PluginState {
    'git-branch-band': { repo: RepoStatus | null }
  }
}
