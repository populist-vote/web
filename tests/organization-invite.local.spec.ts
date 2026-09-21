import { expect, Page, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";

// Opt-in integration suite: real local browser/API/Postgres and captured mail.
const databaseUrl = process.env.LOCAL_INVITE_DATABASE_URL;
const inboxUrl = process.env.LOCAL_INVITE_INBOX_URL;
const apiUrl = process.env.LOCAL_INVITE_API_URL || "http://localhost:1234/";
const password = "Local-Invite-Regression-2026!";
test.use({ storageState: { cookies: [], origins: [] } });
test.skip(
  !databaseUrl || !inboxUrl,
  "Requires an isolated local API, database, and mail inbox",
);
test.setTimeout(90000);

function sql(query: string): string {
  for (const endpoint of [databaseUrl!, inboxUrl!, apiUrl]) {
    if (!["localhost", "127.0.0.1"].includes(new URL(endpoint).hostname)) {
      throw new Error("This suite only operates on localhost");
    }
  }
  return execFileSync(
    "psql",
    [databaseUrl!, "-X", "-q", "-At", "-v", "ON_ERROR_STOP=1"],
    {
      input: query,
      encoding: "utf8",
    },
  ).trim();
}
const quote = (value: string) => `'${value.replaceAll("'", "''")}'`;
const testEmail = () => `invite+${randomUUID()}@example.test`;

function seedUser(email: string) {
  return sql(`WITH u AS (
    INSERT INTO populist_user (email, username, password, confirmed_at)
    VALUES (${quote(email)}, ${quote(`local${randomUUID().replaceAll("-", "").slice(0, 12)}`)},
      crypt(${quote(password)}, gen_salt('bf')), now()) RETURNING id
  ), p AS (INSERT INTO user_profile (user_id) SELECT id FROM u)
  SELECT id FROM u;`);
}

async function login(page: Page, email: string) {
  await page.goto("/login");
  await page.getByPlaceholder("Email or username").fill(email);
  await page.getByPlaceholder("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
}

async function setupOwner(page: Page) {
  const email = testEmail();
  const owner = seedUser(email);
  const slug = `invite-validation-${randomUUID()}`;
  const org = sql(
    `INSERT INTO organization (name, slug) VALUES ('Local Invite Validation', ${quote(slug)}) RETURNING id;`,
  );
  sql(
    `INSERT INTO organization_users (organization_id,user_id,role) VALUES (${quote(org)},${quote(owner)},'owner');`,
  );
  await login(page, email);
  await page.goto(`/dashboard/${slug}/account`);
  await expect(
    page.getByRole("button", { name: "Invite Member", exact: true }),
  ).toBeVisible();
  return { org, slug, email };
}

async function invite(page: Page, email: string, role = "MEMBER") {
  await page
    .getByRole("button", { name: "Invite Member", exact: true })
    .click();
  await page.getByLabel("Email", { exact: true }).last().fill(email);
  await page.locator('select[name="role"]').selectOption(role);
  const responsePromise = page.waitForResponse((response) => {
    return (
      response.request().postData()?.includes("mutation InviteUser") ?? false
    );
  });
  await page.getByRole("button", { name: "Invite", exact: true }).click();
  const response = await (await responsePromise).json();
  expect(response.errors).toBeUndefined();
  return response.data.inviteUser as string | null;
}

async function capturedLink(page: Page, email: string, field = "invite_url") {
  let link: string | undefined;
  await expect
    .poll(async () => {
      const response = await page.request.get(inboxUrl!);
      const messages = await response.json();
      for (const message of messages) {
        for (const recipient of message.personalizations) {
          if (
            recipient.to.some((to: { email: string }) => to.email === email)
          ) {
            link = recipient.dynamic_template_data?.[field] ?? link;
          }
        }
      }
      return link;
    })
    .toBeTruthy();
  return link!;
}

async function register(page: Page, url: string, email: string) {
  await page.goto(url);
  await expect(page.getByPlaceholder("Email", { exact: true })).toHaveValue(
    email,
  );
  await page.getByPlaceholder("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page).toHaveURL(/\/register\/address\?/);
  await page.getByRole("button", { name: "Skip this step for now" }).click();
}

async function assertMember(
  page: Page,
  org: string,
  email: string,
  role = "member",
) {
  await expect(page).toHaveURL(/\/home$/);
  const cookies = await page.context().cookies(apiUrl);
  expect(cookies.map((cookie) => cookie.name)).toEqual(
    expect.arrayContaining(["access_token", "refresh_token"]),
  );
  expect(
    sql(
      `SELECT ou.role FROM organization_users ou JOIN populist_user u ON u.id=ou.user_id WHERE ou.organization_id=${quote(org)} AND u.email=${quote(email)};`,
    ),
  ).toBe(role);
  const current = await page.evaluate(async (url) => {
    return (
      await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query:
            "{ currentUser { email organizations { organizationId role } } }",
        }),
      })
    ).json();
  }, apiUrl);
  expect(current.errors).toBeUndefined();
  expect(current.data.currentUser.email).toBe(email);
  expect(current.data.currentUser.organizations).toContainEqual({
    organizationId: org,
    role: role.toUpperCase(),
  });
}

