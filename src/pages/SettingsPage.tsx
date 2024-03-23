import { FormEvent, useContext, useEffect, useState } from "react";
import { NotificationContext } from "../components/Notification";

interface formDataType {
  ankiConnectHost?: string;
  mainShortcut?: string;
  menusShortcut?: string;
  [key: string]: string;
}

const inputList = [
  { text: "Anki Connect Host", field: "ankiConnectHost" },
  { text: "Global shortcut for Settings", field: "mainShortcut" },
  { text: "Global shortcut for Menus", field: "menusShortcut" },
];

export default function SettingsPage() {
  const pushNotification = useContext(NotificationContext);
  const [formData, setFormData] = useState<formDataType>({});

  useEffect(() => {
    window.myApi.getSettings("settings.json").then((json) => {
      const defaultJson = json || {};
      setFormData(defaultJson);
    });
  }, []);
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    window.myApi.setSettings("settings.json", formData).then(() => {
      pushNotification({
        type: "success",
        body: "Success!",
      });
      alert("Please re-run the app for the new configuration to take effect");
      window.close();
    });
  }

  return (
    <div id="settings-page">
      <form onSubmit={handleSubmit}>
        {inputList.map((item) => (
          <label key={item.field}>
            <span className="text">{item.text}</span>
            <input
              type="text"
              value={formData[item.field]}
              onChange={(e) =>
                setFormData({ ...formData, [item.field]: e.target.value })
              }
            />
          </label>
        ))}
        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
}
