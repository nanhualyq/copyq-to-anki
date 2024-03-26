import { useEffect, useRef, useState } from 'react'

export default function LogsPage(): JSX.Element {
  const [logs, setLogs] = useState(null)
  const preRef = useRef(null)
  function scrollEnd(): void {
    if (preRef.current) {
      const element: Element = preRef.current
      console.log(element, `element`)

      element.scrollTop = element.scrollHeight
    }
  }
  if (logs) {
    scrollEnd()
  }
  useEffect(() => {
    function fetchLogs(): void {
      window.electron.ipcRenderer.invoke('getLogs').then(setLogs)
    }
    fetchLogs()
    const id = setInterval(fetchLogs, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <pre ref={preRef} id="logs-page">
      {logs}
    </pre>
  )
}
