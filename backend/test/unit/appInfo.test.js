/**
 * Unit tests for src/utils/appInfo.js.
 * No HTTP or Express involved; just pure functions.
 */
import { describe, it, expect, vi } from "vitest";
import { getPackageInfo, getRuntimeInfo } from "../../src/utils/appInfo.js"; // les fonctions à tester

// Test pour getPackageInfo
describe("getPackageInfo", () => {
  it("returns name and version", () => { 
    const info = getPackageInfo(); // exécute la fonction
    expect(info).toHaveProperty("name"); // vérifie que l'objet retourné contient bien une propriété name
    expect(info).toHaveProperty("version"); // vérifie que l'objet retourné contient bien une propriété version
  });
});

// Tests pour getRuntimeInfo
describe("getRuntimeInfo", () => {
  // Vérifie que la fonction retourne bien une chaine de caractères pour node et un nombre pour uptime
  it("returns node and uptime", () => {
    const runtime = getRuntimeInfo();
    expect(typeof runtime.node).toBe("string");
    expect(typeof runtime.uptime).toBe("number");
  });

  // Vérifie que la fonction appelle vraiment process.uptime()
  it("calls process.uptime()", () => {
    const spy = vi.spyOn(process, "uptime");
    getRuntimeInfo();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
