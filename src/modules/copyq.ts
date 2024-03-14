import { execSync } from "child_process";

export function execCopyq(command: string) {
  return execSync(`copyq ${command}`).toString();
}

export function getUrl() {
  return execCopyq("selection text/x-moz-url-priv");
}
export function getTitle() {
  return execCopyq("currentWindowTitle").trim();
}
export function getSelection(mime = "") {
  return execCopyq(`selection ${mime}`);
}
