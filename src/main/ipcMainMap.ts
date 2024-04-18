import settings from 'electron-settings'
import { registerGlobalShortcut } from './globalShortcut'
import { execSync } from 'child_process'
import path from 'path'
import { app } from 'electron'
import { getWindow, toggleMainWindow } from './windows'
import { execMenu as execMenuReal } from './menu'

function getLogs(): string {
  try {
    return execSync(
      `tail -n 1000 ${path.join(app.getPath('userData'), 'logs/main.log')}`
    ).toString()
  } catch (error) {
    return ''
  }
}

function execMenu(_e, menu): void {
  const win = getWindow(true)
  win?.on('closed', () =>
    setTimeout(() => {
      execMenuReal(menu)
    }, 0)
  )
  win?.close()
}

const map: { [key: string]: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any } = {
  getLogs,
  execMenu,
  toggleMainWindow,
  'settings:get': (_e, k: string) => settings.get(k),
  'settings:set': (_e, k, v) => {
    settings.setSync(k, v)
    if (k === 'settings') {
      registerGlobalShortcut()
    }
  }
}

export default map
