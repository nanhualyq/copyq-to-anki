const anki = require("./anki");
const { addYoudao, addYoudaoBatch } = require("./youdao");
const { getSelection } = require("./functions");
const { execCopyq } = require("./copyq");
const { addTr, addTrBatch } = require("./tr");

const HTML = "HTML";
const YOUDAO = "YOUDAO";
const YOUDAO_BATCH = "YOUDAO_BATCH";
const TR = 'TR'
const TR_BATCH = 'TR_BATCH'

const funcMap = {
  [YOUDAO]: addYoudao,
  [YOUDAO_BATCH]: addYoudaoBatch,
  [TR]: addTr,
  [TR_BATCH]: addTrBatch,
};

const menus = `
'@Basic-Front',
'@Basic-Back',
'@Cloze-Text',
'@Basic-Front-${HTML}',
'@Basic-Back-${HTML}',
'@Cloze-Text-${HTML}',
'${YOUDAO}',
'${YOUDAO_BATCH}',
'${TR}',
'${TR_BATCH}'
`;
const res = execCopyq(`eval "menuItems(${menus})"`);
const action = res.toString().trim();
if (action) {
  const func = funcMap[action];
  if (typeof func === "function") {
    return func();
  }
  const args = action?.split("-") || [];
  addCard(...args);
}

function addCard(modelName, field, type) {
  const mime = type === HTML ? "text/html" : "";
  const selection = getSelection(mime);
  anki.post("guiAddCards", {
    note: {
      deckName: "Default",
      modelName,
      fields: {
        [field]: selection,
      },
    },
  });
}
