import { test, expect } from '@playwright/test';

test('User registration flow works as expected', async ({ page }) => {
  await page.goto('/register');
  await page.locator('h1:has-text("Get Started")').click();
  await page.locator('[placeholder="Email"]').click();
  await page.locator('[placeholder="Email"]').fill(`staging.email.test+${Math.round(Math.random() * 10000)}@example.com`);
  await page.locator('[placeholder="Email"]').press('Tab');
  await page.locator('[placeholder="Password"]').fill('VerySecurePassword');
  await page.locator('button:has-text("Continue")').click();
  await expect(page).toHaveURL(`${process.env.PLAYWRIGHT_TEST_BASE_URL}/register/address`);
  await page.locator('[placeholder="Street Address"]').click();
  await page.locator('[placeholder="Street Address"]').fill('80 S Lashley Ln');
  await page.locator('[placeholder="Street Address"]').press('Tab');
  await page.locator('[placeholder="Apartment\\, suite\\, unit\\, building\\, floor\\, etc\\."]').press('Tab');
  await page.locator('[placeholder="City"]').fill('Boulder');
  await page.locator('[placeholder="City"]').press('Tab');
  await page.locator('select[name="address\\.state"]').selectOption('CO');
  await page.locator('[placeholder="Postal Code"]').fill('80305');
  await page.locator('text=Complete Registration').click();
  await expect(page).toHaveURL(`${process.env.PLAYWRIGHT_TEST_BASE_URL}/home`);
  await page.locator('text=We’re still in beta.').click();
  await page.locator('button:has-text("Continue")').click();
  await page.getByRole('img', { name: 'profile picture' }).click();
  await expect(page).toHaveURL(`${process.env.PLAYWRIGHT_TEST_BASE_URL}/settings/profile`);
  await page.getByLabel('Are you sure you want to completely delete your account?').check();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page).toHaveURL(`${process.env.PLAYWRIGHT_TEST_BASE_URL}/home`);
});
