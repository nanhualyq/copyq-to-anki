import logger from "./logger";

export async function postAnki(action: string, params = {}) {
  logger.info("anki-connect", { api: { action, params } });
  return fetch("http://127.0.0.1:8765", {
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
