export type Epoch = number

declare module 'claude-code' {
  interface PluginState {
    'soft-clear': { epoch: Epoch }
  }
}
