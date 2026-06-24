const STATUS_LABELS = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  DRAFT: "Brouillon",
  PENDING: "En attente",
  READ: "Lue",
  ANSWERED: "Répondue",
  REPLIED: "Répondue",
  ACCEPTED: "Acceptée",
  VALIDATED: "Validée",
  REJECTED: "Refusée",
  REFUSED: "Refusée",
  COMPLETED: "Traitée",
  DONE: "Traitée",
  RESOLVED: "Traitée",
  CLOSED: "Clôturée",
  CANCELLED: "Annulée",
  ERROR: "Erreur",
};

export function normalizeStatus(status) {
  return String(status || "UNKNOWN").trim().toUpperCase();
}

export function formatStatus(status, fallback = "Statut inconnu") {
  const normalizedStatus = normalizeStatus(status);

  if (STATUS_LABELS[normalizedStatus]) {
    return STATUS_LABELS[normalizedStatus];
  }

  if (normalizedStatus === "UNKNOWN") {
    return fallback;
  }

  return "Statut à confirmer";
}

export function getStatusTone(status) {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "PENDING") {
    return "pending";
  }

  if (
    ["ACCEPTED", "ANSWERED", "REPLIED", "VALIDATED", "READ"].includes(
      normalizedStatus,
    )
  ) {
    return "accepted";
  }

  if (["REJECTED", "REFUSED", "CANCELLED"].includes(normalizedStatus)) {
    return normalizedStatus.toLocaleLowerCase("fr-FR");
  }

  if (["COMPLETED", "DONE", "RESOLVED"].includes(normalizedStatus)) {
    return "processed";
  }

  if (normalizedStatus === "CLOSED") {
    return "closed";
  }

  return "neutral";
}

export const requestStatusOptions = [
  { value: "PENDING", label: formatStatus("PENDING") },
  { value: "ACCEPTED", label: formatStatus("ACCEPTED") },
  { value: "REJECTED", label: formatStatus("REJECTED") },
  { value: "COMPLETED", label: formatStatus("COMPLETED") },
  { value: "CANCELLED", label: formatStatus("CANCELLED") },
];
