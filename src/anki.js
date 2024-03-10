const _ = require("lodash");
const { getUrl } = require("./copyq");
const logger = require("./logger");
const { execCopyq } = require("./copyq");

exports.postAnki = async function (action, params = {}) {
  logger.info("anki-connect", {api: { action, params }});
  return fetch("http://127.0.0.1:8765", {
    method: "POST",
    body: JSON.stringify({
      action,
      version: 6,
      params: fillDefault(params),
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        throw Error(res.error);
      } else {
        return res;
      }
    });
};

function fillDefault(params) {
  if (!params.note) {
    return;
  }
  // const title = execCopyq('currentWindowTitle');
  // const url = getUrl();
  // _.set(params.note, "fields.Url", url);
  // _.set(params.note, "fields.Title", title);
  return params;
}
