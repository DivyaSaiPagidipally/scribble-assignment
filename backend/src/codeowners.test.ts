import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe(".github/CODEOWNERS", () => {
  it("assigns every file to @DivyaSaiPagidipally without overrides", () => {
    const codeowners = readFileSync(new URL("../../.github/CODEOWNERS", import.meta.url), "utf8");
    const rules = codeowners.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));

    expect(rules).toEqual(["* @DivyaSaiPagidipally"]);
  });
});
