import { createContext, useEffect, useState } from "react";

export const NotificationContext = createContext(null);

export default function Notification({ children }) {
  const [list, setList] = useState([]);
  function pushNotification(item: Object) {
    const newItem = { ...item, id: Date.now() + "" };
    setList([...list, newItem]);
    setTimeout(() => {
      removeNotification(newItem);
    }, 5000);
  }
  function removeNotification(target: Object) {
    setList((list) => list.filter((item) => item !== target));
  }
  return (
    <NotificationContext.Provider value={pushNotification}>
      {children}
      <div id="notification">
        {list.map((item) => (
          <NotificationItem
            key={item.id}
            item={item}
            onRemove={() => removeNotification(item)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

function NotificationItem({ item, onRemove }) {
  return (
    <div className={'item ' + item.type} onClick={onRemove}>
      {item.body}
    </div>
  );
}
