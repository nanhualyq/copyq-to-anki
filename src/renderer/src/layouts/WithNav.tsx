import { PropsWithChildren, useEffect } from 'react'

export default function WithNavLayout({ children }: PropsWithChildren): JSX.Element {
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        window.electron.ipcRenderer.invoke('toggleMainWindow')
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])
  function activeClass(href = ''): string {
    if (!location.hash && href === '#settings') {
      return 'active'
    }
    return location.hash === href ? 'active' : ''
  }
  return (
    <div id="layout-with-nav">
      <div className="left">
        <ul>
          <li>
            <a href="#settings" className={activeClass('#settings')}>
              Settings
            </a>
          </li>
          <li>
            <a href="#menus" className={activeClass('#menus')}>
              Menus
            </a>
          </li>
          <li>
            <a href="#logs" className={activeClass('#logs')}>
              Logs
            </a>
          </li>
        </ul>
      </div>
      <div className="right">{children}</div>
    </div>
  )
}
