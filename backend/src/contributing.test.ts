import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("CONTRIBUTING.md", () => {
  it("lists local install and start commands for both apps", () => {
    const guide = readFileSync(new URL("../../CONTRIBUTING.md", import.meta.url), "utf8");

    expect(guide).toMatch(/```bash\s+cd backend\s+npm install\s+npm run dev\s+```/);
    expect(guide).toMatch(
      /```bash\s+cd frontend\s+npm install\s+VITE_API_URL=http:\/\/localhost:3001 npm run dev\s+```/
    );
  });
});
