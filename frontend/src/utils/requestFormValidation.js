export function getRequestFormErrors(formData) {
  const errors = {};

  if (!formData?.supplierId?.trim()) {
    errors.supplierId =
      "Sélectionnez un fournisseur depuis le catalogue avant d’envoyer votre demande.";
  }

  if (!formData?.subject?.trim()) {
    errors.subject = "L’objet est obligatoire.";
  }

  if (!formData?.message?.trim()) {
    errors.message = "Le message est obligatoire.";
  }

  return errors;
}
