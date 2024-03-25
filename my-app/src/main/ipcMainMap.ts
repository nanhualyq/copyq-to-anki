import settings from 'electron-settings'
import { registerGlobalShortcut } from './globalShortcut'
import { execSync } from 'child_process';
import path from 'path';
import { app } from 'electron';
import { getWindow } from './windows';
import { execMenu as execMenuReal } from "./menu";

function getLogs() {
  try {
    return execSync(`tail -n 100 ${path.join(app.getPath('userData'), 'logs/main.log')}`).toString();
  } catch (error) {
    return null;
  }
}

function execMenu(e, menu) {
  let win = getWindow(true)
  win?.close()
  win?.on('closed', () => execMenuReal(menu))
}

const map: { [key: string]: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any } = {
  getLogs,
  execMenu,
  'settings:get': (e, k) => settings.get(k),
  'settings:set': (e, k, v) => {
    settings.setSync(k, v)
    if (k === 'settings') {
      registerGlobalShortcut()
    }
  }
}

export default map
