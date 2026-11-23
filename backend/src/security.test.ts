import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("SECURITY.md", () => {
  it("exists at the repository root", () => {
    expect(statSync(new URL("../../SECURITY.md", import.meta.url)).isFile()).toBe(true);
  });

  it("directs vulnerability reports to a private GitHub security advisory, not public issues", () => {
    const policy = readFileSync(new URL("../../SECURITY.md", import.meta.url), "utf8");

    expect(policy).toMatch(/report vulnerabilities privately by opening a \[GitHub security advisory\]/i);
    expect(policy).toContain("https://github.com/DivyaSaiPagidipally/scribble-assignment/security/advisories/new");
    expect(policy).toMatch(/Do not report vulnerabilities through public issues/i);
  });
});
