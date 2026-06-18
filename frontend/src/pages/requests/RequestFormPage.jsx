import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ErrorState from "../../components/ui/ErrorState";
import Input from "../../components/ui/Input";
import LoadingState from "../../components/ui/LoadingState";
import StatusBadge from "../../components/ui/StatusBadge";
import { getProductById } from "../../services/productService";
import { createContactRequest } from "../../services/requestService";
import { getSupplierById } from "../../services/supplierService";
import { getResource } from "../../utils/responseUtils";

const initialFormData = {
  supplierId: "",
  productId: "",
  subject: "",
  message: "",
  requestedQuantity: "",
};

function RequestFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    ...initialFormData,
    supplierId: searchParams.get("supplierId") || "",
    productId: searchParams.get("productId") || "",
  });

  const [supplier, setSupplier] = useState(null);
  const [product, setProduct] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadRequestContext() {
      if (!formData.supplierId && !formData.productId) {
        return;
      }

      setIsLoadingContext(true);
      setLoadErrorMessage("");

      try {
        const [supplierResponse, productResponse] = await Promise.all([
          formData.supplierId ? getSupplierById(formData.supplierId) : null,
          formData.productId ? getProductById(formData.productId) : null,
        ]);

        if (!shouldUpdateState) {
          return;
        }

        const loadedSupplier = getResource(supplierResponse, ["supplier"]);
        const loadedProduct = getResource(productResponse, ["product"]);

        setSupplier(loadedSupplier);
        setProduct(loadedProduct);

        setFormData((currentData) => {
          if (currentData.subject) {
            return currentData;
          }

          if (loadedProduct?.name) {
            return {
              ...currentData,
              subject: `Demande pour ${loadedProduct.name}`,
            };
          }

          if (loadedSupplier?.companyName) {
            return {
              ...currentData,
              subject: `Demande de contact - ${loadedSupplier.companyName}`,
            };
          }

          return currentData;
        });
      } catch (error) {
        if (shouldUpdateState) {
          setLoadErrorMessage(
            error.message || "Impossible de charger le contexte de la demande.",
          );
        }
      } finally {
        if (shouldUpdateState) {
          setIsLoadingContext(false);
        }
      }
    }

    loadRequestContext();

    return () => {
      shouldUpdateState = false;
    };
  }, [formData.supplierId, formData.productId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setSubmitErrorMessage("");
  }

  function validateForm() {
    const errors = {};

    if (!formData.supplierId.trim()) {
      errors.supplierId = "L’identifiant du fournisseur est obligatoire.";
    }

    if (!formData.subject.trim()) {
      errors.subject = "L’objet est obligatoire.";
    }

    if (!formData.message.trim()) {
      errors.message = "Le message est obligatoire.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitErrorMessage("");

    try {
      const response = await createContactRequest({
        supplierId: formData.supplierId,
        productId: formData.productId || null,
        subject: formData.subject,
        message: formData.message,
        requestedQuantity: formData.requestedQuantity,
      });

      const createdRequest = getResource(response, ["request"]);

      navigate(createdRequest?.id ? `/store/requests/${createdRequest.id}` : "/store/requests");
    } catch (error) {
      setSubmitErrorMessage(error.message || "Impossible de créer la demande.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="text-slate-950">
      <PageHeader
        eyebrow="Demande de contact"
        title="Faire une demande"
        description="Envoyez une demande de contact ou de devis structurée à un fournisseur."
      >
        <Link to="/catalog">
          <Button variant="secondary">Retour au catalogue</Button>
        </Link>
      </PageHeader>

      {isLoadingContext && (
        <LoadingState message="Chargement du contexte de la demande..." />
      )}

      {loadErrorMessage && (
        <ErrorState
          className="mb-6"
          title="Contexte indisponible"
          message={loadErrorMessage}
        />
      )}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          {submitErrorMessage && (
            <ErrorState
              className="mb-5"
              title="Échec de création de la demande"
              message={submitErrorMessage}
            />
          )}

          {isSubmitting && (
            <LoadingState className="mb-5" message="Création de la demande..." />
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Identifiant fournisseur"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              placeholder="Identifiant du fournisseur"
              error={fieldErrors.supplierId}
              helperText="Ce champ est rempli automatiquement depuis une fiche fournisseur ou produit."
              required
            />

            <Input
              label="Identifiant produit"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              placeholder="Identifiant du produit (facultatif)"
              helperText="Facultatif, si la demande concerne un produit précis."
            />

            <Input
              label="Objet"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Demande de tarifs professionnels"
              error={fieldErrors.subject}
              required
            />

            <div>
              <label
                className="mb-2 block text-sm font-bold text-slate-800"
                htmlFor="message"
              >
                Message <span className="text-orange-500">*</span>
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="Décrivez votre besoin, les délais souhaités et vos questions."
                className={[
                  "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900",
                  "outline-none transition placeholder:text-slate-400 focus:ring-2",
                  fieldErrors.message
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-emerald-800 focus:ring-emerald-100",
                ].join(" ")}
              />

              {fieldErrors.message && (
                <p className="mt-2 text-sm font-semibold text-red-600">
                  {fieldErrors.message}
                </p>
              )}
            </div>

            <Input
              label="Quantité ou besoin professionnel"
              name="requestedQuantity"
              value={formData.requestedQuantity}
              onChange={handleChange}
              placeholder="50 kg, 100 unités, approvisionnement régulier..."
              helperText="Facultatif. Indiquez simplement votre besoin."
            />

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Envoyer la demande"}
            </Button>
          </form>
        </Card>

        <Card>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="m-0 text-xl font-black">
                Contexte de la demande
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Vérifiez le fournisseur et le produit concernés avant l’envoi.
              </p>
            </div>

            <StatusBadge status="DRAFT" />
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Fournisseur
              </p>
              <p className="mt-1 text-xl font-black text-slate-950">
                {supplier?.companyName || "Fournisseur non chargé"}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {supplier?.location || "Localisation non renseignée"}
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Produit
              </p>
              <p className="mt-1 text-xl font-black text-slate-950">
                {product?.name || "Aucun produit spécifique"}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {product?.priceInfo || "Tarif sur demande"}
              </p>
            </div>

            <div className="rounded-3xl bg-emerald-950 p-6 text-white">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">
                Périmètre du MVP
              </p>

              <h3 className="mt-3 text-2xl font-black">
                Un premier contact professionnel
              </h3>

              <p className="mt-3 text-sm leading-6 text-emerald-50">
                Ce formulaire transmet une demande de contact. Il ne crée ni
                commande, ni paiement, ni échange de messagerie avancé.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default RequestFormPage;
