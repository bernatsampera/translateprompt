import {expect as baseExpect, Locator} from "@playwright/test";
import Fuse from "fuse.js";

// Extend the expect API with a custom matcher
export const expect = baseExpect.extend<{
  toBeSimilarText: (
    locator: Locator,
    expected: string,
    threshold?: number
  ) => Promise<{pass: boolean; message: () => string}>;
}>({
  async toBeSimilarText(locator: Locator, expected: string, threshold = 0.8) {
    const assertionName = "toBeSimilarText";
    let pass: boolean;
    let actualText: string;
    let score: number | null = null;

    try {
      // Fetch the actual text (use innerText for rendered text; textContent for raw)
      actualText = await locator.innerText(); // Or .textContent() if preferred
      actualText = actualText.trim(); // Normalize whitespace

      if (!actualText) {
        throw new Error("Element has no text content");
      }

      // Set up Fuse.js for fuzzy matching (simple config for single-string comparison)
      const fuse = new Fuse([actualText], {
        includeScore: true, // Returns a score for ranking
        threshold: 0.4, // Fuse's internal threshold (lower = stricter; adjust as needed)
        findAllMatches: true,
        useExtendedSearch: true
      });

      // Search for the expected string
      const result = fuse.search(expected)[0];
      score = result?.score ?? 1; // Default to 1 (exact/no match) if no result

      pass = score <= threshold; // Lower score = better match; invert for assertion
    } catch (e: any) {
      pass = false;
      actualText = actualText || "Unknown";
    }

    // Custom message for failures
    const message = () => {
      const received = this.utils.printReceived(actualText);
      const expectedStr = this.utils.printExpected(expected);
      return [
        this.utils.matcherHint(assertionName, undefined, undefined, {
          isNot: this.isNot
        }),
        `\n\n`,
        `Locator: ${locator}`,
        `Expected text (fuzzy threshold ${threshold}): ${expectedStr}`,
        `Received text: ${received}`,
        score !== null ? `Similarity score: ${score.toFixed(3)}` : "",
        pass
          ? ""
          : `\n\nFuzzy match failed - score too low. Adjust threshold if needed.`
      ].join("");
    };

    return {pass, message};
  }
});
