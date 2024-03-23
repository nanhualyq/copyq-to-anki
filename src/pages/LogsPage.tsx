import { useEffect, useRef, useState } from "react";

export default function LogsPage() {
  const [logs, setLogs] = useState(null);
  const preRef = useRef();
  function scrollEnd() {
    const element: Element = preRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
  if (logs) {
      scrollEnd();
  }
  useEffect(() => {
    function fetchLogs() {
      window.myApi.getLogs().then(setLogs);
    }
    fetchLogs();
    const id = setInterval(fetchLogs, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <pre ref={preRef} id="logs-page">
      {logs}
    </pre>
  );
}
