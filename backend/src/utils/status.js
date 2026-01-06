/**
 * Utility designed to create branch coverage.
 * Maps uptime (seconds) to a label.
 */
export function formatStatus(uptimeSec) {
  if (uptimeSec < 0) throw new Error("invalid uptime"); // si la valeur d'uptime, la fonction lance une erreur
  if (uptimeSec < 60) return "warming-up"; // phase de démarrage
  if (uptimeSec < 3600) return "healthy"; 
  return "steady"; 
}
