import {test} from "@playwright/test";
import {expect} from "../test-utils/fuzzyMatchers"; // Adjust path as needed

test("has title", async ({page}) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).not.toHaveTitle(/MASDMFASGFDF/);
});

// Helper functions
async function login(page, email, password) {
  await page.goto("/");
  await page.locator('a[href="/auth"]').first().click();
  await expect(page.getByText("Sign in").first()).toBeVisible();

  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", {name: "Sign in"}).click();
}

// Main test
test("get login link and translate text", async ({page}) => {
  async function translateText(page, text) {
    await page.getByTestId("translate-input").fill(text);
    await page.getByTestId("translate-button").click();
  }

  async function waitForTranslationResponse(page) {
    const response = await page.waitForResponse(
      (resp) =>
        resp.url().includes("/graphs/translate") && resp.status() === 200,
      {timeout: 15000}
    );

    const responseJson = await response.json();
    expect(responseJson).toHaveProperty("response");
    console.log("AI response received:", responseJson);

    return responseJson;
  }

  await login(page, "indem.zeit@gmail.com", "Test123@");

  await translateText(page, "Hello, world!");

  await waitForTranslationResponse(page);

  await expect(page.getByTestId("translated-text")).toBeSimilarText(
    "Hola, mundo!"
  );
});
