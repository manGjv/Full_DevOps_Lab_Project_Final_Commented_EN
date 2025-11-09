/**
 * Unit tests for src/utils/status.js.
 * Covers all branches for good branch coverage.
 */
import { describe, it, expect } from "vitest";
import { formatStatus } from "../../src/utils/status.js"; // fonction à tester

describe("formatStatus", () => {
  it("throws on negative", () => {
    expect(() => formatStatus(-1)).toThrow("invalid uptime"); // Comme on met une valeur négative en paramètre, on s'attend à ce que la fonction lance une erreur contenant "invalid uptime"
  });
  it("warming-up under 60s", () => {
    expect(formatStatus(10)).toBe("warming-up"); // Si le serveur tourne depuis 10 sec, on s'attend à warming-up
  });
  it("healthy under 1h", () => {
    expect(formatStatus(3599)).toBe("healthy"); // Si le serveur est actif depuis moins de 1h on s'attend à healthy
  });
  it("steady at or after 1h", () => {
    expect(formatStatus(3600)).toBe("steady"); // Si le serveur est stable depuis 1h ou plus
  });
});
