import { wrap } from "lodash";
import { execMenu as execMenuOrigin } from "./menu";
import { getLogs, getSettings, setSettings } from "./settings";
import { closeQuickMenuWindow } from "./window";

function getMenus() {
  return require(process.cwd() + "/menus.example.json");
}

const execMenu = wrap(execMenuOrigin, function (func, menu: any) {
  closeQuickMenuWindow(() => func(menu));
});

export default {
  getMenus,
  execMenu,
  getSettings,
  setSettings,
  getLogs,
};
