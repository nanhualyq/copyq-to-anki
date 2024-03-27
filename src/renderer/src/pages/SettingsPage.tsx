import { NotificationContext } from '@renderer/components/Notification'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { clone } from 'lodash'

const defaultForm = {
  ankiConnectHost: '',
  mainShortcut: '',
  menusShortcut: ''
}

const inputList = [
  { text: 'Anki Connect Host', field: 'ankiConnectHost' },
  { text: 'Global shortcut for Settings', field: 'mainShortcut' },
  { text: 'Global shortcut for Menus', field: 'menusShortcut' }
]

export default function SettingsPage(): JSX.Element {
  const pushNotification = useContext(NotificationContext)
  const [formData, setFormData] = useState(clone(defaultForm))

  useEffect(() => {
    window.electron.ipcRenderer.invoke('settings:get', 'settings').then((res) => {
      const json = clone(res || defaultForm)
      if (!json.ankiConnectHost) {
        json.ankiConnectHost = import.meta.env.VITE_ANKI_DEFAULT_HOST
      }
      setFormData(json)
    })
  }, [])
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    window.electron.ipcRenderer.invoke('settings:set', 'settings', formData).then(() => {
      pushNotification({
        type: 'success',
        body: 'Saved!'
      })
    })
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
              onChange={(e): void => setFormData({ ...formData, [item.field]: e.target.value })}
            />
          </label>
        ))}
        <button type="submit">Save Settings</button>
      </form>
    </div>
  )
}
