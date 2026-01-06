/**
 * Unit tests for src/utils/errorHandler.js.
 * We stub a minimal `res` object to capture status and body.
 */
import { describe, it, expect } from "vitest";
import { errorHandler } from "../../src/utils/errorHandler.js"; // on importe errorHandler la fonction à etster

// création d'un faux objet res
function makeRes() {
  return {
    statusCode: 0,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; return this; }
  };
}

describe("errorHandler", () => {
  it("defaults to 500 with generic message", () => {
    const res = makeRes(); 
    errorHandler({}, {}, res, () => {}); 
    expect(res.statusCode).toBe(500); // on vérifie que la fonction errorHandler renvoie 500
    expect(res.body).toEqual({ error: true, message: "Internal Server Error" }); // on vérifie que le message "Internal Server Error" esst renvoyé
  });

  it("uses provided status and message", () => {
    const res = makeRes();
    errorHandler({ status: 418, message: "teapot" }, {}, res, () => {}); // on fournit une erreur personnalisée
    expect(res.statusCode).toBe(418); // on attend que le code de réponse soit 418
    expect(res.body).toEqual({ error: true, message: "teapot" }); // on attend que le corps JSON contienne {error : true, message: "teapot"}
  });
});
