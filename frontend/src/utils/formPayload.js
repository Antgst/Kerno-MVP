export function cleanOptionalText(value) {
  const trimmedValue = String(value || "").trim();

  return trimmedValue || null;
}

export function cleanRequiredText(value) {
  return String(value || "").trim();
}