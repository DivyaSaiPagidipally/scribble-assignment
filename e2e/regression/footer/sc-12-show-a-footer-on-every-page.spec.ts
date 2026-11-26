import { expect, test, type Page } from "@playwright/test";

async function expectSiteFooter(page: Page) {
  const footer = page.getByRole("contentinfo", { name: "Site footer", exact: true });
  await expect(footer).toHaveCount(1);
  await expect(footer).toBeVisible();
  await expect(footer).toHaveText("Scribble lab · starter build");
}

test.describe("Show a footer on every page", () => {
  test("SC-12 TC-01 Show the labelled build footer on every page", { tag: ["@smoke"] }, async ({ page }) => {
    const playerName = `player_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    await test.step("Open the start page", async () => {
      await page.goto("/");
      await expect(page.getByRole("heading", { name: "Scribble Game", exact: true })).toBeVisible();
      await expectSiteFooter(page);
    });

    await test.step("Open Create Room", async () => {
      await page.getByRole("link", { name: "Create Room", exact: true }).click();
      await expect(page.getByRole("heading", { name: "Create Room", exact: true })).toBeVisible();
      await expectSiteFooter(page);
    });

    await test.step("Enter a player name", async () => {
      await page.getByLabel("Player name", { exact: true }).fill(playerName);
    });

    await test.step("Create the room and enter the lobby", async () => {
      await page.getByRole("button", { name: "Create and Continue", exact: true }).click();
      await expect(page.getByRole("heading", { name: "Lobby", exact: true })).toBeVisible();
      await expectSiteFooter(page);
    });

    await test.step("Start the game", async () => {
      await page.getByRole("button", { name: "Start Game", exact: true }).click();
      await expect(page.getByRole("heading", { name: "Guess the Word!", exact: true })).toBeVisible();
      await expectSiteFooter(page);
    });

    await test.step("Open Join Room", async () => {
      await page.goto("/join-room");
      await expect(page.getByRole("heading", { name: "Join Room", exact: true })).toBeVisible();
      await expectSiteFooter(page);
    });

    await test.step("Return to Create Room", async () => {
      await page.goto("/create-room");
      await expect(page.getByRole("heading", { name: "Create Room", exact: true })).toBeVisible();
      await expectSiteFooter(page);
    });
  });
});
