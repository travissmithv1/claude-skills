import { expect, test } from 'claude-code/testing'

const PRESENTATION = { isFullscreen: false, columns: 100 } as never
const ORIGIN = { kind: 'composer' } as never

const userRow = (requestId: string, text: string) => ({
  plugin: 'soft-clear',
  component: 'UserMessage' as const,
  requestId,
  props: { text, origin: ORIGIN, isExpanded: false },
})

const softClear = ($: any, args = '') =>
  $.command.run({ command: 'clear', args, origin: ORIGIN, presentation: PRESENTATION })

for (const surface of ['terminal', 'desktop'] as const) {
  test(`/clear hides rows drawn before it and keeps the session on ${surface}`, async ($, on) => {
    let sessionReset = false
    on('command.run', { command: 'clear' }, () => {
      sessionReset = true
      return { text: '' }
    })
    on('ui.render', ($, e) => {
      const { Text } = $.ui.resolve(e)
      return <Text>{(e.props as { text: string }).text}</Text>
    })

    const before = await $.ui.mount({ ...userRow('m1', 'old prompt'), surface })
    expect(await before.find({ text: "old prompt" })).toBeDefined()

    await softClear($)

    expect(sessionReset).toBe(false)
    expect(await before.find({ text: "old prompt" })).toBeUndefined()

    const after = await $.ui.mount({ ...userRow('m2', 'new prompt'), surface })
    expect(await after.find({ text: "new prompt" })).toBeDefined()
  })
}

test('/clear reset still starts a new session', async ($, on) => {
  let sessionReset = false
  on('command.run', { command: 'clear' }, () => {
    sessionReset = true
    return { text: '' }
  })

  await softClear($, 'reset')

  expect(sessionReset).toBe(true)
})

test('/soft-clear-debug is not handled by soft-clear', async ($, on) => {
  on('command.run', { command: 'soft-clear-debug' }, () => ({ text: 'unknown command' }))

  const ran = await $.command.run({ command: 'soft-clear-debug', args: '', origin: ORIGIN, presentation: PRESENTATION })

  expect(ran).toEqual({ text: 'unknown command' })
})
