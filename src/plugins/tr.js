const Cheerio = require("cheerio");
const { execCopyq, getSelection } = require("../copyq");
const { postAnki } = require("../anki");

function addTr(tr) {
  const selection = tr || getSelection("text/html");
  const $ = Cheerio.load(selection);
  $tds = $("td");
  postAnki("addNote", {
    note: {
      deckName: "Default",
      modelName: "@Basic",
      fields: {
        Front: $tds.eq(0).html() || "",
        Back: $tds.eq(1).html() || "",
      },
    },
  });
}
exports.addTr = addTr;

exports.addTrBatch = function () {
  const selection = getSelection("text/html");
  const $ = Cheerio.load(selection);
  $("tr").each((i, e) => {
    addTr(e);
  });
  execCopyq(`popup finish`);
};
