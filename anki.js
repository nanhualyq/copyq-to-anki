const _ = require("lodash");
const { getUrl } = require("./functions");

exports.post = async function post(action, params = {}) {
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
  //   const title = child_process.execSync("copyq currentWindowTitle");
  const url = getUrl();
  if (url.startsWith("https://tiddlywiki.com")) {
    setTagToDefault(params, "TiddlyWiki");
  }
  if (
    url.startsWith(
      "https://zh.wikipedia.org/zh-cn/%E4%B8%AD%E5%9B%BD%E5%8E%86%E5%8F%B2"
    )
  ) {
    setTagToDefault(params, "中国历史");
  }
  if (url.startsWith("https://awesomewm.org")) {
    setTagToDefault(params, "AwesomeWM");
  }
  return params;
}

function setTagToDefault(params, tag) {
  _.set(params.note, "deckName", "Default");
  _.set(params.note, "tags", [tag]);
}
