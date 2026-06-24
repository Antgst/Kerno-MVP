const REQUEST_STATUS_LABELS = {
  PENDING: "En attente",
  ACCEPTED: "Acceptée",
  REJECTED: "Refusée",
  COMPLETED: "Traitée",
  CANCELLED: "Annulée",
};

const REQUEST_STATUS_ALIASES = {
  "EN ATTENTE": "PENDING",
  PENDING: "PENDING",
  LUE: "PENDING",
  READ: "PENDING",
  ACCEPTED: "ACCEPTED",
  ACCEPTEE: "ACCEPTED",
  ACCEPTÉE: "ACCEPTED",
  VALIDATED: "ACCEPTED",
  VALIDEE: "ACCEPTED",
  VALIDÉE: "ACCEPTED",
  REFUSED: "REJECTED",
  REFUSEE: "REJECTED",
  REFUSÉE: "REJECTED",
  REJECTED: "REJECTED",
  REPONDUE: "COMPLETED",
  RÉPONDUE: "COMPLETED",
  ANSWERED: "COMPLETED",
  REPLIED: "COMPLETED",
  CLOTUREE: "COMPLETED",
  CLÔTURÉE: "COMPLETED",
  CLOSED: "COMPLETED",
  COMPLETED: "COMPLETED",
  DONE: "COMPLETED",
  RESOLVED: "COMPLETED",
  TRAITEE: "COMPLETED",
  TRAITÉE: "COMPLETED",
  ANNULEE: "CANCELLED",
  ANNULÉE: "CANCELLED",
  CANCELED: "CANCELLED",
  CANCELLED: "CANCELLED",
};

const STATUS_LABELS = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  DRAFT: "Brouillon",
  VALIDATED: "Validée",
  ERROR: "Erreur",
};

export function normalizeStatus(status) {
  return String(status || "UNKNOWN").trim().toUpperCase();
}

export function getCanonicalRequestStatus(status) {
  const normalizedStatus = normalizeStatus(status);

  return REQUEST_STATUS_ALIASES[normalizedStatus] || normalizedStatus;
}

export function formatStatus(status, fallback = "Statut inconnu") {
  const normalizedStatus = normalizeStatus(status);
  const canonicalRequestStatus = getCanonicalRequestStatus(normalizedStatus);

  if (REQUEST_STATUS_LABELS[canonicalRequestStatus]) {
    return REQUEST_STATUS_LABELS[canonicalRequestStatus];
  }

  if (STATUS_LABELS[normalizedStatus]) {
    return STATUS_LABELS[normalizedStatus];
  }

  if (normalizedStatus === "UNKNOWN") {
    return fallback;
  }

  return "Statut à confirmer";
}

export function getStatusTone(status) {
  const normalizedStatus = getCanonicalRequestStatus(status);

  if (normalizedStatus === "PENDING") {
    return "pending";
  }

  if (normalizedStatus === "ACCEPTED") {
    return "accepted";
  }

  if (normalizedStatus === "REJECTED") {
    return "rejected";
  }

  if (normalizedStatus === "CANCELLED") {
    return normalizedStatus.toLocaleLowerCase("fr-FR");
  }

  if (normalizedStatus === "COMPLETED") {
    return "processed";
  }

  return "neutral";
}

export const requestStatusOptions = [
  { value: "PENDING", label: REQUEST_STATUS_LABELS.PENDING },
  { value: "ACCEPTED", label: REQUEST_STATUS_LABELS.ACCEPTED },
  { value: "REJECTED", label: REQUEST_STATUS_LABELS.REJECTED },
  { value: "COMPLETED", label: REQUEST_STATUS_LABELS.COMPLETED },
  { value: "CANCELLED", label: REQUEST_STATUS_LABELS.CANCELLED },
];
