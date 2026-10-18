import { atom, read, update } from 'claude-code'
import type { Register, RenderComponent } from 'claude-code'

const epoch = atom({ plugin: 'soft-clear', key: 'epoch' } as const, 0)

const TRANSCRIPT_ROWS: RenderComponent[] = [
  'UserMessage',
  'AssistantMessage',
  'ToolUse',
  'ToolResult',
  'ToolGroup',
  'ToolProgress',
  'CommandOutput',
  'TurnDuration',
  'InfoNotice',
]

const RESET_ARG = 'reset'

export const register: Register = on => {
  // The epoch each row was first drawn in; a row from an earlier epoch was on
  // screen before the latest /clear. Kept by the module, so a reload shows all.
  const firstDrawnIn = new Map<string, number>()

  on('command.run', { command: 'clear' }, async ($, e, next) => {
    if (e.args.trim() === RESET_ARG) return next({ ...e, args: '' })

    await update($, epoch, n => n + 1)
    $.ui.toast(`Screen cleared; session kept. /clear ${RESET_ARG} starts a new one.`)

    return {}
  }).catch(($, e, next) =>
    next.called ? next(e) : { text: `${$.plugin.name} failed; the session was kept. /clear ${RESET_ARG} starts a new one.` },
  )

  for (const component of TRANSCRIPT_ROWS) {
    on('ui.render', { component }, async ($, e, next) => {
      const current = await read($, epoch)
      const row = `${e.component}:${e.requestId}`
      if (!firstDrawnIn.has(row)) firstDrawnIn.set(row, current)

      if (firstDrawnIn.get(row)! < current) {
        const { Box } = $.ui.resolve(e)
        return <Box />
      }

      return next(e)
    })
  }
}
