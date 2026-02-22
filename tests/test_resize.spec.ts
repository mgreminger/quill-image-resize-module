import { test, expect } from "@playwright/test";

test("resize using mouse drag", async ({ page, browserName }) => {
  await page.goto("http://localhost:5173/");

  await page.locator("img").first().click();

  await expect(page.locator("text=64 × 64")).toBeVisible();

  const bounds = await page.locator("div.nwse-resize").nth(1).boundingBox();

  expect(bounds).toBeTruthy();

  const mouseX = bounds!.x + bounds!.width / 2;
  const mouseY = bounds!.y + bounds!.height / 2;

  await page.locator("div.nwse-resize").nth(1).hover();
  await page.mouse.down();
  await page.mouse.move(mouseX + 30, mouseY);
  await page.mouse.up();

  await expect(page.locator("text=94 × 94")).toBeVisible();

  expect(await page.locator("img").first().getAttribute("width")).toBe("94");
});

test("resize using keyboard shortcuts", async ({ page, browserName }) => {
  await page.goto("http://localhost:5173/");

  await page.locator("img").first().click();

  await expect(page.locator("text=64 × 64")).toBeVisible();

  for (let i = 0; i < 3; i++) await page.keyboard.press("+");

  await expect(page.locator("text=94 × 94")).toBeVisible();

  expect(await page.locator("img").first().getAttribute("width")).toBe("94");
});

test("setting alt text", async ({ page, browserName }) => {
  await page.goto("http://localhost:5173/");

  await page.locator("img").first().click();
  await page.getByRole("textbox", { name: "Alt Text:" }).click();
  await page.getByRole("textbox", { name: "Alt Text:" }).fill("Image one");

  await page.locator("img").nth(1).click();
  await page.keyboard.press("a"); // keyboard shortcut to focus alt text text area
  await expect(page.getByRole("textbox", { name: "Alt Text:" })).toBeFocused();
  await page.getByRole("textbox", { name: "Alt Text:" }).fill("Image two");

  await expect(page.locator("img").nth(0)).toHaveAttribute("alt", "Image one");
  await expect(page.locator("img").nth(1)).toHaveAttribute("alt", "Image two");
});
