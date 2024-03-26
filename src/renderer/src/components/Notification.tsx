import { createContext, useState } from 'react'

interface Item {
  id?: string
  type: string
  body: string
}

export const NotificationContext = createContext<(item:Item) => void>(() => {})

export default function Notification({ children }) {
  const [list, setList] = useState<Item[]>([])
  function pushNotification(item: Item) {
    const newItem = { ...item, id: Date.now() + '' }
    setList([...list, newItem])
    setTimeout(() => {
      removeNotification(newItem)
    }, 5000)
  }
  function removeNotification(target: Item) {
    setList((list) => list.filter((item) => item !== target))
  }
  return (
    <NotificationContext.Provider value={pushNotification}>
      {children}
      <div id="notification">
        {list.map((item) => (
          <NotificationItem key={item.id} item={item} onRemove={() => removeNotification(item)} />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

function NotificationItem({ item, onRemove }) {
  return (
    <div className={'item ' + item.type} onClick={onRemove}>
      {item.body}
    </div>
  )
}
