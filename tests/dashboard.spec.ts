import { test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/premium.json" });

test("Organization dashboard works as expected", async ({ page }) => {
  await page.goto("/dashboard/mpr-news");
  await page.getByText("Dashboard");
  await page.getByRole("heading", { name: "Activity" }).click();
  await page
    .getByRole("link", { name: "CANDIDATE GUIDE", exact: true })
    .click();
  await page.getByRole("heading", { name: "Recent Submissions" }).click();
});
