const { execCopyq } = require("./copyq");
exports.getUrl = function () {
  return execCopyq('selection text/x-moz-url-priv')
};
exports.getSelection = function (mime = '') {
  return execCopyq(`selection ${mime}`);
};
