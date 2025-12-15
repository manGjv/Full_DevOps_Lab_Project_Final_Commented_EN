/**
 * GET /info → merges two small helpers for easy unit testing.
 * Returns: { name, version, node, uptime }
 */
import { Router } from "express";
import { getPackageInfo, getRuntimeInfo } from "../../utils/appInfo.js"; 

const router = Router(); // initialise le routeur express

// Crée un endpoint HTTP GET à l'adresse /info
router.get("/info", (_req, res) => {
  // récupère les infos sur l'app
  const info = { ...getPackageInfo(), ...getRuntimeInfo() };
  res.status(200).json(info);
});

export default router;
