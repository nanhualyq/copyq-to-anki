const child_process = require("child_process");

function execCopyq(command) {
  return child_process.execSync(`copyq ${command}`).toString();
}
exports.execCopyq = execCopyq;

exports.getUrl = function () {
  return execCopyq("selection text/x-moz-url-priv");
};
exports.getSelection = function (mime = "") {
  return execCopyq(`selection ${mime}`);
};
