import { shell } from 'electron'

export default function (menu): void {
  shell.openExternal(menu.url)
}
