import { BrowserWindow } from "electron";
import path from "path";
import { getTrayIcon } from "./tray";

export const createWindow = (
  options?: Electron.BrowserWindowConstructorOptions,
  hash = ""
) => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // width: 800,
    // height: 600,
    // frame: false,
    // modal: true,
    // useContentSize: true,
    // alwaysOnTop: true,
    // transparent: true,
    icon: getTrayIcon(),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    ...options,
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + `/#/${hash}`);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
      { hash }
    );
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  return mainWindow;
};

export function createMainWindow(
  options?: Electron.BrowserWindowConstructorOptions
) {
  const mainWindow = BrowserWindow.getAllWindows().find((w) =>
    w.webContents.getURL().endsWith("#/")
  );
  if (mainWindow) {
    return mainWindow;
  }
  return createWindow(options);
}

export function toggleMainWindow() {
  const mainWindow = createMainWindow();
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
  }
}

export function createQuickMenuWindow() {
  const menusWindow = BrowserWindow.getAllWindows().find((w) =>
    w.webContents.getURL().endsWith("#/quick-menu")
  );
  if (menusWindow) {
    return menusWindow;
  }
  return createWindow({ frame: false }, "quick-menu");
}

export function closeQuickMenuWindow(cb: Function) {
  const menusWindow = createQuickMenuWindow();
  if (!menusWindow) {
    cb();
    return;
  }
  menusWindow.close();
  menusWindow.on("closed", cb);
}
