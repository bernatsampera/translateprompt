import {test} from "@playwright/test";
import {expect} from "../test-utils/fuzzyMatchers"; // Adjust path as needed

test("has title", async ({page}) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).not.toHaveTitle(/MASDMFASGFDF/);
});

test("get login link link", async ({page}) => {
  await page.goto("/");

  // Locate the element with exact href="/auth"
  const authLink = page.locator('a[href="/auth"]').first();

  // Click the get started link.
  await authLink.click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByText("Sign in").first()).toBeVisible();

  const inputEmail = page.locator('input[name="email"]');
  const inputPassword = page.locator('input[name="password"]');

  await inputEmail.fill("indem.zeit@gmail.com");
  await inputPassword.fill("Test123@");

  await page.getByRole("button", {name: "Sign in"}).click();

  const inputTextToTranslate = page.locator(
    'textarea[placeholder="Enter text to translate..."]'
  );
  await inputTextToTranslate.fill("Hello, world!");

  await page.getByTestId("translate-button").click();

  const aiResponsePromise = page.waitForResponse(
    (resp) => resp.url().includes("/graphs/translate") && resp.status() === 200, // Filter: Your endpoint + success
    {timeout: 15000}
  ); // 15s max wait for response; adjust for AI slowness

  const aiResponse = await aiResponsePromise; // Resolves when response is back

  // Optional: Inspect response (e.g., ensure it's not empty/error)
  const responseJson = await aiResponse.json();
  expect(responseJson).toHaveProperty("response"); // Or check !responseJson.error
  console.log("AI response received:", responseJson); // For debugging

  await expect(page.getByTestId("translated-text")).toBeSimilarText(
    "Hola, mundo!"
  );
});
