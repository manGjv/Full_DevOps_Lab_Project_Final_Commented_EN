/**
 * GET /version → { version: "<package.json version>" }
 * Reads version from package.json to keep it source-of-truth.
 */
import { Router } from "express"; // express est le framework pour créer des routes web (API HTTP)
import fs from "node:fs"; // fs permet de lire et écrire des fichiers
import path from "node:path"; // permet de manipuler les chemins de fichiers de manière sure
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url); // chemin complet du fichier actuel
const __dirname = path.dirname(__filename); // dossier où se trouve ce fichier

const router = Router(); // création d'un routeur Express 

// On définit une route HTTP GET
router.get("/version", (_req, res) => {
  // JSON.parse transforme le contenu texte du fichier en objet JavaScript
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "..", "..", "package.json"), "utf-8")
  );
  res.status(200).json({ version: pkg.version }); // renvoie une réponse HTTP avec le statut 200 (succès) et un corps JSON contenant la clé "version"
});

export default router;
