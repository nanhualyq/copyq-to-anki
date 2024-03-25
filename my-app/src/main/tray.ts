import { Menu, Tray, app } from "electron";
import { toggleMainWindow } from "./windows";
import icon from '../../resources/icon.png?asset'

export default function createTray() {
  const tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Exit",
      type: "normal",
      click() {
        app.quit();
      },
    },
  ]);

  tray.on("click", toggleMainWindow);

  tray.setToolTip("Copyq to Anki");
  tray.setContextMenu(contextMenu);
}
