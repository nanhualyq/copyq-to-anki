import settings from 'electron-settings'

async function postAnki(action: string, params = {}): Promise<unknown> {
  const ankiConnectHost =
    settings.getSync('settings.ankiConnectHost') || import.meta.env.VITE_ANKI_DEFAULT_HOST
  return fetch(ankiConnectHost + '', {
    method: 'POST',
    body: JSON.stringify({
      action,
      version: 6,
      params: params
    })
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        throw Error(res.error)
      } else {
        return res
      }
    })
}

export default function (menu): void {
  postAnki(menu.anki.action, menu.anki.params)
}
