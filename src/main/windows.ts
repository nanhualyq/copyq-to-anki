import { BrowserWindow, screen, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import settings from 'electron-settings'
import { getTrayIcon } from './tray'

function createWindow(options: Electron.BrowserWindowConstructorOptions = {}) {
  const mainWindow = new BrowserWindow({
    // width: 900,
    // height: 670,
    // show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon: getTrayIcon() } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    ...options
  })
  return mainWindow
}

function loadHtmlWithHash(window: Electron.BrowserWindow, hash = '') {
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    const h = hash ? `#${hash}` : ''
    window.loadURL(process.env['ELECTRON_RENDERER_URL'] + h)
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'), { hash })
  }
}

export function createMainWindow() {
  const mainWindow = createWindow({ show: false })
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  loadHtmlWithHash(mainWindow)
}

export function getWindow(isQuickMenu = false) {
  return BrowserWindow.getAllWindows().find(
    (w) => w.webContents.getURL().endsWith('#quick-menu') === isQuickMenu
  )
}
export function toggleMainWindow(): void {
  const mainWindow = getWindow()
  if (!mainWindow) {
    return
  }
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
  }
}

export function createQuickMenuWindow(): BrowserWindow | undefined {
  let win = getWindow(true)
  if (win) {
    return win
  }
  const mainWindow = getWindow()
  if (!mainWindow) {
    return
  }
  const lastSize: unknown = settings.getSync('quick-menu-window-size') || {}
  win = createWindow({
    ...Object(lastSize),
    frame: false,
    modal: true,
    alwaysOnTop: true,
    useContentSize: true,
    parent: mainWindow
  })
  loadHtmlWithHash(win, 'quick-menu')

  const [width, height] = win.getSize()
  const { x, y } = screen.getCursorScreenPoint()
  const displaySize = screen.getDisplayNearestPoint({ x, y }).size
  const xPos = x < displaySize.width / 2 ? x : x - width
  const yPos = y < displaySize.height / 2 ? y : y - height
  win.setBounds({ x: xPos, y: yPos })

  win.on('close', () => {
    if (win) {
      const [width, height] = win.getSize() || []
      settings.set('quick-menu-window-size', { width, height })
    }
  })

  win.on('blur', () => {
    win?.close()
  })

  return win
}
