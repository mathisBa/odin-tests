import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
});
test.describe("home", () => {
  test("tirage de 7 dés", async ({ page }) => {
    // Vérifie qu'il y a bien 7 boutons “unassigned”
    const diceButtons = page.locator("#unassigned .die");
    await expect(diceButtons).toHaveCount(7);
  });
  test("déplace dans le premier groupe", async ({ page }) => {
    const diceButtons = page.locator("#unassigned .die");
    // Clique sur le premier dé pour l’envoyer dans A
    await diceButtons.nth(0).click();
    await expect(page.locator("#A .die")).toHaveCount(1);
  });
  test("déplace dans le deuxième groupe", async ({ page }) => {
    let diceButtons = page.locator("#unassigned .die");
    // Clique sur le premier dé pour l’envoyer dans A
    await diceButtons.nth(0).click();
    let ndiceButton = page.locator("#A .die");
    // Clique sur le premier dé pour l’envoyer dans B
    await ndiceButton.nth(0).click();
    await expect(page.locator("#B .die")).toHaveCount(1);
  });
  test("submit", async ({ page }) => {
    // Valide sans avoir tout assigné → message d’erreur
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(page.locator(".message")).toHaveText(
      /Tous les dés doivent être dans A ou B/
    );
  });

  test("visual regression (ignore la première board)", async ({ page }) => {
    // on masque la board dynamique pour ne pas tenir compte des dés tirés
    await expect(page).toHaveScreenshot("home-page.png", {
      fullPage: true,
      mask: [page.locator("#unassigned")],
      maxDiffPixelRatio: 0.01,
    });
  });
});
