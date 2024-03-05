const child_process = require("child_process");
const cheerio = require("cheerio");
const { getUrl, getSelection } = require("./functions");
const { post } = require("./anki");
const logger = require("./logger");

async function makeNote(text) {
  if (!text) {
    throw Error("no text");
  }
  const res = await fetch(
    `https://dict.youdao.com/result?word=${text}&lang=en`
  ).then((res) => res.text());

  const $ = cheerio.load(res);

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
    deckName: "AI English",
    modelName: "AH YouDao",
    fields: {
      Word: text,
      Exp,
      Phone: $(".phone_con").text(),
      Url: getUrl(),
    },
    audio: [
      {
        url: `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${text}`,
        filename: `google-${Date.now()}.mp3`,
        // skipHash: "7e2c2f954ef6051373ba916f000168dc",
        fields: ["Audio"],
      },
    ],
  };
};
exports.makeNote = makeNote

exports.addYoudao = async function addYoudao() {
  const selection = getSelection();
  const note = await makeNote(selection);
  post("guiAddCards", { note });
};

exports.addYoudaoBatch = async function addYoudaoBatch() {
  const text = getSelection();
  const count = {
    total: 0,
    skip: 0,
    error: 0,
  };
  let lastTime = 0;
  for (const line of text?.split("\n")) {
    count.total++;
    if (!line.trim() || line.length > 200) {
      logger.warn("skip" + " " + count.total + " " + line);
      count.skip++;
      continue;
    }
    try {
      if (Date.now() - lastTime < 4000) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
      }
      logger.info(count.total + " " + line);
      const note = await makeNote(line);
      lastTime = Date.now();
      await post("addNote", { note });
    } catch (error) {
      count.error++;
      logger.error(error);
    }
  }
  let message = `Success: ${count.total - count.skip - count.error}`;
  for (const key of ["skip", "error"]) {
    if (count[key]) {
      message += `\n${key}: ${count[key]}`;
    }
  }
  child_process.execSync(
    `copyq popup '${message}'`
  );
};
