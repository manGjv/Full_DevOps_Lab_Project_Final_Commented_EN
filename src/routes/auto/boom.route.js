/**
 * GET /boom → triggers an error to exercise the global error handler.
 */
import { Router } from "express";

const router = Router(); // création du routeur

// Crée une route HTTP GET à l'adresse /boom
router.get("/boom", (_req, _res, next) => {
  const err = new Error("Boom!"); // on crée un objet erreur standard
  err.status = 500; // attribue un code HTTP 500 (erreur serveur)
  next(err);
});

export default router;
