import { verbose } from "electron-log/main";
import { getSettings } from "./settings";

export async function postAnki(action: string, params = {}) {
  verbose(action, params);
  const { ankiConnectHost } = getSettings("settings.json");
  return fetch(ankiConnectHost, {
    method: "POST",
    body: JSON.stringify({
      action,
      version: 6,
      params: params,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        throw Error(res.error);
      } else {
        return res;
      }
    });
}
