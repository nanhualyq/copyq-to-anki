
const execSync = jest.fn(() => new Buffer([]));
jest.mock("child_process", () => ({
    execSync,
}));
import { execCopyq, getSelection, getTitle, getUrl } from "../../src/modules/copyq"

describe("copyq", () => {
  test("execCopyq no arguments", () => {
    execCopyq('')
    expect(execSync).toHaveBeenCalledWith('copyq ');
  });
  test("execCopyq with command", () => {
    execCopyq('do something')
    expect(execSync).toHaveBeenCalledWith('copyq do something');
  });
  test("getUrl", () => {
    getUrl()
    expect(execSync).toHaveBeenCalledWith('copyq selection text/x-moz-url-priv');
  });
  test("getTitle", () => {
    getTitle()
    expect(execSync).toHaveBeenCalledWith('copyq currentWindowTitle');
  });
  test("execCopyq no arguments", () => {
    getSelection()
    expect(execSync.mock.lastCall).toEqual(['copyq selection ']);
  });
  test("execCopyq with mime", () => {
    getSelection('text/html')
    expect(execSync).toHaveBeenCalledWith('copyq selection text/html');
  });
});
