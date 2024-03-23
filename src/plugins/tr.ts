import { Cheerio, Element, load } from "cheerio";
import { Notification, clipboard } from "electron";

export default function (cb: (arg0: Cheerio<Element>) => void) {
  const selection = clipboard.readHTML('selection')
  const $ = load(selection);
  $("tr").each((i, e) => {
    cb($(e).find("td"));
  });
  new Notification({
    title: 'Table Row finish',
    body: $("tr").length + ''
  }).show()
}
