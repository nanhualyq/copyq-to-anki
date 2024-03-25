import { BrowserWindow, screen, shell } from 'electron'
import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

function createWindow(options: Electron.BrowserWindowConstructorOptions = {}) {
  const mainWindow = new BrowserWindow({
    // width: 900,
    // height: 670,
    // show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
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
export function toggleMainWindow() {
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

export function createQuickMenuWindow() {
  let win = getWindow(true)
  if (win) {
    return win
  }
  const mainWindow = getWindow()
  if (!mainWindow) {
    return
  }
  win = createWindow({
    frame: false,
    modal: true,
    alwaysOnTop: true,
    useContentSize: true,
    parent: mainWindow
  })
  loadHtmlWithHash(win, 'quick-menu')

  // Position the tooltip window near the mouse cursor
  // const [x, y] = mainWindow.getPosition()
  // const [width, height] = mainWindow.getSize()
  const mouseX = screen.getCursorScreenPoint().x
  const mouseY = screen.getCursorScreenPoint().y
  // const xPos = Math.max(x, Math.min(mouseX - 100, x + width - 200))
  // const yPos = Math.max(y, Math.min(mouseY - 50, y + height - 150))
  win.setBounds({ x: mouseX, y: mouseY })

  return win
}
