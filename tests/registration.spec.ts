import { test, expect } from '@playwright/test';

test('Asset registration flow works as expected', async ({ page }) => {

  // Go to http://localhost:3030/register
  await page.goto('/register');

  // Click h1:has-text("Get Started")
  await page.locator('h1:has-text("Get Started")').click();

  // Click [placeholder="Email"]
  await page.locator('[placeholder="Email"]').click();

  // Fill [placeholder="Email"]
  await page.locator('[placeholder="Email"]').fill(`staging.email.test+${Math.round(Math.random() * 10000)}@example.com`);

  // Press Tab
  await page.locator('[placeholder="Email"]').press('Tab');

  // Fill [placeholder="Password"]
  await page.locator('[placeholder="Password"]').fill('VerySecurePassword');

  // Click button:has-text("Continue")
  await page.locator('button:has-text("Continue")').click();
  await expect(page).toHaveURL('http://localhost:3030/register/address');

  // Click [placeholder="Street Address"]
  await page.locator('[placeholder="Street Address"]').click();

  // Fill [placeholder="Street Address"]
  await page.locator('[placeholder="Street Address"]').fill('8 S Lashley Ln');

  // Press Tab
  await page.locator('[placeholder="Street Address"]').press('Tab');

  // Press Tab
  await page.locator('[placeholder="Apartment\\, unit\\, suite\\, floor \\#\\, etc\\."]').press('Tab');

  // Fill [placeholder="City"]
  await page.locator('[placeholder="City"]').fill('Boulder');

  // Press Tab
  await page.locator('[placeholder="City"]').press('Tab');

  // Select CO
  await page.locator('select[name="address\\.state"]').selectOption('CO');

  // Fill [placeholder="Postal Code"]
  await page.locator('[placeholder="Postal Code"]').fill('80305');

  // Click text=Complete Registration
  await page.locator('text=Complete Registration').click();
  await expect(page).toHaveURL('http://localhost:3030/home');

  // Click text=We’re still in beta.
  await page.locator('text=We’re still in beta.').click();

  // Click button:has-text("Continue")
  await page.locator('button:has-text("Continue")').click();

});
