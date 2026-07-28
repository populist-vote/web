import { expect, test } from "@playwright/test";

const API_PATTERN =
  "https://api.staging.populist.us/api/v1/elections/**/ballot*";
const ELECTION_API_PATTERN =
  /^https:\/\/api\.staging\.populist\.us\/api\/v1\/elections(?:\/.*)?(?:\?.*)?$/;

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

test("sends GET election requests without a body or content type", async ({
  page,
}) => {
  let requestHeaders: Record<string, string> = {};
  let requestMethod = "";
  let requestPostData: string | null = "not requested";
  let requestUrl = "";

  await page.route(ELECTION_API_PATTERN, async (route) => {
    const request = route.request();
    requestHeaders = request.headers();
    requestMethod = request.method();
    requestPostData = request.postData();
    requestUrl = request.url();
    await route.fulfill({
      body: JSON.stringify({
        data: [
          {
            id: "11111111-2222-4333-8444-555555555555",
            title: "Minneapolis Mayor",
          },
        ],
        meta: { count: 1, limit: 10, offset: 0, total: 1 },
      }),
      contentType: "application/json",
      headers: { "x-request-id": "election-docs-inspector-test" },
      status: 200,
    });
  });

  await page.goto("/docs/api/election-data#api-explorer");
  await expect(
    page.getByRole("heading", { name: "Elections Explorer" }),
  ).toBeVisible();
  await page.getByLabel("Endpoint").selectOption("election-races");
  await expect(
    page.getByRole("heading", { name: "Election Races Explorer" }),
  ).toBeVisible();
  await page.getByLabel("State").fill("MN");
  await page.getByLabel("Race type").selectOption("general");
  await page.getByLabel("Search query").fill("mayor & council");
  await page.getByLabel("Limit").fill("10");
  await page.getByRole("button", { name: "Send request" }).click();

  await expect(page.getByText("200 OK")).toBeVisible();
  await expect(
    page
      .getByRole("region", { name: "Election Races Explorer" })
      .getByText("Races", { exact: true }),
  ).toBeVisible();
  expect(requestMethod).toBe("GET");
  expect(requestPostData).toBeNull();
  expect(requestHeaders.authorization).toBeUndefined();
  expect(requestHeaders["content-type"]).toBeUndefined();
  expect(requestHeaders.accept).toBe("application/json");
  expect(requestHeaders["x-request-id"]).toMatch(/^docs-/);

  const requested = new URL(requestUrl);
  expect(requested.pathname).toBe(
    "/api/v1/elections/5fa881d7-f8f3-4b90-9063-45236c85c77a/races",
  );
  expect(Object.fromEntries(requested.searchParams)).toEqual({
    state: "MN",
    raceType: "general",
    query: "mayor & council",
    limit: "10",
    offset: "0",
  });

  const treeTab = page.getByRole("tab", { name: "Tree" });
  const rawTab = page.getByRole("tab", { name: "Raw JSON" });
  await treeTab.focus();
  await treeTab.press("ArrowRight");
  await expect(rawTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("Raw JSON response")).toContainText(
    '"title": "Minneapolis Mayor"',
  );
});

test("switches among resource endpoints and keeps inspector ids unique", async ({
  page,
}) => {
  await page.goto("/docs/api/election-data");
  const endpointCases = [
    {
      endpoint: "elections",
      title: "Elections Explorer",
      url: "https://api.staging.populist.us/api/v1/elections?state=MN&year=2026&limit=25&offset=0",
    },
    {
      endpoint: "election-detail",
      title: "Election Detail Explorer",
      url: "https://api.staging.populist.us/api/v1/elections/5fa881d7-f8f3-4b90-9063-45236c85c77a",
    },
    {
      endpoint: "election-races",
      title: "Election Races Explorer",
      url: "https://api.staging.populist.us/api/v1/elections/5fa881d7-f8f3-4b90-9063-45236c85c77a/races?limit=25&offset=0",
    },
    {
      endpoint: "race-detail",
      title: "Race Detail Explorer",
      url: "https://api.staging.populist.us/api/v1/elections/5fa881d7-f8f3-4b90-9063-45236c85c77a/races/11111111-2222-4333-8444-555555555555",
    },
    {
      endpoint: "election-results",
      title: "Election Results Explorer",
      url: "https://api.staging.populist.us/api/v1/elections/5fa881d7-f8f3-4b90-9063-45236c85c77a/results?limit=25&offset=0",
    },
    {
      endpoint: "election-ballot-measures",
      title: "Election Ballot Measures Explorer",
      url: "https://api.staging.populist.us/api/v1/elections/5fa881d7-f8f3-4b90-9063-45236c85c77a/ballot-measures?limit=25&offset=0",
    },
  ];

  for (const endpointCase of endpointCases) {
    await page.getByLabel("Endpoint").selectOption(endpointCase.endpoint);
    const inspector = page.getByRole("region", { name: endpointCase.title });
    await expect(inspector).toBeVisible();
    await expect(inspector.locator("code[title]")).toHaveAttribute(
      "title",
      endpointCase.url,
    );
  }

  const ids = await page
    .getByRole("region", { name: "Election Ballot Measures Explorer" })
    .locator("[id]")
    .evaluateAll((elements) => elements.map((element) => element.id));
  expect(new Set(ids).size).toBe(ids.length);
});

test("keeps the election inspector within a mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 500 });
  await page.goto("/docs/api/election-data#api-explorer");

  const inspector = page.getByRole("region", { name: "Elections Explorer" });
  await expect(inspector).toBeInViewport();
  const hasHorizontalOverflow = await inspector.evaluate(
    (element) => element.scrollWidth > element.clientWidth + 1,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
