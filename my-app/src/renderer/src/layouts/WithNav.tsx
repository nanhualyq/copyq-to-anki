export default function WithNavLayout({ children }) {
  function activeClass(href = '') {
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
            <a href="#menus" className={activeClass('#menus')}>Menus</a>
          </li>
          <li>
            <a href="#logs" className={activeClass('#logs')}>Logs</a>
          </li>
        </ul>
      </div>
      <div className="right">{children}</div>
    </div>
  )
}
