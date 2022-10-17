import { test } from "@playwright/test";

test("User login flow works as expected", async ({ page }) => {
  await page.goto("/login");
  await page.locator('h1:has-text("Sign In")').click();
  
});
