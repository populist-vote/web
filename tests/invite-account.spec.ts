import { expect, Page, test } from "@playwright/test";

const inviteToken = "9370dbac-bba8-46bf-b899-2c0b8fe93b57";
const invitedEmail = "invitee+organization@example.com";
const otherEmail = "someone-else@example.com";
const inviteQuery = new URLSearchParams({
  inviteToken,
  email: invitedEmail,
  next: "dashboard/invited-organization",
}).toString();

test.use({ storageState: { cookies: [], origins: [] } });

function user(email: string, organizations: object[] = []) {
  return {
    id: "signed-in-user",
    email,
    username: "member",
    systemRole: "USER",
    organizations,
    userProfile: {
      profilePictureUrl: null,
      firstName: null,
      lastName: null,
      address: null,
    },
  };
}

async function mockSession(
  page: Page,
  options: {
    currentUser?: (requestCount: number) => ReturnType<typeof user> | null;
    logoutFails?: boolean;
  } = {},
) {
  const calls = { currentUser: 0, logout: 0, login: 0, registration: 0 };
  let signedOut = false;
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (
      request.method() !== "POST" ||
      !request.postData()?.includes('"query"')
    ) {
      await route.continue();
      return;
    }
    const { query } = request.postDataJSON() as { query: string };
    let response: object = { data: {} };
    if (query.includes("query CurrentUser")) {
      calls.currentUser += 1;
      response = {
        data: {
          currentUser: signedOut
            ? null
            : options.currentUser
              ? options.currentUser(calls.currentUser)
              : user(otherEmail),
        },
      };
    } else if (query.includes("mutation Logout")) {
      calls.logout += 1;
      signedOut = !options.logoutFails;
      response = options.logoutFails
        ? { errors: [{ message: "Sign out unavailable" }] }
        : { data: { logout: true } };
    } else if (query.includes("mutation LogIn")) {
      calls.login += 1;
    } else if (query.includes("mutation BeginUserRegistration")) {
      calls.registration += 1;
    } else if (query.includes("query AvailableOrganizationsByUser")) {
      response = { data: { userProfile: { availableOrganizations: [] } } };
    }
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });
  return calls;
}

