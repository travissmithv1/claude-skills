declare module 'claude-code' {
  interface PluginState {
    'usage-meter': { line: UsageLine }
  }
}

export type UsageLine = string | null
