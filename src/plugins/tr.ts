import { Cheerio, Element, load } from "cheerio";
import { execCopyq, getSelection } from "../modules/copyq";

export default function (cb: (arg0: Cheerio<Element>) => void) {
  const selection = getSelection("text/html");
  const $ = load(selection);
  $("tr").each((i, e) => {
    cb($(e).find("td"));
  });
  execCopyq(`popup 'Table Row finish: ${$("tr").length}'`);
}
