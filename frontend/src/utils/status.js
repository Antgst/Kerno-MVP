const STATUS_LABELS = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  DRAFT: "Brouillon",
  PENDING: "En attente",
  READ: "Lue",
  ANSWERED: "Répondue",
  REPLIED: "Répondue",
  ACCEPTED: "Acceptée",
  REJECTED: "Refusée",
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

  if (["ACCEPTED", "ANSWERED", "REPLIED"].includes(normalizedStatus)) {
    return "accepted";
  }

  if (normalizedStatus === "REJECTED") {
    return "rejected";
  }

  if (
    ["COMPLETED", "DONE", "RESOLVED", "CLOSED"].includes(normalizedStatus)
  ) {
    return "processed";
  }

  return "neutral";
}

export const requestStatusOptions = [
  { value: "PENDING", label: formatStatus("PENDING") },
  { value: "READ", label: formatStatus("READ") },
  { value: "ANSWERED", label: formatStatus("ANSWERED") },
  { value: "ACCEPTED", label: formatStatus("ACCEPTED") },
  { value: "REJECTED", label: formatStatus("REJECTED") },
  { value: "COMPLETED", label: formatStatus("COMPLETED") },
  { value: "CLOSED", label: formatStatus("CLOSED") },
  { value: "CANCELLED", label: formatStatus("CANCELLED") },
];
