import { execSync } from 'child_process'
import { escape } from 'lodash'

export function execShell(code: string): string {
  return execSync(code).toString().trim()
}

export function wrapCode(content: string): string {
  return `<pre style="text-align: left;"><code>${escape(content)}</code></pre>`
}
