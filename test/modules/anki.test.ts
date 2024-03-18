jest.mock("../../src/modules/logger", () => ({
  info: jest.fn(),
}));
import { postAnki } from "../../src/modules/anki";

global.fetch = jest.fn(() => new Promise(() => {}));

describe("anki", () => {
  test("postAnki call fetch", () => {
    postAnki("action", "params");
    expect(fetch).toHaveBeenCalled();
  });
  test("postAnki response error", async () => {
    const spy = jest.spyOn(global, "fetch");
    const errorMsg = "this is an error";
    spy.mockReturnValue(
      Promise.resolve(new Response(JSON.stringify({ error: errorMsg })))
    );
    try {
      await postAnki("action", "params");
    } catch (error) {
      expect(error).toEqual(Error(errorMsg));
    }
  });
  test("postAnki response right data", async () => {
    const spy = jest.spyOn(global, "fetch");
    const rightData = { data: "something" };
    spy.mockReturnValue(
      Promise.resolve(new Response(JSON.stringify(rightData)))
    );
    const data = await postAnki("action", "params");
    expect(data).toEqual(rightData);
  });
});
