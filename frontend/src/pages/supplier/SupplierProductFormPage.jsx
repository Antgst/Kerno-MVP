import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Input from "../../components/ui/Input";
import LoadingState from "../../components/ui/LoadingState";
import ProductImage from "../../components/ui/ProductImage";
import Select from "../../components/ui/Select";
import StatusBadge from "../../components/ui/StatusBadge";
import { getCategories } from "../../services/categoryService";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../services/productService";
import { getCurrentSupplierProfile } from "../../services/supplierService";
import { getListResource, getResource } from "../../utils/responseUtils";
import {
  PRODUCT_PRICE_UNIT_OPTIONS,
  formatProductPrice,
} from "../../utils/productPrice";

const initialFormData = {
  name: "",
  categoryId: "",
  description: "",
  origin: "",
  priceEuros: "",
  priceUnit: "",
  minimumOrder: "",
  imageUrl: "",
  isActive: true,
};

function getFormDataFromProduct(product) {
  return {
    name: product?.name || "",
    categoryId: product?.categoryId || product?.category?.id || "",
    description: product?.description || "",
    origin: product?.origin || "",
    priceEuros:
      product?.priceCents !== null && product?.priceCents !== undefined
        ? String(product.priceCents / 100)
        : "",
    priceUnit: product?.priceUnit || "",
    minimumOrder: product?.minimumOrder || "",
    imageUrl: product?.imageUrl || "",
    isActive: product?.isActive ?? true,
  };
}

function getPriceCentsFromEurosInput(value) {
  const normalizedValue = String(value || "").trim().replace(",", ".");

  if (normalizedValue === "") {
    return null;
  }

  return Math.round(Number(normalizedValue) * 100);
}

function isValidPriceEurosInput(value) {
  const normalizedValue = String(value || "").trim();

  return (
    normalizedValue === "" ||
    /^\d+(?:[,.]\d{1,2})?$/.test(normalizedValue)
  );
}

