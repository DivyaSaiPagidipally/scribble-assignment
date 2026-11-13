import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readme = readFileSync(new URL("../../README.md", import.meta.url), "utf8");

describe("README", () => {
  it("describes the app", () => {
    expect(readme).toContain("Scribble is a starter for a multiplayer drawing and guessing game.");
  });

  it("puts the app description in its own paragraph", () => {
    expect(readme.split(/\r?\n\s*\r?\n/)).toContain(
      "Scribble is a starter for a multiplayer drawing and guessing game.",
    );
  });
});
