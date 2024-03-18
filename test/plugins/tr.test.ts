
const execCopyq = jest.fn();
const getSelection = jest.fn();
jest.mock("../../src/modules/copyq", () => ({
  execCopyq,
  getSelection,
}));
const cb = jest.fn();

import tr from "../../src/plugins/tr";

describe("tr", () => {
  test("no selection", () => {
    getSelection.mockReturnValueOnce("");
    tr(cb);
    expect(cb).not.toHaveBeenCalled();
  });
  test("selection five trs", () => {
    getSelection.mockReturnValueOnce(`<table>
    ${'<tr><td>1</td></tr>'.repeat(5)}
    </table>`);
    tr(cb);
    expect(cb).toHaveBeenCalledTimes(5);
  });
});
