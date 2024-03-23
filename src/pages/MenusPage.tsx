import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../components/Notification";

export default function MenusPage() {
  const [menus, setMenus] = useState([]);
  const pushNotification = useContext(NotificationContext)
  
  useEffect(() => {
    window.myApi.getSettings("menus.json").then((res) => {
      setMenus(res || []);
    });
  }, []);
  function handleEdit(index: number, textContent: string): void {
    const newArr = menus.slice();
    newArr[index] = JSON.parse(textContent);
    setMenus(newArr);
  }

  function handleAdd(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    setMenus([...menus, { name: `new menu ${crypto.randomUUID()}` }]);
  }

  function handleDelete(index: number): void {
    setMenus(menus.filter((v, i) => i !== index));
  }

  function handleMove(index: number, offset: number): void {
    let newArr = menus.slice();
    newArr[index] = menus[index + offset];
    newArr[index + offset] = menus[index];
    setMenus(newArr);
  }

  function handleSave(event: MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    window.myApi.setSettings("menus.json", menus).then(() => {
      pushNotification({
        type: "success",
        body: "Success!",
      });
    });
  }

  return (
    <div id="menus-page">
      {menus.map((item, index) => (
        <details key={item.name}>
          <summary>
            {item.name}
            {index !== 0 && (
              <button onClick={() => handleMove(index, -1)}>Up</button>
            )}
            {index !== menus.length - 1 && (
              <button onClick={() => handleMove(index, 1)}>Down</button>
            )}
            <button onClick={() => handleDelete(index)}>Delete</button>
          </summary>
          <pre
            contentEditable
            onBlur={(e) => handleEdit(index, e.target.textContent)}
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(item, null, 2),
            }}
          ></pre>
        </details>
      ))}
      <div className="buttons">
        <button onClick={handleAdd}>Add Menu</button>
        <button onClick={handleSave}>Save all menus</button>
      </div>
    </div>
  );
}
