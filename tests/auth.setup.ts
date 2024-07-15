import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("heading", { name: "Sign in" });
  await page
    .getByPlaceholder("Email or Username")
    .fill("testing.example@populist.us");
  await page.getByPlaceholder("Email or Username").press("Tab");
  await page.getByPlaceholder("Password").fill("somesupersecurepassword");
  await page.getByRole("button", { name: "Sign In" }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL("/home");
  await page.getByRole("link", { name: "profile picture" }).click();

  await page.context().storageState({ path: authFile });
});
