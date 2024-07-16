import { Page, test as setup } from "@playwright/test";
import { Role } from "generated";

const users = [
  {
    role: Role.Basic,
    username: "testing@example.com",
    password: "somesupersecurepassword",
    authFile: "playwright/.auth/basic.json",
  },
  {
    role: Role.Premium,
    organization: "mpr-news",
    username: "testing@mprnews.org",
    password: "somesupersecurepassword",
    authFile: "playwright/.auth/premium.json",
  },
  {
    role: Role.Superuser,
    username: "superuser@populist.us",
    password: "somesupersecurepassword",
    authFile: "playwright/.auth/superuser.json",
  },
];

async function loginUser(
  page: Page,
  username: string,
  password: string,
  authFile: string
): Promise<void> {
  await page.goto("/login");
  await page.getByRole("heading", { name: "Sign in" });
  await page.getByPlaceholder("Email or Username").fill(username);
  await page.getByPlaceholder("Email or Username").press("Tab");
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL("/home");
  await page.getByRole("link", { name: "profile picture" }).click();
  await page.context().storageState({ path: authFile });
}

setup.describe("authenticate users", () => {
  for (const user of users) {
    setup(`authenticate as ${user.role} user`, async ({ page }) => {
      await loginUser(page, user.username, user.password, user.authFile);
    });
  }
});
