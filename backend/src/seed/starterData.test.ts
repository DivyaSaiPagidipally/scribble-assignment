import { describe, expect, it } from "vitest";
import { STARTER_WORDS } from "./starterData.js";

describe("starter data", () => {
  it("contains the full starter word list", () => {
    expect(STARTER_WORDS).toEqual([
      "rocket",
      "pizza",
      "castle",
      "guitar",
      "sunflower",
      "balloon",
      "dragon",
      "umbrella"
    ]);
  });
});
