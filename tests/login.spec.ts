import { test } from "@playwright/test";

test("User login flow works as expected", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("heading", { name: "Sign in" });
  await page.getByPlaceholder("Email or Username");
  await page
    .getByPlaceholder("Email or Username")
    .fill("testing.example@populist.us");
  await page.getByPlaceholder("Email or Username").press("Tab");
  await page.getByPlaceholder("Password").fill("p");
  await page.locator('[aria-label="show password"]').click();
  await page.isVisible('text="somesupersecurepassword"');
  await page.locator('[aria-label="hide password"]').click();
  await page.getByRole("button", { name: "Sign In" }).click();
  await page
    .getByText("Your email or username was not found in our database")
    .click();
});
