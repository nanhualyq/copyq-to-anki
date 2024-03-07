const Cheerio = require("cheerio");
const { getSelection } = require("./functions");
const { post } = require("./anki");
const { execCopyq } = require("./copyq");

function addTr(tr) {
  const selection = tr || getSelection("text/html");
  const $ = Cheerio.load(selection);
  $tds = $("td");
  post("addNote", {
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
