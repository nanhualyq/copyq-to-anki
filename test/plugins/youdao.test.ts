const execCopyq = jest.fn();
const getSelection = jest.fn();
jest.mock("../../src/modules/copyq", () => ({
  execCopyq,
  getSelection,
}));

const cb = jest.fn();
const fetch = jest.spyOn(global, "fetch");

import youdao from "../../src/plugins/youdao";

jest.mock("../../src/modules/logger", () => ({
  child: () => ({
    info: () => {},
    error: () => {},
  }),
}));

jest.spyOn(global, "setTimeout").mockImplementation((callback) => {
  if (typeof callback === "function") {
    callback();
  }
  return { hasRef: () => false } as NodeJS.Timeout;
});

afterEach(() => {
  cb.mockClear();
});

describe("youdao", () => {
  test("word is empty", () => {
    getSelection.mockReturnValueOnce("");
    youdao(cb);
    expect(cb).not.toHaveBeenCalled();
  });
  test("word > 200", () => {
    getSelection.mockReturnValueOnce("123".repeat(100));
    youdao(cb);
    expect(cb).not.toHaveBeenCalled();
  });
  test("word of one line", async () => {
    getSelection.mockReturnValueOnce("1");
    fetch.mockResolvedValue(new Response(""));
    await youdao(cb);
    expect(cb).toHaveBeenCalled();
  });
  test("word of five lines", async () => {
    getSelection.mockReturnValueOnce("1\n2\n3\n4\n5");
    fetch.mockResolvedValueOnce(new Response(Date.now() + ""));
    await youdao(() => {
      cb();
      fetch.mockResolvedValueOnce(new Response(Date.now() + ""));
    });
    expect(cb).toHaveBeenCalledTimes(5);
  });
  test("parseWord works", (done) => {
    getSelection.mockReturnValueOnce("1");
    fetch.mockResolvedValueOnce(new Response('html'));
    youdao((res) => {
      try {
        expect(res).toMatchObject({Word: '1', Exp: '', Phone: ''})
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});
