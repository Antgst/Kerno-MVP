import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/shared/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Input from "../../components/ui/Input";
import LoadingState from "../../components/ui/LoadingState";
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

const initialFormData = {
  name: "",
  categoryId: "",
  description: "",
  origin: "",
  priceInfo: "",
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
    priceInfo: product?.priceInfo || "",
    minimumOrder: product?.minimumOrder || "",
    imageUrl: product?.imageUrl || "",
    isActive: product?.isActive ?? true,
  };
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

    const payload = {
      name: formData.name,
      categoryId: formData.categoryId || null,
      description: formData.description,
      origin: formData.origin,
      priceInfo: formData.priceInfo,
      minimumOrder: formData.minimumOrder,
      imageUrl: formData.imageUrl,
      isActive: formData.isActive,
    };

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

  return (
    <div className="text-slate-950">
      <PageHeader
        eyebrow="Produits fournisseur"
        title={isEditMode ? "Modifier le produit" : "Ajouter un produit"}
        description={
          isEditMode
            ? "Mettez à jour les informations visibles dans le catalogue KERNO."
            : "Créez une fiche produit claire pour les magasins qui consultent le catalogue."
        }
      >
        <Link to="/supplier/products">
          <Button variant="secondary">Retour aux produits</Button>
        </Link>
      </PageHeader>

      {isLoading && <LoadingState message="Chargement du formulaire produit..." />}

      {loadErrorMessage && (
        <ErrorState
          title="Formulaire produit indisponible"
          message={loadErrorMessage}
        />
      )}

      {!isLoading && !loadErrorMessage && !hasSupplierProfile && (
        <EmptyState
          title="Profil fournisseur requis"
          message="Créez votre profil fournisseur avant d’ajouter des produits."
          action={
            <Link to="/supplier/profile">
              <Button>Créer mon profil fournisseur</Button>
            </Link>
          }
        />
      )}

      {!isLoading && !loadErrorMessage && hasSupplierProfile && (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            {submitErrorMessage && (
              <ErrorState
                className="mb-5"
                title="Échec de l’enregistrement"
                message={submitErrorMessage}
              />
            )}

            {isSubmitting && (
              <LoadingState className="mb-5" message="Enregistrement du produit..." />
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                helperText="Facultatif pour le moment."
              />

              <div>
                <label
                  className="mb-2 block text-sm font-bold text-slate-800"
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
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Origine ou localisation"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  placeholder="Bretagne, France..."
                />

                <Input
                  label="Prix indicatif"
                  name="priceInfo"
                  value={formData.priceInfo}
                  onChange={handleChange}
                  placeholder="12 € / kg, tarif sur demande..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Commande minimale"
                  name="minimumOrder"
                  value={formData.minimumOrder}
                  onChange={handleChange}
                  placeholder="10 kg, 24 unités..."
                />

                <Input
                  label="Adresse de l’image"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/product.jpg"
                />
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Produit visible dans le catalogue
              </label>

              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Enregistrement..."
                  : isEditMode
                    ? "Mettre à jour le produit"
                    : "Créer le produit"}
              </Button>
            </form>
          </Card>

          <Card>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="m-0 text-xl font-black">Aperçu du produit</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Vérifiez les principales informations qui seront visibles
                  dans le catalogue.
                </p>
              </div>

              <StatusBadge
                status={formData.isActive ? "ACTIVE" : "INACTIVE"}
                label={formData.isActive ? "Disponible" : "Indisponible"}
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="m-0 text-2xl font-black text-slate-950">
                {formData.name || "Nom du produit"}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {formData.description || "Aucune description pour le moment."}
              </p>

              <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                    Catégorie
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {categories.find(
                      (category) => category.id === formData.categoryId,
                    )?.name || "Non renseignée"}
                  </p>
                </div>

                <div>
                  <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                    Origine
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {formData.origin || "Non renseignée"}
                  </p>
                </div>

                <div>
                  <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                    Prix indicatif
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {formData.priceInfo || "Tarif sur demande"}
                  </p>
                </div>

                <div>
                  <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                    Commande minimale
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {formData.minimumOrder || "Non renseignée"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default SupplierProductFormPage;
