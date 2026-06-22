import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import RequestContextCard from "../../components/requests/RequestContextCard";
import RequestFormFields from "../../components/requests/RequestFormFields";
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
      errors.supplierId =
        "Sélectionnez un fournisseur depuis le catalogue avant d’envoyer votre demande.";
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

      navigate(
        createdRequest?.id ? `/store/requests/${createdRequest.id}` : "/store/requests",
      );
    } catch (error) {
      setSubmitErrorMessage(error.message || "Impossible de créer la demande.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="request-form-page">
      <PageHeader
        className="request-form-page__header"
        eyebrow="Demande de contact"
        title="Envoyer une demande"
        description="Présentez votre besoin au fournisseur en quelques informations essentielles."
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

      <div className="request-form-page__layout">
        <Card className="request-form-page__card request-form-page__card--main">
          <div className="request-form-page__card-heading">
            <p>Message professionnel</p>
            <h2>Préparer votre demande</h2>
            <span>
              Le fournisseur recevra ces informations pour vous répondre de
              façon précise.
            </span>
          </div>
          <RequestFormFields
            fieldErrors={fieldErrors}
            formData={formData}
            isSubmitting={isSubmitting}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitErrorMessage={submitErrorMessage}
          />
        </Card>

        <Card className="request-form-page__card request-form-page__context">
          <RequestContextCard product={product} supplier={supplier} />
        </Card>
      </div>
    </div>
  );
}

export default RequestFormPage;
