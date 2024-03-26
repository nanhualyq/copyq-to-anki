import { writeFile } from 'fs'

export default function (menu): void {
  writeFile(menu?.file?.file, menu?.file?.data, 'utf-8', () => {})
}
