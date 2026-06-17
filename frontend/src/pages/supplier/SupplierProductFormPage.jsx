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

        setLoadErrorMessage(error.message || "Unable to load product form.");
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
      errors.name = "Product name is required.";
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
      setSubmitErrorMessage(error.message || "Unable to save product.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="text-slate-950">
      <PageHeader
        eyebrow="Supplier products"
        title={isEditMode ? "Edit product" : "Add a product"}
        description={
          isEditMode
            ? "Update the product information visible in the Kerno catalog."
            : "Create a structured product offer for stores browsing the Kerno catalog."
        }
      >
        <Link to="/supplier/products">
          <Button variant="secondary">Back to products</Button>
        </Link>
      </PageHeader>

      {isLoading && <LoadingState message="Loading product form..." />}

      {loadErrorMessage && (
        <ErrorState
          title="Product form unavailable"
          message={loadErrorMessage}
        />
      )}

      {!isLoading && !loadErrorMessage && !hasSupplierProfile && (
        <EmptyState
          title="Supplier profile required"
          message="You need a supplier profile before creating products."
          action={
            <Link to="/supplier/profile">
              <Button>Create supplier profile</Button>
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
                title="Product save failed"
                message={submitErrorMessage}
              />
            )}

            {isSubmitting && (
              <LoadingState className="mb-5" message="Saving product..." />
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                label="Product name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Single-origin coffee beans"
                error={fieldErrors.name}
                required
              />

              <Select
                label="Category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                options={categoryOptions}
                placeholder={
                  categoryOptions.length > 0
                    ? "Choose a category"
                    : "No category available"
                }
                helperText="Optional for now. Categories can be managed from the backend/admin side."
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
                  placeholder="Describe the product, its quality, usage or production details."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Origin or location"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  placeholder="Colombia, France, Brittany..."
                />

                <Input
                  label="Indicative price"
                  name="priceInfo"
                  value={formData.priceInfo}
                  onChange={handleChange}
                  placeholder="12 EUR / kg, on request..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Minimum order"
                  name="minimumOrder"
                  value={formData.minimumOrder}
                  onChange={handleChange}
                  placeholder="10 kg, 24 units..."
                />

                <Input
                  label="Image URL"
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
                Product active in catalog
              </label>

              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                    ? "Update product"
                    : "Create product"}
              </Button>
            </form>
          </Card>

          <Card>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="m-0 text-xl font-black">Product preview</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This is a simple preview of how the product information may
                  appear later in the catalog.
                </p>
              </div>

              <StatusBadge
                status={formData.isActive ? "ACTIVE" : "INACTIVE"}
                label={formData.isActive ? "Active preview" : "Inactive preview"}
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="m-0 text-2xl font-black text-slate-950">
                {formData.name || "Product name"}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {formData.description || "No description yet."}
              </p>

              <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                    Category
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {categories.find(
                      (category) => category.id === formData.categoryId,
                    )?.name || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                    Origin
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {formData.origin || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                    Price
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {formData.priceInfo || "On request"}
                  </p>
                </div>

                <div>
                  <p className="font-black uppercase tracking-[0.16em] text-slate-400">
                    Minimum order
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {formData.minimumOrder || "Not provided"}
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
