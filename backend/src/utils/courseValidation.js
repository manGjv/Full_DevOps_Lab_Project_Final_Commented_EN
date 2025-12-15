export function isValidCourse(data) {
  if (!data) return false;
  if (!data.title || typeof data.title !== "string") return false;
  if (!data.domain || typeof data.domain !== "string") return false;

  const allowedLevels = ["beginner", "intermediate", "expert"];
  if (!data.level || typeof data.level !== "string") return false;
  if (!allowedLevels.includes(data.level.toLowerCase())) return false;

  return true;
}
