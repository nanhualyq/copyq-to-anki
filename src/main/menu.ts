import { cloneDeepWith, get } from 'lodash'
import { postAnki } from './anki'
import { clipboard } from 'electron'
import { execSync } from 'child_process'
import tr from './plugins/tr'
import youdao from './plugins/youdao'

const plugins = {
  tr,
  youdao
}

interface Menu {
  name: string
  plugin: string
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
    preAction = get(plugins, menu.plugin)
  }
  preAction((pluginResult) => {
    const newMenu = cloneDeepWith(menu, function (val) {
      if (typeof val === 'string') {
        return val.replaceAll(/\{\{(.+?)\}\}/g, (_m, p1) => execCode(pluginResult, p1))
      }
      return
    })
    postAnki(newMenu.anki.action, newMenu.anki.params)
  })
}
