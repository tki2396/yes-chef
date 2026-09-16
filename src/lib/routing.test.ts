import { describe, expect, test } from "bun:test";
import { normalizeBasePath } from "./routing";

describe("normalizeBasePath", () => {
  test("normalizes a GitHub Pages project path", () => {
    expect(normalizeBasePath("yes-chef/")).toBe("/yes-chef");
  });

  test("keeps local development at the domain root", () => {
    expect(normalizeBasePath("")).toBe("");
    expect(normalizeBasePath("/")).toBe("");
  });
});
