import { cloneDeepWith } from "lodash";
import * as copyq from "./copyq.ts";
import { readFileSync } from "fs";
import { DATA_DIR } from "./consts.ts";
import { postAnki } from "./anki.ts";

interface Menu {
  name: string;
  plugin: string;
}

function readMenus(): Menu[] {
  const MENU_FILE =  `${DATA_DIR}/menus.json`
  const text = readFileSync(MENU_FILE, "utf-8");
  const menus = JSON.parse(text);
  if (!Array.isArray(menus)) {
    throw new Error("Menus format is wrong!");
  }
  return menus;
}

function getMenuItemsParams(menusJson: Menu[]) {
  let str = ''
  for (const menu of menusJson) {
    if (!menu.name) {
      throw 'Menu no name'
    }
    if (str) {
      str += ','
    }
    str += `'${menu.name}'`
  }
  return str
}

export function show() {
  const menusJson = readMenus();
  const menus = getMenuItemsParams(menusJson)
  const res = copyq.execCopyq(`eval "menuItems(${menus})"`);
  const action = res.trim();
  if (action) {
    const menu = menusJson.find((o) => o.name === action);
    if (menu) {
      execMenu(menu);
    }
  }
}

function execCode(pluginResult: unknown, code: string) {
  const f = Function("pluginResult", "copyq", `return ${code}`);
  return f(pluginResult, copyq);
}

async function execMenu(menu: Menu) {
  let preAction = (cb: (arg1?: unknown) => void) => cb();
  if (menu.plugin) {
    const plugin = await import(`../plugins/${menu.plugin}.ts`);
    preAction = plugin.default;
  }
  preAction((pluginResult) => {
    const newMenu = cloneDeepWith(menu, function (val) {
      if (typeof val === "string") {
        return val.replaceAll(/\{\{(.+?)\}\}/g, (m, p1) =>
          execCode(pluginResult, p1)
        );
      }
    });
    postAnki(newMenu.anki.action, newMenu.anki.params);
  });
}

