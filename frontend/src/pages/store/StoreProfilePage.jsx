import { useEffect, useState } from "react";
import PageHeader from "../../components/shared/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Input from "../../components/ui/Input";
import LoadingState from "../../components/ui/LoadingState";
import StatusBadge from "../../components/ui/StatusBadge";
import {
  createStoreProfile,
  getCurrentStoreProfile,
  updateCurrentStoreProfile,
} from "../../services/storeService";

const initialFormData = {
  storeName: "",
  brandName: "",
  location: "",
  storeType: "",
  sourcingNeeds: "",
  contactEmail: "",
  phone: "",
};

function getFormDataFromStore(store) {
  return {
    storeName: store?.storeName || "",
    brandName: store?.brandName || "",
    location: store?.location || "",
    storeType: store?.storeType || "",
    sourcingNeeds: store?.sourcingNeeds || "",
    contactEmail: store?.contactEmail || "",
    phone: store?.phone || "",
  };
}

function StoreProfilePage() {
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadStoreProfile() {
      setIsLoading(true);
      setLoadErrorMessage("");

      try {
        const response = await getCurrentStoreProfile();

        if (shouldUpdateState) {
          setFormData(getFormDataFromStore(response.store));
          setHasExistingProfile(true);
        }
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        if (error.status === 404) {
          setFormData(initialFormData);
          setHasExistingProfile(false);
          return;
        }

        setLoadErrorMessage(error.message || "Unable to load store profile.");
      } finally {
        if (shouldUpdateState) {
          setIsLoading(false);
        }
      }
    }

    loadStoreProfile();

    return () => {
      shouldUpdateState = false;
    };
  }, []);

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
    setSuccessMessage("");
  }

  function validateForm() {
    const errors = {};

    if (!formData.storeName.trim()) {
      errors.storeName = "Store name is required.";
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
    setSuccessMessage("");

    const payload = {
      storeName: formData.storeName,
      brandName: formData.brandName,
      location: formData.location,
      storeType: formData.storeType,
      sourcingNeeds: formData.sourcingNeeds,
      contactEmail: formData.contactEmail,
      phone: formData.phone,
    };

    try {
      const response = hasExistingProfile
        ? await updateCurrentStoreProfile(payload)
        : await createStoreProfile(payload);

      setFormData(getFormDataFromStore(response.store));
      setHasExistingProfile(true);
      setSuccessMessage(
        hasExistingProfile
          ? "Store profile updated successfully."
          : "Store profile created successfully.",
      );
    } catch (error) {
      setSubmitErrorMessage(error.message || "Unable to save store profile.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="text-slate-950">
      <PageHeader
        eyebrow="Store profile"
        title="Manage your store profile"
        description="This information helps suppliers understand your store, your positioning and your sourcing needs."
      >
        <StatusBadge
          status={hasExistingProfile ? "ACTIVE" : "PENDING"}
          label={hasExistingProfile ? "Existing profile" : "New profile"}
        />
      </PageHeader>

      {isLoading && <LoadingState message="Loading store profile..." />}

      {loadErrorMessage && (
        <ErrorState title="Profile unavailable" message={loadErrorMessage} />
      )}

      {!isLoading && !loadErrorMessage && (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            {!hasExistingProfile && (
              <EmptyState
                className="mb-6"
                title="Create your store profile"
                message="You do not have a store profile yet. Fill the form below to create it."
              />
            )}

            {submitErrorMessage && (
              <ErrorState
                className="mb-5"
                title="Profile save failed"
                message={submitErrorMessage}
              />
            )}

            {successMessage && (
              <div className="mb-5 rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-sm font-bold text-emerald-800">
                {successMessage}
              </div>
            )}

            {isSubmitting && (
              <LoadingState className="mb-5" message="Saving profile..." />
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                label="Store name"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="Kerno Market"
                error={fieldErrors.storeName}
                required
              />

              <Input
                label="Brand name"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="Kerno"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Rennes, France"
                />

                <Input
                  label="Store type"
                  name="storeType"
                  value={formData.storeType}
                  onChange={handleChange}
                  placeholder="Concept store, grocery, coffee shop..."
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-bold text-slate-800"
                  htmlFor="sourcingNeeds"
                >
                  Sourcing needs
                </label>

                <textarea
                  id="sourcingNeeds"
                  name="sourcingNeeds"
                  value={formData.sourcingNeeds}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe the products, suppliers or quantities you are looking for."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Contact email"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="buyer@example.com"
                />

                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>

              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : hasExistingProfile
                    ? "Update profile"
                    : "Create profile"}
              </Button>
            </form>
          </Card>

          <Card>
            <h2 className="m-0 text-xl font-black">Store preview</h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This preview helps you check the information that suppliers will
              see when reviewing your requests.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Store
                </p>
                <p className="mt-1 text-2xl font-black text-slate-950">
                  {formData.storeName || "Store name"}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Brand
                </p>
                <p className="mt-1 font-bold text-slate-800">
                  {formData.brandName || "Not provided"}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Location
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {formData.location || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Store type
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {formData.storeType || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Email
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {formData.contactEmail || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Phone
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {formData.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Sourcing needs
                </p>
                <p className="mt-1 leading-7 text-slate-600">
                  {formData.sourcingNeeds || "No sourcing needs yet."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default StoreProfilePage;
