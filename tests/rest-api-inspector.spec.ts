import { expect, test } from "@playwright/test";

const API_PATTERN =
  "https://api.staging.populist.us/api/v1/elections/**/ballot*";

test.use({ storageState: { cookies: [], origins: [] } });

test("sends a sandbox request and renders a browsable JSON response", async ({
  page,
}) => {
  let requestHeaders: Record<string, string> = {};
  let requestBody: unknown;

  await page.route(API_PATTERN, async (route) => {
    requestHeaders = route.request().headers();
    requestBody = route.request().postDataJSON();
    await route.fulfill({
      body: JSON.stringify({
        data: {
          election: {
            id: "5fa881d7-f8f3-4b90-9063-45236c85c77a",
            title: "Minnesota Primaries 2026",
          },
          races: [{ id: "race-1", candidates: [] }],
          ballotMeasures: [],
          coverage: {
            races: "address_specific",
            ballotMeasures: "address_specific",
            warnings: [],
          },
        },
      }),
      contentType: "application/json",
      headers: { "x-request-id": "docs-inspector-test" },
      status: 200,
    });
  });

  await page.goto("/docs/api/ballot-by-address#api-explorer");
  await expect(
    page.getByRole("heading", { name: "Ballot by Address Explorer" }),
  ).toBeVisible();
  await expect(page.locator("#api-explorer")).toBeInViewport();
  await page.getByRole("button", { name: "Send request" }).click();

  await expect(page.getByText("200 OK")).toBeVisible();
  await expect(page.getByText("Minnesota Primaries 2026")).toBeVisible();
  await expect(
    page
      .getByRole("region", { name: "Ballot by Address Explorer" })
      .getByText("address_specific", { exact: true }),
  ).toBeVisible();
  expect(requestHeaders.authorization).toBeUndefined();
  expect(requestHeaders["x-request-id"]).toMatch(/^docs-/);
  expect(requestBody).toEqual({
    address: {
      line1: "350 S 5th St",
      city: "Minneapolis",
      state: "MN",
      postalCode: "55415",
      country: "US",
    },
  });

  await page.getByRole("tab", { name: "Raw JSON" }).click();
  await expect(page.getByLabel("Raw JSON response")).toContainText(
    '"title": "Minnesota Primaries 2026"',
  );
});

test("validates locally and formats API problem responses", async ({
  page,
}) => {
  let requestCount = 0;
  await page.route(API_PATTERN, async (route) => {
    requestCount += 1;
    await route.fulfill({
      body: JSON.stringify({
        type: "about:blank",
        title: "Unprocessable Entity",
        status: 422,
        code: "invalid_address",
        detail: "The address could not be resolved to a voting location.",
      }),
      contentType: "application/problem+json",
      headers: { "x-request-id": "problem-request-id" },
      status: 422,
    });
  });

  await page.goto("/docs/api/ballot-by-address");
  await page.getByLabel("ZIP code").fill("bad zip");
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByText("Use a five-digit ZIP or ZIP+4.")).toBeVisible();
  expect(requestCount).toBe(0);

  await page.getByLabel("ZIP code").fill("55415");
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByText("422 Unprocessable Entity")).toBeVisible();
  await expect(page.getByText('"invalid_address"')).toBeVisible();
  expect(requestCount).toBe(1);
});

test("keeps the previous explorer anchor working", async ({ page }) => {
  await page.goto("/docs/api/ballot-by-address#try-it-in-staging");
  await expect(page.locator("#api-explorer")).toBeInViewport();
});
