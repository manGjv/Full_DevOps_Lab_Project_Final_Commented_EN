import { describe, it, expect } from "vitest";
import { isValidCourse } from "../../src/utils/courseValidation.js";

describe("isValidCourse", () => {
  it("returns true for a valid course object", () => {
    const course = {
      title: "Intro to Phishing",
      domain: "Email Security",
      level: "beginner",
    };
    expect(isValidCourse(course)).toBe(true);
  });

  it("returns false if title is missing", () => {
    const course = { domain: "Email Security", level: "beginner" };
    expect(isValidCourse(course)).toBe(false);
  });

  it("returns false if level is invalid", () => {
    const course = {
      title: "Bad level",
      domain: "Email Security",
      level: "advanced",
    };
    expect(isValidCourse(course)).toBe(false);
  });

  it("returns false if data is null", () => {
    expect(isValidCourse(null)).toBe(false);
  });
});
