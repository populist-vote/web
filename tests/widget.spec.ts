import { test, expect } from "@playwright/test";

test("Widget script successfully renders a widget", async ({ page }) => {
  await page.goto("/embeds/embed-test");
  await expect(page).toHaveURL(
    `${process.env.PLAYWRIGHT_TEST_BASE_URL}/embeds/embed-test`
  );
  await expect(
    page
      .frameLocator('internal:attr=[title="Populist Widget"i]')
      .first()
      .getByTestId("populist-bill-widget")
      .getByRole("heading")
      .nth(0)
  ).toHaveText("Changes to the Minnesota Indian Family Preservation Act");
});
