import { useEffect, useMemo, useState } from "react";
import ErrorState from "../../components/ui/ErrorState";
import Input from "../../components/ui/Input";
import LoadingState from "../../components/ui/LoadingState";
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

const profileFieldNames = Object.keys(initialFormData);

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

function SupplierProfileIcon({ name }) {
  const commonProps = {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  if (name === "company") {
    return (
      <svg {...commonProps}>
        <path d="M4 21h16" />
        <path d="M6 21V7l6-3v17" />
        <path d="M12 9h6v12" />
        <path d="M8.5 9.5h1" />
        <path d="M8.5 13h1" />
        <path d="M8.5 16.5h1" />
        <path d="M14.5 12h1" />
        <path d="M14.5 15.5h1" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
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

        setLoadErrorMessage(
          error.message || "Impossible de charger le profil fournisseur.",
        );
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

  const completionPercent = useMemo(() => {
    const completedFields = profileFieldNames.filter((fieldName) =>
      String(formData[fieldName] || "").trim(),
    ).length;

    return Math.round((completedFields / profileFieldNames.length) * 100);
  }, [formData]);

  function clearFeedback(fieldName) {
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: "",
    }));
    setSubmitErrorMessage("");
    setSuccessMessage("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
    clearFeedback(name);
  }

  function validateForm() {
    const errors = {};

    if (!formData.companyName.trim()) {
      errors.companyName = "Le nom de l’entreprise est obligatoire.";
    }

    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      errors.phone = "Saisissez un numéro de téléphone valide.";
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
          ? "Les modifications ont bien été enregistrées."
          : "Votre profil fournisseur a bien été créé.",
      );
    } catch (error) {
      setSubmitErrorMessage(
        error.message || "Impossible d’enregistrer le profil fournisseur.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const fallback = "Non renseigné";

  return (
    <div className="supplier-profile-page">
      <header className="supplier-profile-page__intro">
        <div>
          <p className="supplier-profile-page__eyebrow">Espace fournisseur</p>
          <h1>Profil fournisseur</h1>
          <p className="supplier-profile-page__subtitle">
            Complétez les informations visibles par les magasins lorsqu’ils
            découvrent votre activité ou vos produits.
          </p>
        </div>
      </header>

      {isLoading && (
        <LoadingState
          className="supplier-profile-page__loading"
          message="Chargement du profil fournisseur..."
        />
      )}

      {loadErrorMessage && (
        <ErrorState title="Profil indisponible" message={loadErrorMessage} />
      )}

      {!isLoading && !loadErrorMessage && (
        <div className="supplier-profile-page__layout">
          <section
            className="supplier-profile-page__card supplier-profile-page__form-card"
            aria-labelledby="supplier-profile-form-title"
          >
            <div className="supplier-profile-page__card-header">
              <div>
                <p className="supplier-profile-page__card-eyebrow">
                  Votre entreprise
                </p>
                <h2 id="supplier-profile-form-title">
                  Informations du fournisseur
                </h2>
                <p>
                  Renseignez les éléments essentiels pour renforcer la
                  crédibilité de votre profil auprès des magasins.
                </p>
              </div>

              <span className="supplier-profile-page__header-icon">
                <SupplierProfileIcon name="company" />
              </span>
            </div>

            {submitErrorMessage && (
              <ErrorState
                className="supplier-profile-page__feedback"
                title="Échec de l’enregistrement"
                message={submitErrorMessage}
              />
            )}

            {successMessage && (
              <div
                className="supplier-profile-page__success"
                role="status"
                aria-live="polite"
              >
                <SupplierProfileIcon name="check" />
                <span>{successMessage}</span>
              </div>
            )}

            {isSubmitting && (
              <LoadingState
                className="supplier-profile-page__feedback"
                message="Enregistrement du profil..."
              />
            )}

            <form className="supplier-profile-form" onSubmit={handleSubmit}>
              <Input
                label="Nom de l’entreprise"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Maison KERNO"
                error={fieldErrors.companyName}
                required
              />

              <div className="supplier-profile-form__field">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Présentez votre entreprise, vos produits et ce qui vous distingue."
                />
              </div>

              <div className="supplier-profile-form__row">
                <Input
                  label="Localisation"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Rennes, France"
                />

                <Input
                  label="Type d’activité"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  placeholder="Producteur, fabricant, grossiste..."
                />
              </div>

              <div className="supplier-profile-form__row">
                <Input
                  label="Email professionnel"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="contact@exemple.fr"
                />

                <div className="supplier-profile-form__field">
                  <label htmlFor="phone">Téléphone</label>
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
                      clearFeedback("phone");
                    }}
                    placeholder="Saisissez votre numéro"
                    className={[
                      "supplier-profile-phone",
                      fieldErrors.phone ? "supplier-profile-phone--error" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />

                  {fieldErrors.phone && (
                    <p className="supplier-profile-form__error">
                      {fieldErrors.phone}
                    </p>
                  )}

                  <p className="supplier-profile-form__helper">
                    Sélectionnez un pays puis saisissez le numéro.
                  </p>
                </div>
              </div>

              <Input
                label="Site web"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://exemple.fr"
              />

              <button
                className="supplier-profile-form__submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Enregistrement..."
                  : hasExistingProfile
                    ? "Enregistrer les modifications"
                    : "Créer le profil"}
              </button>
            </form>
          </section>

          <aside className="supplier-profile-page__side">
            <section
              className="supplier-profile-page__card supplier-profile-preview"
              aria-labelledby="supplier-profile-preview-title"
            >
              <div className="supplier-profile-page__card-header">
                <div>
                  <p className="supplier-profile-page__card-eyebrow">
                    Vue magasin
                  </p>
                  <h2 id="supplier-profile-preview-title">
                    Aperçu côté magasin
                  </h2>
                  <p>
                    Voici les informations visibles lorsqu’un magasin découvre
                    votre profil fournisseur.
                  </p>
                </div>
              </div>

              <div className="supplier-profile-preview__identity">
                <span className="supplier-profile-preview__mark">
                  <SupplierProfileIcon name="company" />
                </span>
                <div>
                  <small>Fournisseur</small>
                  <strong>{formData.companyName || fallback}</strong>
                  <span>{formData.businessType || fallback}</span>
                </div>
              </div>

              <dl className="supplier-profile-preview__details">
                <div>
                  <dt>Localisation</dt>
                  <dd>{formData.location || fallback}</dd>
                </div>
                <div>
                  <dt>Type d’activité</dt>
                  <dd>{formData.businessType || fallback}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{formData.contactEmail || fallback}</dd>
                </div>
                <div>
                  <dt>Téléphone</dt>
                  <dd>{formData.phone || fallback}</dd>
                </div>
              </dl>

              <div className="supplier-profile-preview__section">
                <small>Description</small>
                <p>
                  {formData.description || "Aucune description renseignée"}
                </p>
              </div>

              <div className="supplier-profile-preview__section">
                <small>Site web</small>
                <p className="supplier-profile-preview__website">
                  {formData.website || "Aucun site web renseigné"}
                </p>
              </div>
            </section>

            <section className="supplier-profile-completion">
              <div className="supplier-profile-completion__content">
                <div>
                  <p>Profil fournisseur</p>
                  <h2>Complétez votre profil</h2>
                  <span>
                    Un profil clair renforce votre visibilité auprès des
                    magasins.
                  </span>
                </div>

                <div
                  className="supplier-profile-completion__gauge"
                  style={{ "--progress": completionPercent }}
                  aria-label={`Profil complété à ${completionPercent}%`}
                >
                  <strong>{completionPercent}%</strong>
                </div>
              </div>

              <div className="supplier-profile-completion__progress">
                <span style={{ width: `${completionPercent}%` }} />
              </div>
              <small>{completionPercent} % des informations renseignées</small>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}

export default SupplierProfilePage;
