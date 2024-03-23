import { app, globalShortcut } from "electron";
import { writeFileSync } from "fs";
import path from "path";
import { createQuickMenuWindow, toggleMainWindow } from "./window";
import { execSync } from "child_process";

function getFilePath(file: string) {
  return path.join(app.getPath("userData"), file);
}

export function getSettings(file: string) {
  try {
    delete require.cache[getFilePath(`${file}`)];
    const json = require(getFilePath(`${file}`)) || {};
    if (file === "settings.json" && !json?.ankiConnectHost) {
      json.ankiConnectHost = "http://127.0.0.1:8765";
    }
    return json;
  } catch (error) {
    return null;
  }
}
export function setSettings(file: string, json: Object) {
  writeFileSync(getFilePath(`${file}`), JSON.stringify(json));
}

export function registerGlobalShortcut() {
  globalShortcut.unregisterAll();
  const settings = getSettings("settings.json");
  if (settings?.mainShortcut) {
    globalShortcut.register(settings.mainShortcut, toggleMainWindow);
  }
  if (settings?.menusShortcut) {
    globalShortcut.register(settings.menusShortcut, createQuickMenuWindow);
  }
}

export function getLogs() {
  try {
    return execSync(`tail -n 100 ${getFilePath("logs/main.log")}`).toString();
  } catch (error) {
    return null;
  }
}
