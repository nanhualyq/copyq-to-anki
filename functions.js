const child_process = require("child_process");
exports.getUrl = function () {
  return child_process
    .execSync(`copyq selection text/x-moz-url-priv`)
    .toString();
};
exports.getSelection = function (mime = '') {
  return child_process.execSync(`copyq selection ${mime}`).toString();
};
