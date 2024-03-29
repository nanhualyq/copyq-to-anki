import { cloneDeepWith } from 'lodash'
import { clipboard } from 'electron'
import { execSync } from 'child_process'
import { verbose } from 'electron-log'

interface Menu {
  name: string
  plugin: string
  outPlugin: string
}

function execShell(code: string): string {
  return execSync(code).toString().trim()
}

function execCode(pluginResult: unknown, code: string): string {
  const f = Function('context', `return ${code}`)
  try {
    return f({ pluginResult, clipboard, execShell })
  } catch (error) {
    return error + ''
  }
}

export async function execMenu(menu: Menu): Promise<void> {
  let preAction = (cb: (arg1?: unknown) => void): void => cb()
  if (menu.plugin) {
    preAction = (await import(`./plugins/${menu.plugin}.ts`))?.default
    if (typeof preAction !== 'function') {
      throw `${menu.plugin} is not a valid plugin`
    }
  }
  const outPlugin = (await import(`./outPlugins/${menu.outPlugin || 'anki'}.ts`))?.default
  if (typeof outPlugin !== 'function') {
    throw `${menu.outPlugin} is not a valid plugin`
  }
  preAction((pluginResult) => {
    const newMenu = cloneDeepWith(menu, function (val) {
      if (typeof val === 'string') {
        return val.replaceAll(/\{\{(.+?)\}\}/g, (_m, p1) => execCode(pluginResult, p1))
      }
      return
    })
    verbose('outPlugin', menu.outPlugin, 'menu', newMenu)
    try {
      outPlugin(newMenu)?.catch(verbose)
    } catch (err) {
      verbose(err)
    }
  })
}
