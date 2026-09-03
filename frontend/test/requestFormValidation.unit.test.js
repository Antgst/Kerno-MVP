import test from "node:test";
import assert from "node:assert/strict";

import { getRequestFormErrors } from "../src/utils/requestFormValidation.js";

test("returns the three required-field errors for an empty request", () => {
  const errors = getRequestFormErrors({
    supplierId: "",
    subject: "",
    message: "",
  });

  assert.deepEqual(errors, {
    supplierId:
      "Sélectionnez un fournisseur depuis le catalogue avant d’envoyer votre demande.",
    subject: "L’objet est obligatoire.",
    message: "Le message est obligatoire.",
  });
});

test("treats whitespace-only required values as empty", () => {
  const errors = getRequestFormErrors({
    supplierId: "   ",
    subject: "\t",
    message: "\n",
  });

  assert.deepEqual(Object.keys(errors).sort(), ["message", "subject", "supplierId"]);
});

test("accepts a complete request and keeps optional fields out of validation", () => {
  const errors = getRequestFormErrors({
    supplierId: "supplier-1",
    productId: "",
    subject: "Demande catalogue",
    message: "Bonjour, je souhaite des informations.",
    requestedQuantity: "",
  });

  assert.deepEqual(errors, {});
});

test("reports only the missing required field", () => {
  const errors = getRequestFormErrors({
    supplierId: "supplier-1",
    subject: "Demande catalogue",
    message: "   ",
  });

  assert.deepEqual(errors, {
    message: "Le message est obligatoire.",
  });
});
