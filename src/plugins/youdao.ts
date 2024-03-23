import { load } from "cheerio";
import { Notification, clipboard } from "electron";

async function parseWord(text: string) {
  const res = await fetch(
    `https://dict.youdao.com/result?word=${text}&lang=en`
  ).then((res) => res.text());

  const $ = load(res);

  let expList = $("#catalogue_author .word-exp");
  if (expList.length === 0) {
    expList = $("#catalogue_author .trans-content");
  }
  let Exp = "";
  expList.each((i, e) => {
    const text = $(e).text();
    // skip person name
    // 【名】for button
    // 人名 for loving
    if (text.startsWith("【名】") || text.includes("人名")) {
      return;
    }
    Exp += (i === 0 ? "" : "<br>") + text;
  });

  return {
    Word: text,
    Exp,
    Phone: $(".phone_con").text(),
  };
}

export default async function (cb: (arg1?: unknown) => void) {
  const text = clipboard.readText("selection");
  const arr = text?.split("\n");
  let success = 0;
  for (let i = 0; i < arr.length; i++) {
    const word = arr[i].trim();
    if (!word || word.length > 200) {
      // childLogger.info("skip line", { word });
      continue;
    }
    if (i > 0) {
      await new Promise((resolve) => setTimeout(resolve, 4000));
    }
    try {
      const fields = await parseWord(word);
      cb(fields);
      success++;
    } catch (error) {
      // childLogger.error("word parse", error);
    }
  }
  // execCopyq(`popup 'youdao batch finish: ${success}/${arr.length}'`);
  new Notification({
    title: "youdao batch finish",
    body: `${success}/${arr.length}`,
  }).show();
}
