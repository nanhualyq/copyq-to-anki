if (process.env.NODE_ENV === "development") {
  app.setPath('userData', app.getPath('userData') + '-dev')
}

import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import ipcEvents from "./app/ipcEvents";
import createTray from "./app/tray";
import { createWindow } from "./app/window";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import log from "electron-log/main";
import { registerGlobalShortcut } from "./app/settings";


log.initialize();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  for (const [key, func] of Object.entries(ipcEvents)) {
    ipcMain.handle(key, (e, ...rest) => func(...rest));
  }
  createWindow({ show: false });
  createTray();
  registerGlobalShortcut();
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name: string) => console.log(`Added Extension:  ${name}`))
    .catch((err: string) => console.log("An error occurred: ", err));
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

process.on("unhandledRejection", (error) => {
  log.error(error);
});
