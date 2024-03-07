const { execCopyq } = require("./copyq");
const { addTr, addTrBatch } = require("./plugins/tr");
const { postAnki } = require("./anki");
const menusJson = require("../menus.json");
const { cloneDeepWith } = require("lodash");

const TR = "TR";
const TR_BATCH = "TR_BATCH";

const funcMap = {
  [TR]: addTr,
  [TR_BATCH]: addTrBatch,
};

const menus = `
${menusJson.map((menu) => `'${menu.name}'`).join(",")},
'${TR}',
'${TR_BATCH}'
`;
const res = execCopyq(`eval "menuItems(${menus})"`);
const action = res.toString().trim();
if (action) {
  const menu = menusJson.find((o) => o.name === action);
  if (menu) {
    return execMenu(menu);
  }
  const func = funcMap[action];
  if (typeof func === "function") {
    return func();
  }
}

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