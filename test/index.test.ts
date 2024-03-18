jest.mock("../src/modules/logger", () => {});

const show = jest.fn();
jest.mock("../src/modules/menu", () => {
  return {
    show,
  };
});

require("../src/index");
describe("index", () => {
  test("default env is test", async () => {
    expect(process.env.NODE_ENV).toBe("test");
  });
  test("show() called", async () => {
    expect(show).toHaveBeenCalled();
  });
});
