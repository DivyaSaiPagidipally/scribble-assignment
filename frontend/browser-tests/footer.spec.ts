import { expect, test, type Page } from "@playwright/test";

async function expectFooterBelowContent(page: Page) {
  const main = page.locator(".app-shell > main");
  const footer = page.locator(".app-shell > footer");
  await expect(footer).toHaveText("Scribble lab · starter build");
  await footer.scrollIntoViewIfNeeded();
  const mainBox = await main.boundingBox();
  const footerBox = await footer.boundingBox();
  expect(mainBox).not.toBeNull();
  expect(footerBox).not.toBeNull();
  expect(footerBox!.y).toBeGreaterThanOrEqual(mainBox!.y + mainBox!.height + 16);
  expect(footerBox!.x).toBeGreaterThanOrEqual(0);
  expect(footerBox!.x + footerBox!.width).toBeLessThanOrEqual(320);
}

test("footer stays below each page's content at phone width", async ({ page }) => {
  await page.route("**/rooms", async (route) => {
    await route.fulfill({ json: {
      participantId: "p1",
      room: { code: "ABCD", status: "lobby", participants: [{ id: "p1", name: "Ada", role: "drawer", joinedAt: "2025-01-01" }], availableWords: [], roles: ["drawer", "guesser"] }
    } });
  });

  await page.goto("/");
  await expectFooterBelowContent(page);
  await page.getByRole("link", { name: "Join Room" }).click();
  await expect(page.getByRole("heading", { name: "Join Room" })).toBeVisible();
  await expectFooterBelowContent(page);
  await page.getByRole("button", { name: "Back" }).click();
  await page.getByRole("link", { name: "Create Room" }).click();
  await expectFooterBelowContent(page);
  await page.getByLabel("Player name").fill("Ada");
  await page.getByRole("button", { name: "Create and Continue" }).click();
  await expect(page.getByRole("heading", { name: "Lobby" })).toBeVisible();
  await expectFooterBelowContent(page);
  await page.getByRole("button", { name: "Start Game" }).click();
  await expect(page.getByRole("heading", { name: "Guess the Word!" })).toBeVisible();
  await expectFooterBelowContent(page);
});
