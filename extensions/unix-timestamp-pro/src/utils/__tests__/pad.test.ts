import { pad2 } from "../pad";

describe("pad2", () => {
  it("should pad single digit numbers", () => {
    expect(pad2(0)).toBe("00");
    expect(pad2(1)).toBe("01");
    expect(pad2(9)).toBe("09");
  });

  it("should not pad double digit numbers", () => {
    expect(pad2(10)).toBe("10");
    expect(pad2(99)).toBe("99");
    expect(pad2(12)).toBe("12");
  });

  it("should handle string input", () => {
    expect(pad2("1")).toBe("01");
    expect(pad2("05")).toBe("05");
    expect(pad2("23")).toBe("23");
  });

  it("should handle edge cases", () => {
    expect(pad2("0")).toBe("00");
    expect(pad2(0)).toBe("00");
  });
});
