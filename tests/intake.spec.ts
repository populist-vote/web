import { test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/premium.json" });

test("Candidate guide setup and intake pages works as expected", async ({
  page,
}) => {
  await page.goto("/home");
  await page.getByRole("link", { name: "organization logo MPR News" }).click();
  await page.getByRole("button", { name: "New Embed" }).click();
  await page.getByRole("button", { name: "Candidate Guide" }).click();
  await page.getByPlaceholder("Untitled").click();
  await page.getByPlaceholder("Untitled").fill("Test Candidate Guide");
  await page.getByPlaceholder("Untitled").press("Tab");
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("heading", { name: "Test Candidate Guide" }).click();
  await page.getByText("Open").click();
  await page.getByRole("button", { name: "Add Question" }).click();
  await page.getByPlaceholder("What question would you like").click();
  await page
    .getByPlaceholder("What question would you like")
    .fill("Why are you running for this office?");
  await page.getByText("Enforce character limit for").click();
  await page
    .locator("#modal-root")
    .getByRole("button", { name: "Save" })
    .click();
  await page.getByRole("button", { name: "Add Question" }).click();
  await page.getByPlaceholder("What question would you like").click();
  await page
    .getByPlaceholder("What question would you like")
    .fill("What do you hope to achieve if elected?");
  await page
    .locator("#modal-root")
    .getByRole("button", { name: "Save" })
    .click();
  await page
    .getByRole("cell", { name: "Why are you running for this" })
    .click();
  await page.getByRole("button", { name: "Add Race" }).click();
  await page.getByPlaceholder("School board").click();
  await page.getByPlaceholder("School board").fill("bemidji mayor");
  await page
    .getByRole("row", { name: "Mayor Bemidji, MN General Nov 5," })
    .getByRole("checkbox")
    .check();
  await page.getByRole("button", { name: "Add Selected Races" }).click();

  await page.getByText("MN - Mayor - Bemidji, MN - General - 2024").click();
  await page.getByTestId("goto-intake-link").first().click();
  await page.locator("textarea").first().fill("Test response for an intake");
  await page.locator("textarea").nth(2).fill("Another response");
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByText("Test response for an intake");
  await page.getByText("Another response");
  await page.getByText("Thank you for your submission!");

  // Cleanup
  // Delete this guide and all its data -- need to manually delete embeds as of now.
});
