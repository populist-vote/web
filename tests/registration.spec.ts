import { randomUUID } from "node:crypto";
import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test("a new user can register, sign in again, and delete their account", async ({
  page,
  context,
}) => {
  const email = `staging.email.test+${randomUUID()}@example.com`;
  await page.goto("/register");
  await page.locator('h1:has-text("Get Started")');
  await page.locator('[placeholder="Email"]');
  await page.locator('[placeholder="Email"]').fill(email);
  await page.locator('[placeholder="Email"]').press("Tab");
  await page.locator('[placeholder="Password"]').fill("VerySecurePassword");
  await page.locator('button:has-text("Continue")').click();
  await expect(page).toHaveURL("/register/address");
  await page.locator('[placeholder="Street Address"]').click();
  await page.locator('[placeholder="Street Address"]').fill("80 S Lashley Ln");
  await page.locator('[placeholder="Street Address"]').press("Tab");
  await page
    .locator(
      '[placeholder="Apartment\\, suite\\, unit\\, building\\, floor\\, etc\\."]',
    )
    .press("Tab");
  await page.locator('[placeholder="City"]').fill("Boulder");
  await page.locator('[placeholder="City"]').press("Tab");
  await page.locator('select[name="address\\.state"]').selectOption("CO");
  await page.locator('[placeholder="Postal Code"]').fill("80305");
  await page.getByPlaceholder("Postal Code").press("Tab");
  await page
    .getByRole("button", { name: "Complete Registration" })
    .press("Enter");
  await expect(page).toHaveURL("/home");
  // Exercise login with this test's own account, without depending on a shared
  // staging user or inheriting the session created during registration.
  await context.clearCookies();
  await page.goto("/login");
  await page.getByPlaceholder("Email or Username").fill(email);
  await page
    .getByPlaceholder("Password", { exact: true })
    .fill("VerySecurePassword");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL("/home");
  await page.getByRole("img", { name: "profile picture" }).click();
  await expect(page).toHaveURL("/settings/profile");
  await page
    .getByLabel("Are you sure you want to completely delete your account?")
    .check();
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page).toHaveURL("/home");
});