for (const entry of ["/register", "/login", "/register/address"]) {
  test(`blocks another account at ${entry} without changing its session`, async ({
    page,
  }) => {
    const calls = await mockSession(page);
    await page.goto(`${entry}?${inviteQuery}`);
    await expect(page).toHaveURL(/\/auth\/invite-account\?/);
    await expect(
      page.getByRole("heading", { name: "Continue with the invited account" }),
    ).toBeVisible();
    await expect(
      page.getByText(`This invitation is for ${invitedEmail}.`, {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(`You’re currently signed in as ${otherEmail}.`, {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByPlaceholder("Password", { exact: true }),
    ).toHaveCount(0);
    expect(new URL(page.url()).searchParams.get("inviteToken")).toBe(
      inviteToken,
    );
    expect(calls.logout).toBe(0);
    expect(calls.login).toBe(0);
    expect(calls.registration).toBe(0);
    await expect(
      page.getByRole("link", { name: "Keep using this account" }),
    ).toHaveAttribute("href", "/home");
  });
}

test("switching accounts preserves the invitation and clears old account state", async ({
  page,
}) => {
  const calls = await mockSession(page);
  await page.goto(`/register?${inviteQuery}`);
  await expect(page).toHaveURL(/\/auth\/invite-account\?/);
  await page.evaluate(() => {
    localStorage.setItem("currentOrganizationId", "previous-account-org");
    sessionStorage.setItem(
      "__LSM__",
      JSON.stringify({
        loginFormState: {
          email: "previous@example.com",
          password: "old-password",
        },
      }),
    );
  });
  await page
    .getByRole("button", { name: "Switch accounts and continue" })
    .click();
  await expect(page).toHaveURL(/\/register\?/);
  await expect(page.getByPlaceholder("Email", { exact: true })).toHaveValue(
    invitedEmail,
  );
  await expect(page.getByPlaceholder("Password", { exact: true })).toHaveValue(
    "",
  );
  expect(new URL(page.url()).searchParams.get("inviteToken")).toBe(inviteToken);
  expect(new URL(page.url()).searchParams.get("next")).toBe(
    "dashboard/invited-organization",
  );
  expect(
    await page.evaluate(() => localStorage.getItem("currentOrganizationId")),
  ).toBeNull();
  expect(calls.logout).toBe(1);
  expect(calls.registration).toBe(0);
});

test("a failed sign-out retains the session and invitation for retry", async ({
  page,
}) => {
  const calls = await mockSession(page, { logoutFails: true });
  await page.goto(`/register?${inviteQuery}`);
  await expect(page).toHaveURL(/\/auth\/invite-account\?/);
  await page.evaluate(() =>
    localStorage.setItem("currentOrganizationId", "previous-account-org"),
  );
  await page
    .getByRole("button", { name: "Switch accounts and continue" })
    .click();
  await expect(
    page.getByRole("alert").filter({ hasText: "We couldn’t sign you out" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Switch accounts and continue" }),
  ).toBeEnabled();
  await expect(page).toHaveURL(/\/auth\/invite-account\?/);
  expect(new URL(page.url()).searchParams.get("inviteToken")).toBe(inviteToken);
  expect(
    await page.evaluate(() => localStorage.getItem("currentOrganizationId")),
  ).toBe("previous-account-org");
  expect(calls.logout).toBe(1);
});

test("the matching account can continue even when it belongs to other organizations", async ({
  page,
}) => {
  const calls = await mockSession(page, {
    currentUser: () =>
      user(` ${invitedEmail.toUpperCase()} `, [
        { organizationId: "first-org", role: "OWNER" },
        { organizationId: "second-org", role: "MEMBER" },
      ]),
  });
  await page.goto(`/register?${inviteQuery}`);
  await expect(page).toHaveURL(/\/login\?/);
  await expect(page.getByPlaceholder("Email or username")).toHaveValue(
    invitedEmail,
  );
  await expect(
    page.getByRole("button", { name: "Sign in", exact: true }),
  ).toBeVisible();
  expect(calls.logout).toBe(0);
});

test("plus aliases are distinct accounts", async ({ page }) => {
  await mockSession(page, { currentUser: () => user("invitee@example.com") });
  await page.goto(`/register?${inviteQuery}`);
  await expect(page).toHaveURL(/\/auth\/invite-account\?/);
});

test("refreshes a cached matching account before showing invite forms", async ({
  page,
}) => {
  const calls = await mockSession(page, {
    currentUser: (count) => user(count === 1 ? invitedEmail : otherEmail),
  });
  await page.goto(`/register?${inviteQuery}`);
  await expect(page).toHaveURL(/\/auth\/invite-account\?/);
  expect(calls.currentUser).toBeGreaterThan(1);
  expect(calls.registration).toBe(0);
  expect(calls.login).toBe(0);
});

test("an expired cached session can continue without signing out again", async ({
  page,
}) => {
  const calls = await mockSession(page, {
    currentUser: (count) => (count === 1 ? user(otherEmail) : null),
  });
  await page.goto(`/register?${inviteQuery}`);
  await expect(page.getByPlaceholder("Email", { exact: true })).toHaveValue(
    invitedEmail,
  );
  await expect(page).toHaveURL(/\/register\?/);
  expect(calls.logout).toBe(0);
});

test("the account-switch page recovers after signing out elsewhere", async ({
  page,
}) => {
  await mockSession(page, { currentUser: () => null });
  await page.goto(`/auth/invite-account?${inviteQuery}`);
  await expect(page).toHaveURL(/\/register\?/);
  await expect(page.getByPlaceholder("Email", { exact: true })).toHaveValue(
    invitedEmail,
  );
});

test("rechecks the session when returning from another tab", async ({
  page,
}) => {
  let currentEmail = invitedEmail;
  await mockSession(page, { currentUser: () => user(currentEmail) });
  await page.goto(`/login?${inviteQuery}`);
  await expect(
    page.getByPlaceholder("Password", { exact: true }),
  ).toBeVisible();
  currentEmail = otherEmail;
  await page.evaluate(() =>
    window.dispatchEvent(new Event("visibilitychange")),
  );
  await expect(page).toHaveURL(/\/auth\/invite-account\?/);
});

test("switching accounts keeps the current locale", async ({ page }) => {
  await mockSession(page);
  await page.goto(`/es/register?${inviteQuery}`);
  await expect(page).toHaveURL(/\/es\/auth\/invite-account\?/);
  await page
    .getByRole("button", { name: "Switch accounts and continue" })
    .click();
  await expect(page).toHaveURL(/\/es\/register\?/);
  expect(new URL(page.url()).searchParams.get("inviteToken")).toBe(inviteToken);
});
