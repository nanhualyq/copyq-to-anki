// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

const keys = ["getMenus", "execMenu", 'getSettings', 'setSettings', 'getLogs'];
export const myApi: { [key: string]: (...args: any[]) => Promise<any> } = {};
for (const key of keys) {
  myApi[key] = (...rest: any) => ipcRenderer.invoke(key, ...rest);
}
contextBridge.exposeInMainWorld("myApi", myApi);
