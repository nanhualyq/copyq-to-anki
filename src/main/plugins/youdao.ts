import { load } from 'cheerio'
import { Notification, clipboard } from 'electron'
import { info, error } from 'electron-log/main'

async function parseWord(text: string) {
  const res = await fetch(`https://dict.youdao.com/result?word=${text}&lang=en`).then((res) =>
    res.text()
  )

  const $ = load(res)

  let expList = $('#catalogue_author .word-exp')
  if (expList.length === 0) {
    expList = $('#catalogue_author .trans-content')
  }
  const Exp = expList
    .map((i, el) => $(el).text())
    .toArray()
    .filter((row) => !(row.startsWith('【名】') || row.includes('人名')))
    .join('<br>')

  return {
    Word: text,
    Exp,
    Phone: $('.phone_con').text()
  }
}

export default async function (cb: (arg1?: unknown) => void) {
  const text = clipboard.readText('selection')
  const arr = text?.split('\n')
  let success = 0
  for (let i = 0; i < arr.length; i++) {
    const word = arr[i].trim()
    if (!word || word.length > 200) {
      info('skip line', word)
      continue
    }
    if (i > 0) {
      await new Promise((resolve) => setTimeout(resolve, 4000))
    }
    try {
      const fields = await parseWord(word)
      cb(fields)
      success++
    } catch (err) {
      error('word parse error:', err)
    }
  }
  new Notification({
    title: 'youdao batch finish',
    body: `${success}/${arr.length}`
  }).show()
}
