const child_process = require("child_process");

exports.execCopyq = function (command) {
    return child_process.execSync(`copyq ${command}`).toString()
}