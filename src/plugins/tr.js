const Cheerio = require("cheerio");
const { execCopyq, getSelection } = require("../copyq");
const logger = require("../logger");

module.exports = function (cb) {
  const selection = getSelection("text/html");
  const $ = Cheerio.load(selection);
  $("tr").each((i, e) => {
    cb($(e).find("td"));
  });
  execCopyq(`popup 'Table Row finish: ${$("tr").length}'`);
};
