jest.mock("../../src/modules/logger", () => {});
const readFileSync = jest.fn();
jest.mock("fs", () => ({
  readFileSync,
}));
const execCopyq = jest.fn(() => "");
jest.mock("../../src/modules/copyq", () => ({
  execCopyq,
}));
const postAnki = jest.fn();
jest.mock("../../src/modules/anki", () => ({
  postAnki,
}));
import { show } from "../../src/modules/menu.ts";

describe("menu", () => {
  test("menu.json is not json", () => {
    readFileSync.mockReturnValueOnce("][");
    expect(show).toThrow("is not valid JSON");
  });
  test("menu.json is not array", () => {
    readFileSync.mockReturnValueOnce("321");
    expect(show).toThrow("Menus format is wrong");
  });
  test("menu.json type is wrong", () => {
    readFileSync.mockReturnValueOnce(JSON.stringify([123]));
    expect(show).toThrow("Menu no name");
  });
  test("menu.json copyq get right params", () => {
    const json = [{ name: "123" }, { name: "456" }];
    readFileSync.mockReturnValueOnce(JSON.stringify(json));
    show();
    expect(execCopyq).toHaveBeenCalledWith("eval \"menuItems('123','456')\"");
  });
  test("selected item is not existed", () => {
    const json = [{ name: "123" }];
    readFileSync.mockReturnValueOnce(JSON.stringify(json));
    execCopyq.mockReturnValueOnce("456");
    show();
    expect(postAnki).not.toHaveBeenCalled();
  });
  test("selected item is existed", () => {
    const json = [{ name: "123", anki: {} }];
    readFileSync.mockReturnValueOnce(JSON.stringify(json));
    execCopyq.mockReturnValueOnce("123");
    show();
    expect(postAnki).toHaveBeenCalled();
  });
});

describe("menu exec code", () => {
  test("1 + 1", () => {
    const json = [{ name: "123", anki: {action: '{{1+1}}'} }];
    readFileSync.mockReturnValueOnce(JSON.stringify(json));
    execCopyq.mockReturnValueOnce("123");
    show();
    expect(postAnki).toHaveBeenCalledWith('2', undefined);
  });
  test.skip("plugin result", () => {
    const json = [{ name: "menu1", plugin: 'youdao', anki: {action: '{{pluginResult.result}}'} }];
    readFileSync.mockReturnValueOnce(JSON.stringify(json));
    execCopyq.mockReturnValueOnce("menu1");
    show();
    expect(postAnki).toHaveBeenCalledWith('something', undefined);
  });
});
