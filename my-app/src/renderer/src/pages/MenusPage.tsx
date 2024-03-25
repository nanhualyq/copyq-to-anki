import { useContext, useEffect, useState } from 'react'
import { NotificationContext } from '../components/Notification'

export interface Menu {
  name: string
}

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const pushNotification = useContext(NotificationContext)

  useEffect(() => {
    window.electron.ipcRenderer.invoke('settings:get', 'menus').then((res) => setMenus(res || []))
  }, [])
  function handleEdit(index: number, textContent: string | null): void {
    const newArr = menus.slice()
    newArr[index] = JSON.parse(textContent + '')
    setMenus(newArr)
  }

  function handleAdd(): void {
    setMenus([...menus, { name: `new menu ${crypto.randomUUID()}` }])
  }

  function handleDelete(index: number): void {
    setMenus(menus.filter((v, i) => i !== index))
  }

  function handleMove(index: number, offset: number): void {
    let newArr = menus.slice()
    newArr[index] = menus[index + offset]
    newArr[index + offset] = menus[index]
    setMenus(newArr)
  }

  function handleSave(event) {
    event.preventDefault()
    window.electron.ipcRenderer
      .invoke('settings:set', 'menus', menus)
      .then(() => {
        pushNotification({
          type: 'success',
          body: 'Saved!'
        })
      })
  }

  return (
    <div id="menus-page">
      {menus.map((item, index) => (
        <details key={item.name}>
          <summary>
            {item.name}
            {index !== 0 && <button onClick={() => handleMove(index, -1)}>Up</button>}
            {index !== menus.length - 1 && (
              <button onClick={() => handleMove(index, 1)}>Down</button>
            )}
            <button onClick={() => handleDelete(index)}>Delete</button>
          </summary>
          <pre
            contentEditable
            onBlur={(e) => handleEdit(index, e.target.textContent)}
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(item, null, 2)
            }}
          ></pre>
        </details>
      ))}
      <div className="buttons">
        <button onClick={handleAdd}>Add Menu</button>
        <button onClick={handleSave}>Save all menus</button>
      </div>
    </div>
  )
}
