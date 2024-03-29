import { useEffect, useState } from 'react'
import { Menu } from './MenusPage'

const keys: string[] = []
// 1-9
for (let i = 1; i <= 9; i++) {
  keys.push(i + '')
}
keys.push('0')
// a-z
for (let i = 97; i <= 122; i++) {
  keys.push(String.fromCharCode(i))
}

export default function QuickMenuPage(): JSX.Element {
  const [menus, setMenus] = useState<Menu[]>([])
  const [keyword, setKeyword] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const menusByKeyword = menus.filter((m) =>
    m.name.toLowerCase().includes(keyword.toLocaleLowerCase())
  )

  useEffect(() => {
    window.electron.ipcRenderer.invoke('settings:get', 'menus').then((res) => setMenus(res || []))
  }, [])

  useEffect(() => {
    function handleKeyup(e: KeyboardEvent): void {
      //   console.log(e.key, `e.key`);
      if (e.key === 'Escape') {
        return window.close()
      }
      if (e.key === 'ArrowUp') {
        return setActiveIndex(activeIndex === 0 ? menusByKeyword.length - 1 : activeIndex - 1)
      }
      if (e.key === 'ArrowDown') {
        return setActiveIndex(activeIndex < menusByKeyword.length - 1 ? activeIndex + 1 : 0)
      }
      if (e.key === 'Enter') {
        return handleMenu(menusByKeyword[activeIndex])
      }
      const i = keys.findIndex((key) => key === e.key)
      if (menusByKeyword[i]) {
        handleMenu(menusByKeyword[i])
      }
    }
    window.addEventListener('keyup', handleKeyup)
    return () => window.removeEventListener('keyup', handleKeyup)
  }, [menusByKeyword])

  function handleMenu(menu: Menu): void {
    window.electron.ipcRenderer.invoke('execMenu', menu)
  }

  return (
    <div id="quick-menu">
      <input
        value={keyword}
        onChange={(e): void => setKeyword(e.target.value)}
        placeholder="Press Tab to start filter"
      />
      <ul>
        {menusByKeyword.map((menu, i) => (
          <li
            key={menu.name}
            className={i === activeIndex ? 'active' : ''}
            onClick={(): void => handleMenu(menu)}
          >
            <span className="shortcut">{keys[i]}</span>
            {menu.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
