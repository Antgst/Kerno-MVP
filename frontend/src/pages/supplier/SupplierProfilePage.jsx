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
  createSupplierProfile,
  getCurrentSupplierProfile,
  updateCurrentSupplierProfile,
} from "../../services/supplierService";
import { getResource } from "../../utils/responseUtils";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const initialFormData = {
  companyName: "",
  description: "",
  location: "",
  businessType: "",
  contactEmail: "",
  phone: "",
  website: "",
};

function getFormDataFromSupplier(supplier) {
  return {
    companyName: supplier?.companyName || "",
    description: supplier?.description || "",
    location: supplier?.location || "",
    businessType: supplier?.businessType || "",
    contactEmail: supplier?.contactEmail || "",
    phone: supplier?.phone || "",
    website: supplier?.website || "",
  };
}

function SupplierProfilePage() {
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

    async function loadSupplierProfile() {
      setIsLoading(true);
      setLoadErrorMessage("");

      try {
        const response = await getCurrentSupplierProfile();

        if (shouldUpdateState) {
          setFormData(getFormDataFromSupplier(getResource(response, ["supplier"])));
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

        setLoadErrorMessage(error.message || "Unable to load supplier profile.");
      } finally {
        if (shouldUpdateState) {
          setIsLoading(false);
        }
      }
    }

    loadSupplierProfile();

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

    if (!formData.companyName.trim()) {
      errors.companyName = "Company name is required.";
    }

    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      errors.phone = "Enter a valid phone number.";
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
      companyName: formData.companyName,
      description: formData.description,
      location: formData.location,
      businessType: formData.businessType,
      contactEmail: formData.contactEmail,
      phone: formData.phone,
      website: formData.website,
    };

    try {
      const response = hasExistingProfile
        ? await updateCurrentSupplierProfile(payload)
        : await createSupplierProfile(payload);

      setFormData(getFormDataFromSupplier(getResource(response, ["supplier"])));
      setHasExistingProfile(true);
      setSuccessMessage(
        hasExistingProfile
          ? "Supplier profile updated successfully."
          : "Supplier profile created successfully.",
      );
    } catch (error) {
      setSubmitErrorMessage(error.message || "Unable to save supplier profile.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="text-slate-950">
      <PageHeader
        eyebrow="Supplier profile"
        title="Manage your supplier profile"
        description="This information helps stores understand your company, your location and how to contact you."
      >
        <StatusBadge
          status={hasExistingProfile ? "ACTIVE" : "PENDING"}
          label={hasExistingProfile ? "Existing profile" : "New profile"}
        />
      </PageHeader>

      {isLoading && <LoadingState message="Loading supplier profile..." />}

      {loadErrorMessage && (
        <ErrorState
          title="Profile unavailable"
          message={loadErrorMessage}
        />
      )}

      {!isLoading && !loadErrorMessage && (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            {!hasExistingProfile && (
              <EmptyState
                className="mb-6"
                title="Create your supplier profile"
                message="You do not have a supplier profile yet. Fill the form below to create it."
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
                label="Company name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Kerno Roasters"
                error={fieldErrors.companyName}
                required
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
                  placeholder="Describe your company, your products and what makes you different."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Rennes, France"
                />

                <Input
                  label="Business type"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  placeholder="Manufacturer, wholesaler, local producer..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Contact email"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="sales@example.com"
                />

                <div>
                  <label
                    className="mb-2 block text-sm font-bold text-slate-800"
                    htmlFor="phone"
                  >
                    Phone
                  </label>

                  <PhoneInput
                    id="phone"
                    international
                    defaultCountry="FR"
                    value={formData.phone}
                    onChange={(value) => {
                      setFormData((currentData) => ({
                        ...currentData,
                        phone: value || "",
                      }));

                      setFieldErrors((currentErrors) => ({
                        ...currentErrors,
                        phone: "",
                      }));

                      setSubmitErrorMessage("");
                      setSuccessMessage("");
                    }}
                    placeholder="Enter phone number"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                  />

                  {fieldErrors.phone && (
                    <p className="mt-2 text-sm font-semibold text-red-600">
                      {fieldErrors.phone}
                    </p>
                  )}

                  <p className="mt-2 text-xs font-medium text-slate-500">
                    Select a country and enter the phone number.
                  </p>
                </div>
              </div>

              <Input
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />

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
            <h2 className="m-0 text-xl font-black">Profile preview</h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This preview helps you check the information that will be visible
              to stores.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Company
                </p>
                <p className="mt-1 text-2xl font-black text-slate-950">
                  {formData.companyName || "Company name"}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Description
                </p>
                <p className="mt-1 leading-7 text-slate-600">
                  {formData.description || "No description yet."}
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
                    Type
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {formData.businessType || "Not provided"}
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
                  Website
                </p>
                <p className="mt-1 break-all font-bold text-slate-800">
                  {formData.website || "Not provided"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default SupplierProfilePage;
