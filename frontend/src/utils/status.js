const REQUEST_STATUS_LABELS = {
  PENDING: "En attente",
  READ: "Lue",
  ANSWERED: "Répondue",
  CLOSED: "Clôturée",
};

const REQUEST_STATUS_ALIASES = {
  "EN ATTENTE": "PENDING",
  PENDING: "PENDING",

  LUE: "READ",
  READ: "READ",

  REPONDUE: "ANSWERED",
  RÉPONDUE: "ANSWERED",
  ANSWERED: "ANSWERED",
  REPLIED: "ANSWERED",

  CLOTUREE: "CLOSED",
  CLÔTURÉE: "CLOSED",
  CLOSED: "CLOSED",

  ACCEPTED: "READ",
  ACCEPTEE: "READ",
  ACCEPTÉE: "READ",

  COMPLETED: "ANSWERED",
  DONE: "ANSWERED",
  RESOLVED: "ANSWERED",
  TRAITEE: "ANSWERED",
  TRAITÉE: "ANSWERED",

  REFUSED: "CLOSED",
  REFUSEE: "CLOSED",
  REFUSÉE: "CLOSED",
  REJECTED: "CLOSED",

  ANNULEE: "CLOSED",
  ANNULÉE: "CLOSED",
  CANCELED: "CLOSED",
  CANCELLED: "CLOSED",
};

const STATUS_LABELS = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  DRAFT: "Brouillon",
  VALIDATED: "Validée",
  ERROR: "Erreur",
};

function normalizeStatus(status) {
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
  const canonicalStatus = getCanonicalRequestStatus(status);

  if (canonicalStatus === "PENDING") {
    return "pending";
  }

  if (canonicalStatus === "READ") {
    return "accepted";
  }

  if (canonicalStatus === "ANSWERED") {
    return "processed";
  }

  if (canonicalStatus === "CLOSED") {
    return "processed";
  }

  return "neutral";
}

export const requestStatusOptions = [
  { value: "PENDING", label: REQUEST_STATUS_LABELS.PENDING },
  { value: "READ", label: REQUEST_STATUS_LABELS.READ },
  { value: "ANSWERED", label: REQUEST_STATUS_LABELS.ANSWERED },
  { value: "CLOSED", label: REQUEST_STATUS_LABELS.CLOSED },
];