test("owner invites a new email alias; recipient registers, confirms, and accesses the org", async ({
  page,
  browser,
}) => {
  const { org, slug, email: ownerEmail } = await setupOwner(page);
  const email = testEmail();
  const result = await invite(page, email, "ADMIN");
  const link = await capturedLink(page, email);
  expect(link).toBe(result);
  expect(new URL(link).pathname).toBe("/register");
  expect(new URL(link).searchParams.get("email")).toBe(email);
  const recipient = await browser.newContext();
  const recipientPage = await recipient.newPage();
  await recipientPage.addInitScript((staleEmail) => {
    sessionStorage.setItem(
      "__LSM__",
      JSON.stringify({ loginFormState: { email: staleEmail, password: "" } }),
    );
  }, ownerEmail);
  await register(recipientPage, link, email);
  await assertMember(recipientPage, org, email, "admin");
  expect(
    sql(
      `SELECT count(*) FROM invite_token WHERE organization_id=${quote(org)} AND email=${quote(email)} AND accepted_at IS NOT NULL;`,
    ),
  ).toBe("1");
  const confirmation = await capturedLink(
    page,
    email,
    "account_confirmation_url",
  );
  await recipientPage.goto(confirmation);
  await expect(
    recipientPage.getByRole("heading", {
      name: "Congratulations, your account has been confirmed!",
    }),
  ).toBeVisible();
  await recipientPage.goto(`/dashboard/${slug}/account`);
  await expect(
    recipientPage.getByRole("button", { name: "Invite Member", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("cell", { name: email, exact: true }),
  ).toHaveCount(1);
  expect(
    sql(`SELECT count(*) FROM populist_user WHERE email=${quote(email)};`),
  ).toBe("1");
  await recipient.close();
});

test("recipient who registers before accepting can sign in and accept the pending invite", async ({
  page,
  browser,
}) => {
  const { org } = await setupOwner(page);
  const email = testEmail();
  await invite(page, email);
  const link = await capturedLink(page, email);
  seedUser(email);
  const recipient = await browser.newContext();
  const recipientPage = await recipient.newPage();
  await recipientPage.goto(link);
  await recipientPage
    .getByPlaceholder("Password", { exact: true })
    .fill(password);
  await recipientPage
    .getByRole("button", { name: "Continue", exact: true })
    .click();
  await expect(recipientPage).toHaveURL(/\/login\?/);
  await recipientPage
    .getByPlaceholder("Password", { exact: true })
    .fill("wrong-password");
  await recipientPage
    .getByRole("button", { name: "Sign in", exact: true })
    .click();
  await expect(
    recipientPage.getByText("Your password was incorrect", { exact: true }),
  ).toBeVisible();
  expect(
    sql(
      `SELECT count(*) FROM invite_token WHERE email=${quote(email)} AND accepted_at IS NOT NULL;`,
    ),
  ).toBe("0");
  await recipientPage
    .getByPlaceholder("Password", { exact: true })
    .fill(password);
  await recipientPage
    .getByRole("button", { name: "Sign in", exact: true })
    .click();
  await assertMember(recipientPage, org, email);
  await recipientPage.goto(link);
  await expect(recipientPage).toHaveURL(/\/login\?/);
  await recipientPage
    .getByPlaceholder("Password", { exact: true })
    .fill(password);
  await recipientPage
    .getByRole("button", { name: "Sign in", exact: true })
    .click();
  await assertMember(recipientPage, org, email);
  expect(
    sql(
      `SELECT count(*) FROM organization_users ou JOIN populist_user u ON u.id=ou.user_id WHERE u.email=${quote(email)} AND ou.organization_id=${quote(org)};`,
    ),
  ).toBe("1");
  await recipient.close();
});

test("inviting an already-existing account adds the requested membership", async ({
  page,
  browser,
}) => {
  const { org } = await setupOwner(page);
  const email = testEmail();
  seedUser(email);
  expect(await invite(page, email.toUpperCase())).toBeNull();
  const recipient = await browser.newContext();
  const recipientPage = await recipient.newPage();
  await login(recipientPage, email);
  await assertMember(recipientPage, org, email);
  expect(
    sql(`SELECT count(*) FROM invite_token WHERE email=${quote(email)};`),
  ).toBe("0");
  await recipient.close();
});

test("expired invitation does not silently create an account without membership", async ({
  page,
  browser,
}) => {
  await setupOwner(page);
  const email = testEmail();
  await invite(page, email);
  const link = await capturedLink(page, email);
  sql(
    `UPDATE invite_token SET expires_at=now()-interval '1 day' WHERE email=${quote(email)};`,
  );
  const recipient = await browser.newContext();
  const recipientPage = await recipient.newPage();
  await register(recipientPage, link, email);
  await expect(
    recipientPage.getByText(
      /invite.*(invalid|expired)|invitation.*(invalid|expired)/i,
    ),
  ).toBeVisible();
  expect(
    sql(`SELECT count(*) FROM populist_user WHERE email=${quote(email)};`),
  ).toBe("0");
  await recipient.close();
});

test("malformed links leave no account behind and the correct link can be retried", async ({
  page,
  browser,
}) => {
  const { org } = await setupOwner(page);
  const email = testEmail();
  await invite(page, email);
  const link = await capturedLink(page, email);
  const malformed = new URL(link);
  malformed.searchParams.set("inviteToken", "invalid-token");
  const recipient = await browser.newContext();
  const recipientPage = await recipient.newPage();
  await register(recipientPage, malformed.toString(), email);
  await expect(
    recipientPage.getByText(/invitation is invalid or expired/i),
  ).toBeVisible();
  expect(
    sql(`SELECT count(*) FROM populist_user WHERE email=${quote(email)};`),
  ).toBe("0");
  await register(recipientPage, link, email);
  await assertMember(recipientPage, org, email);
  await recipient.close();
});

test("a different signed-in account cannot accept someone else's invitation", async ({
  page,
  browser,
}) => {
  const { org } = await setupOwner(page);
  const email = testEmail();
  await invite(page, email);
  const link = await capturedLink(page, email);
  const wrongEmail = testEmail();
  seedUser(wrongEmail);
  const recipient = await browser.newContext();
  const recipientPage = await recipient.newPage();
  await login(recipientPage, wrongEmail);
  await recipientPage.goto(link);
  await expect(recipientPage).toHaveURL(/\/login\?/);
  await recipientPage.getByPlaceholder("Email or username").fill(wrongEmail);
  await recipientPage
    .getByPlaceholder("Password", { exact: true })
    .fill(password);
  await recipientPage
    .getByRole("button", { name: "Sign in", exact: true })
    .click();
  await expect(
    recipientPage.getByText(/invitation is invalid or expired/i),
  ).toBeVisible();
  expect(
    sql(
      `SELECT count(*) FROM organization_users ou JOIN populist_user u ON u.id=ou.user_id WHERE u.email=${quote(wrongEmail)} AND ou.organization_id=${quote(org)};`,
    ),
  ).toBe("0");
  expect(
    sql(
      `SELECT count(*) FROM invite_token WHERE email=${quote(email)} AND accepted_at IS NOT NULL;`,
    ),
  ).toBe("0");
  await recipient.close();
});

test("welcome email failure does not turn successful registration into a duplicate-account retry", async ({
  page,
  browser,
}) => {
  const { org } = await setupOwner(page);
  const email = `mailfailure+${randomUUID()}@example.test`;
  await invite(page, email);
  const link = await capturedLink(page, email);
  const recipient = await browser.newContext();
  const recipientPage = await recipient.newPage();
  await register(recipientPage, link, email);
  await assertMember(recipientPage, org, email);
  await recipient.close();
});

test("new invite recipient can register with an address", async ({
  page,
  browser,
}) => {
  const { org } = await setupOwner(page);
  const email = testEmail();
  await invite(page, email);
  const link = await capturedLink(page, email);
  const recipient = await browser.newContext();
  const recipientPage = await recipient.newPage();
  await recipientPage.goto(link);
  await recipientPage
    .getByPlaceholder("Password", { exact: true })
    .fill(password);
  await recipientPage
    .getByRole("button", { name: "Continue", exact: true })
    .click();
  await expect(recipientPage).toHaveURL(/\/register\/address\?/);
  await recipientPage.getByPlaceholder("Street Address").fill("1777 Broadway");
  await recipientPage.getByPlaceholder("City", { exact: true }).fill("Boulder");
  await recipientPage
    .locator('select[name="address.state"]')
    .selectOption("CO");
  await recipientPage.getByPlaceholder("Postal Code").fill("80302");
  await recipientPage
    .getByRole("button", { name: "Complete Registration", exact: true })
    .click();
  await assertMember(recipientPage, org, email);
  expect(
    sql(
      `SELECT a.line_1 FROM address a JOIN user_profile p ON p.address_id=a.id JOIN populist_user u ON u.id=p.user_id WHERE u.email=${quote(email)};`,
    ),
  ).toBe("1777 Broadway");
  await recipient.close();
});
