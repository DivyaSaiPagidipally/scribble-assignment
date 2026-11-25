import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";

const changelogUrl = new URL("../../CHANGELOG.md", import.meta.url);

describe("CHANGELOG.md", () => {
  it("exists at the repository root", () => {
    expect(statSync(changelogUrl).isFile()).toBe(true);
  });

  it("has an Unreleased section", () => {
    const changelog = readFileSync(changelogUrl, "utf8");

    expect(changelog).toMatch(/^## \[Unreleased\]\s*$/m);
  });
});
