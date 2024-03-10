const { execCopyq } = require("./copyq");
const { postAnki } = require("./anki");
const { cloneDeepWith } = require("lodash");

const menusJson = (function () {
  try {
    return require("../menus.json");
  } catch (error) {
    return require("../menus.example.json");
  }
})();

exports.show = function () {
  const menus = menusJson.map((menu) => `'${menu.name}'`).join(",");
  const res = execCopyq(`eval "menuItems(${menus})"`);
  const action = res.trim();
  if (action) {
    const menu = menusJson.find((o) => o.name === action);
    if (menu) {
      execMenu(menu);
    }
  }
};

function execMenu(menu) {
  let preAction = (cb) => cb();
  if (menu.plugin) {
    preAction = require(`./plugins/${menu.plugin}`);
  }
  preAction((pluginResult) => {
    const copyq = require("./copyq");
    const newMenu = cloneDeepWith(menu, function (val) {
      if (typeof val === "string") {
        return val.replaceAll(/\{\{(.+?)\}\}/g, (m, p1) => eval(p1));
      }
    });
    postAnki(newMenu.anki.action, newMenu.anki.params);
  });
}
