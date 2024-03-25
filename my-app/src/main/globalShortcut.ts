import { dialog, globalShortcut } from 'electron'
import settings from 'electron-settings'
import { get } from 'lodash'
import { createQuickMenuWindow, toggleMainWindow } from './windows'

export function registerGlobalShortcut() {
  globalShortcut.unregisterAll()
  const json = settings.getSync('settings')
  try {
    if (get(json, 'mainShortcut')) {
      globalShortcut.register(get(json, 'mainShortcut'), toggleMainWindow)
    }
    if (get(json, 'menusShortcut')) {
      globalShortcut.register(get(json, 'menusShortcut'), createQuickMenuWindow)
    }
  } catch (error) {
    dialog.showErrorBox('registerGlobalShortcut failed', error instanceof Error ? error.message : '')
  }
}
