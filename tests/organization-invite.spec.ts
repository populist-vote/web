import { expect, Page, test } from "@playwright/test";

const inviteToken = "9370dbac-bba8-46bf-b899-2c0b8fe93b57";
const email = "invitee+organization@example.com";
const inviteQuery = new URLSearchParams({ inviteToken, email }).toString();

test.use({ storageState: { cookies: [], origins: [] } });

type Operation = { query: string; variables: Record<string, unknown> };

async function mockAuth(
  page: Page,
  handle: (operation: Operation) => unknown | Promise<unknown>,
) {
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (
      request.method() !== "POST" ||
      !request.postData()?.includes('"query"')
    ) {
      await route.continue();
      return;
    }
    const operation = request.postDataJSON() as Operation;
    const response = await handle(operation);
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(
        response ?? {
          data: {
            currentUser: null,
            validatePasswordEntropy: { valid: true, score: 4, message: null },
          },
        },
      ),
    });
  });
}

for (const staleEmail of ["", "already-registered@example.com"]) {
  test(`validates the invite-prefilled email with ${staleEmail ? "stale" : "empty"} stored state`, async ({
    page,
  }) => {
    const checkedEmails: unknown[] = [];
    let registration: Record<string, unknown> | undefined;
    let releaseRegistration: () => void = () => {};
    const registrationGate = new Promise<void>((resolve) => {
      releaseRegistration = resolve;
    });
    await page.addInitScript((storedEmail) => {
      sessionStorage.setItem(
        "__LSM__",
        JSON.stringify({
          loginFormState: { email: storedEmail, password: "" },
        }),
      );
    }, staleEmail);
    await mockAuth(page, async ({ query, variables }) => {
      if (query.includes("query ValidateEmailAvailable")) {
        checkedEmails.push(variables.email);
        return { data: { validateEmailAvailable: variables.email === email } };
      }
      if (query.includes("mutation BeginUserRegistration")) {
        registration = variables;
        await registrationGate;
        return {
          errors: [{ message: "Registration temporarily unavailable" }],
        };
      }
    });
    await page.goto(`/register?${inviteQuery}`);
    await expect(page.getByPlaceholder("Email", { exact: true })).toHaveValue(
      email,
    );
    await page
      .getByPlaceholder("Password", { exact: true })
      .fill("VerySecurePassword");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await expect(page).toHaveURL(/\/register\/address\?/);
    expect(checkedEmails).toEqual([email]);
    const skip = page.getByRole("button", { name: "Skip this step for now" });
    await skip.click();
    await expect
      .poll(() => registration)
      .toEqual({
        email,
        password: "VerySecurePassword",
        address: null,
        inviteToken,
      });
    await expect(skip).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Complete Registration" }),
    ).toBeDisabled();
    releaseRegistration();
    await expect(
      page.getByText("Registration temporarily unavailable"),
    ).toBeVisible();
    await expect(skip).toBeEnabled();
  });
}

test("existing invitee can sign in with the invite token", async ({ page }) => {
  let login: Operation | undefined;
  await mockAuth(page, (operation) => {
    if (operation.query.includes("query ValidateEmailAvailable")) {
      return { data: { validateEmailAvailable: false } };
    }
    if (operation.query.includes("mutation LogIn")) {
      login = operation;
      return { errors: [{ message: "Incorrect password" }] };
    }
  });
  await page.goto(`/register?${inviteQuery}&next=home`);
  await page
    .getByPlaceholder("Password", { exact: true })
    .fill("VerySecurePassword");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page).toHaveURL(/\/login\?/);
  expect(new URL(page.url()).searchParams.get("inviteToken")).toBe(inviteToken);
  expect(new URL(page.url()).searchParams.get("next")).toBe("home");
  await expect(page.getByPlaceholder("Email or Username")).toHaveValue(email);
  await page
    .getByPlaceholder("Password", { exact: true })
    .fill("existing-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByText("Incorrect password", { exact: true }),
  ).toBeVisible();
  expect(login?.variables).toEqual({
    emailOrUsername: email,
    password: "existing-password",
    inviteToken,
  });
  expect(login?.query).toContain("inviteToken: $inviteToken");
});

test("registration and sign-in links preserve the invite", async ({ page }) => {
  await mockAuth(page, () => undefined);
  await page.goto(`/register?${inviteQuery}`);
  await page.locator('a[href^="/login?"]').click();
  await expect(page).toHaveURL(/\/login\?/);
  expect(new URL(page.url()).searchParams.get("email")).toBe(email);
  await page.locator('a[href^="/register?"]').click();
  await expect(page).toHaveURL(/\/register\?/);
  expect(new URL(page.url()).searchParams.get("inviteToken")).toBe(inviteToken);
});

test("email validation failures do not masquerade as duplicate accounts", async ({
  page,
}) => {
  await mockAuth(page, ({ query }) => {
    if (query.includes("query ValidateEmailAvailable")) {
      return { errors: [{ message: "Email validation unavailable" }] };
    }
  });
  await page.goto(`/register?${inviteQuery}`);
  await page
    .getByPlaceholder("Password", { exact: true })
    .fill("VerySecurePassword");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByText("Email validation unavailable", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Email address is already in use", { exact: true }),
  ).toHaveCount(0);
  await expect(page).toHaveURL(/\/register\?/);
});

test("a signed-in invite recipient still reaches invite acceptance", async ({
  page,
}) => {
  await mockAuth(page, ({ query }) => {
    if (query.includes("query CurrentUser")) {
      return {
        data: {
          currentUser: {
            id: "existing-user",
            email,
            username: "invitee",
            systemRole: "USER",
            organizations: [],
            userProfile: {
              profilePictureUrl: null,
              firstName: null,
              lastName: null,
              address: null,
            },
          },
        },
      };
    }
  });
  await page.goto(`/register?${inviteQuery}`);
  await expect(page).toHaveURL(/\/login\?/);
  await expect(page.getByPlaceholder("Email or username")).toHaveValue(email);
  await expect(
    page.getByRole("button", { name: "Sign in", exact: true }),
  ).toBeVisible();
  expect(new URL(page.url()).searchParams.get("inviteToken")).toBe(inviteToken);
});

test("ordinary registration still rejects an existing email", async ({
  page,
}) => {
  await mockAuth(page, ({ query }) => {
    if (query.includes("query ValidateEmailAvailable")) {
      return { data: { validateEmailAvailable: false } };
    }
  });
  await page.goto("/register");
  await page.getByPlaceholder("Email", { exact: true }).fill(email);
  await page
    .getByPlaceholder("Password", { exact: true })
    .fill("VerySecurePassword");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByText("Email address is already in use", { exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/register$/);
});

test("email confirmation sends the single-use token only once", async ({
  page,
}) => {
  let confirmations = 0;
  await mockAuth(page, ({ query }) => {
    if (query.includes("mutation ConfirmUserEmail")) {
      confirmations += 1;
      return confirmations === 1
        ? { data: { confirmUserEmail: true } }
        : {
            errors: [{ message: "Your email address could not be confirmed" }],
          };
    }
  });
  await page.goto("/auth/confirm?token=single-use-token");
  await expect(
    page.getByRole("heading", {
      name: "Congratulations, your account has been confirmed!",
    }),
  ).toBeVisible();
  expect(confirmations).toBe(1);
});

test("email confirmation without a token shows an error", async ({ page }) => {
  await mockAuth(page, () => undefined);
  await page.goto("/auth/confirm");
  await expect(page.getByRole("heading", { name: "Whoops!" })).toBeVisible();
});