function ProductFormIcon({ name }) {
  const commonProps = {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  if (name === "arrow") {
    return (
      <svg {...commonProps}>
        <path d="m15 18-6-6 6-6" />
      </svg>
    );
  }

  if (name === "image") {
    return (
      <svg {...commonProps}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="m21 15-5-5L5 20" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="m21 8-9 5-9-5 9-5 9 5Z" />
      <path d="m3 8 9 5 9-5M3 8v8l9 5 9-5V8M12 13v8" />
    </svg>
  );
}

function SupplierProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [categories, setCategories] = useState([]);
  const [hasSupplierProfile, setHasSupplierProfile] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadFormData() {
      setIsLoading(true);
      setLoadErrorMessage("");

      try {
        const [supplierResponse, categoriesResponse, productResponse] =
          await Promise.all([
            getCurrentSupplierProfile(),
            getCategories(),
            isEditMode ? getProductById(id) : null,
          ]);

        if (!shouldUpdateState) {
          return;
        }

        setHasSupplierProfile(Boolean(getResource(supplierResponse, ["supplier"])));
        setCategories(getListResource(categoriesResponse, ["categories"]));

        if (productResponse) {
          setFormData(
            getFormDataFromProduct(getResource(productResponse, ["product"])),
          );
        }
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        if (error.status === 404) {
          setHasSupplierProfile(false);
          return;
        }

        setLoadErrorMessage(
          error.message || "Impossible de charger le formulaire produit.",
        );
      } finally {
        if (shouldUpdateState) {
          setIsLoading(false);
        }
      }
    }

    loadFormData();

    return () => {
      shouldUpdateState = false;
    };
  }, [id, isEditMode]);

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  function handleChange(event) {
    const { checked, name, type, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setSubmitErrorMessage("");
  }

  function validateForm() {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Le nom du produit est obligatoire.";
    }

    if (!isValidPriceEurosInput(formData.priceEuros)) {
      errors.priceEuros = "Indiquez un montant avec deux décimales maximum.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const priceCents = getPriceCentsFromEurosInput(formData.priceEuros);

    const payload = {
      name: formData.name,
      categoryId: formData.categoryId || null,
      description: formData.description,
      origin: formData.origin,
      priceCents,
      priceUnit: formData.priceUnit || null,
      minimumOrder: formData.minimumOrder,
      imageUrl: formData.imageUrl,
      isActive: formData.isActive,
    };

    setIsSubmitting(true);
    setSubmitErrorMessage("");

    try {
      if (isEditMode) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }

      navigate("/supplier/products");
    } catch (error) {
      setSubmitErrorMessage(error.message || "Impossible d’enregistrer le produit.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedCategory = categories.find(
    (category) => category.id === formData.categoryId,
  );

  return (
    <div className="supplier-product-form-page">
      <header className="supplier-product-form-page__intro">
        <div>
          <h1>{isEditMode ? "Modifier le produit" : "Ajouter un produit"}</h1>
          <p>
            {isEditMode
              ? "Mettez à jour la fiche visible par les magasins dans le catalogue KERNO."
              : "Présentez votre produit avec les informations essentielles pour les magasins."}
          </p>
        </div>
        <Link
          className="supplier-product-form-page__back"
          to="/supplier/products"
        >
          <ProductFormIcon name="arrow" />
          Retour aux produits
        </Link>
      </header>

      {isLoading && (
        <LoadingState
          className="supplier-product-form-page__feedback"
          message="Chargement du formulaire produit..."
        />
      )}

      {loadErrorMessage && (
        <ErrorState
          className="supplier-product-form-page__feedback"
          title="Formulaire produit indisponible"
          message={loadErrorMessage}
        />
      )}

      {!isLoading && !loadErrorMessage && !hasSupplierProfile && (
        <EmptyState
          title="Profil fournisseur requis"
          message="Créez votre profil fournisseur avant d’ajouter des produits."
          action={
            <Link
              className="supplier-product-form-page__primary-link"
              to="/supplier/profile"
            >
              Créer mon profil fournisseur
            </Link>
          }
        />
      )}

      {!isLoading && !loadErrorMessage && hasSupplierProfile && (
        <div className="supplier-product-form-page__layout">
          <section className="supplier-product-form-card supplier-product-form-card--main">
            <div className="supplier-product-form-card__heading">
              <div>
                <p>Informations produit</p>
                <h2>Compléter la fiche produit</h2>
                <span>
                  Les champs peuvent être complétés progressivement, seul le
                  nom du produit est obligatoire.
                </span>
              </div>
              <span className="supplier-product-form-card__icon">
                <ProductFormIcon name="box" />
              </span>
            </div>

            {submitErrorMessage && (
              <ErrorState
                className="supplier-product-form-page__message"
                title="Échec de l’enregistrement"
                message={submitErrorMessage}
              />
            )}

            {isSubmitting && (
              <LoadingState
                className="supplier-product-form-page__message"
                message="Enregistrement du produit..."
              />
            )}

            <form className="supplier-product-form" onSubmit={handleSubmit}>
              <div className="supplier-product-form__section">
                <div className="supplier-product-form__section-heading">
                  <span>01</span>
                  <div>
                    <h3>Présentation</h3>
                    <p>Le nom, la catégorie et une description utile.</p>
                  </div>
                </div>

                <div className="supplier-product-form__fields">
                  <Input
                    label="Nom du produit"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Miel de fleurs sauvages"
                    error={fieldErrors.name}
                    required
                  />

                  <Select
                    label="Catégorie"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    options={categoryOptions}
                    placeholder={
                      categoryOptions.length > 0
                        ? "Choisir une catégorie"
                        : "Aucune catégorie disponible"
                    }
                    helperText="Cette information peut être ajoutée ultérieurement."
                  />
                </div>

                <label
                  htmlFor="description"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Décrivez le produit, sa qualité, son usage ou sa fabrication."
                />
              </div>

              <div className="supplier-product-form__section">
                <div className="supplier-product-form__section-heading">
                  <span>02</span>
                  <div>
                    <h3>Conditions professionnelles</h3>
                    <p>Les repères utiles avant une première demande.</p>
                  </div>
                </div>

                <div className="supplier-product-form__fields">
                  <Input
                    label="Origine ou localisation"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="Bretagne, France..."
                  />

                  <div className="supplier-product-form__price-group">
                    <Input
                      label="Prix indicatif (€)"
                      name="priceEuros"
                      type="text"
                      inputMode="decimal"
                      value={formData.priceEuros}
                      onChange={handleChange}
                      placeholder="12,34"
                      error={fieldErrors.priceEuros}
                    />

                    <Select
                      label="Unité"
                      name="priceUnit"
                      value={formData.priceUnit}
                      onChange={handleChange}
                      options={PRODUCT_PRICE_UNIT_OPTIONS}
                    />
                  </div>

                  <Input
                    label="Volume minimum"
                    name="minimumOrder"
                    value={formData.minimumOrder}
                    onChange={handleChange}
                    placeholder="10 kg, 24 unités..."
                  />
                </div>
              </div>

              <div className="supplier-product-form__section">
                <div className="supplier-product-form__section-heading">
                  <span>03</span>
                  <div>
                    <h3>Visuel et publication</h3>
                    <p>Ajoutez un lien d’image si vous en disposez.</p>
                  </div>
                </div>

                <Input
                  label="Lien vers l’image du produit"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://exemple.fr/produit.jpg"
                  helperText="Renseignez une adresse d’image accessible. Un visuel KERNO s’affiche à défaut."
                />

                <label className="supplier-product-form__visibility">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <span>
                    <strong>Produit visible dans le catalogue</strong>
                    <small>
                      Les magasins pourront consulter cette fiche produit.
                    </small>
                  </span>
                </label>
              </div>

              <button
                className="supplier-product-form__submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Enregistrement..."
                  : isEditMode
                    ? "Mettre à jour le produit"
                    : "Créer le produit"}
              </button>
            </form>
          </section>

          <aside className="supplier-product-form-card supplier-product-preview">
            <div className="supplier-product-preview__heading">
              <div>
                <p>Prévisualisation</p>
                <h2>Aperçu catalogue</h2>
                <span>Vérifiez les informations principales avant l’enregistrement.</span>
              </div>
              <StatusBadge
                status={formData.isActive ? "ACTIVE" : "INACTIVE"}
                label={formData.isActive ? "Disponible" : "Indisponible"}
              />
            </div>

            <div className="supplier-product-preview__card">
              <div className="supplier-product-preview__media">
                <ProductImage
                  product={{
                    ...formData,
                    category: selectedCategory,
                  }}
                  alt={`Aperçu du produit ${formData.name || "KERNO"}`}
                />
                <span>
                  <ProductFormIcon name="image" />
                  Aperçu du visuel
                </span>
              </div>

              <div className="supplier-product-preview__content">
                <span className="supplier-product-preview__category">
                  {selectedCategory?.name || "Produit fournisseur"}
                </span>
                <h3>{formData.name || "Nom du produit"}</h3>
                <p>
                  {formData.description ||
                    "Ajoutez une description pour présenter la qualité et l’usage du produit."}
                </p>

                <dl>
                  <div>
                    <dt>Origine</dt>
                    <dd>{formData.origin || "À préciser"}</dd>
                  </div>
                  <div>
                    <dt>Prix indicatif</dt>
                    <dd>
                      {formatProductPrice({
                        priceCents: getPriceCentsFromEurosInput(formData.priceEuros),
                        priceUnit: formData.priceUnit,
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt>Volume minimum</dt>
                    <dd>{formData.minimumOrder || "À convenir"}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default SupplierProductFormPage;
