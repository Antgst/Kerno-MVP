export function getSafeCompletionPercent(value) {
  const percent = Number(value);

  if (!Number.isFinite(percent)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(percent)));
}
