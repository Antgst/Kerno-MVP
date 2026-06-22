import { useEffect, useMemo, useState } from "react";
import ErrorState from "../../components/ui/ErrorState";
import Input from "../../components/ui/Input";
import LoadingState from "../../components/ui/LoadingState";
import {
  createStoreProfile,
  getCurrentStoreProfile,
  updateCurrentStoreProfile,
} from "../../services/storeService";
import { getResource } from "../../utils/responseUtils";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import LocationSelect from "../../components/shared/LocationSelect";

const initialFormData = {
  storeName: "",
  brandName: "",
  location: "",
  storeType: "",
  sourcingNeeds: "",
  contactEmail: "",
  phone: "",
};

const profileFieldNames = Object.keys(initialFormData);

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

function StoreProfileIcon({ name }) {
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

  if (name === "store") {
    return (
      <svg {...commonProps}>
        <path d="M4 10h16" />
        <path d="M5 10l1.2-5h11.6L19 10" />
        <path d="M6 10v9h12v-9" />
        <path d="M9 19v-5h6v5" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
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
          setFormData(getFormDataFromStore(getResource(response, ["store"])));
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
          error.message || "Impossible de charger le profil magasin.",
        );
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

    if (!formData.storeName.trim()) {
      errors.storeName = "Le nom du magasin est obligatoire.";
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

      setFormData(getFormDataFromStore(getResource(response, ["store"])));
      setHasExistingProfile(true);
      setSuccessMessage(
        hasExistingProfile
          ? "Les modifications ont bien été enregistrées."
          : "Votre profil magasin a bien été créé.",
      );
    } catch (error) {
      setSubmitErrorMessage(
        error.message || "Impossible d’enregistrer le profil magasin.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const fallback = "Non renseigné";

  return (
    <div className="store-profile-page">
      <header className="store-profile-page__intro">
        <div>
          <h1>Profil magasin</h1>
          <p className="store-profile-page__subtitle">
            {completionPercent === 100
              ? "Gérez les informations visibles par les fournisseurs lorsqu’ils consultent vos demandes."
              : "Ajoutez les informations manquantes pour renforcer votre crédibilité."}
          </p>
        </div>
      </header>

      {isLoading && (
        <LoadingState
          className="store-profile-page__loading"
          message="Chargement du profil magasin..."
        />
      )}

      {loadErrorMessage && (
        <ErrorState
          title="Profil indisponible"
          message={loadErrorMessage}
        />
      )}

      {!isLoading && !loadErrorMessage && (
        <div className="store-profile-page__layout">
          <section
            className="store-profile-page__card store-profile-page__form-card"
            aria-labelledby="store-profile-form-title"
          >
            <div className="store-profile-page__card-header">
              <div>
                <h2 id="store-profile-form-title">
                  Informations du magasin
                </h2>
                <p>
                  Renseignez les éléments essentiels pour rendre vos futures
                  demandes plus crédibles.
                </p>
              </div>

              <span className="store-profile-page__header-icon">
                <StoreProfileIcon name="store" />
              </span>
            </div>

            {submitErrorMessage && (
              <ErrorState
                className="store-profile-page__feedback"
                title="Échec de l’enregistrement"
                message={submitErrorMessage}
              />
            )}

            {successMessage && (
              <div
                className="store-profile-page__success"
                role="status"
                aria-live="polite"
              >
                <StoreProfileIcon name="check" />
                <span>{successMessage}</span>
              </div>
            )}

            {isSubmitting && (
              <LoadingState
                className="store-profile-page__feedback"
                message="Enregistrement du profil..."
              />
            )}

            <form className="store-profile-form" onSubmit={handleSubmit}>
              <Input
                label="Nom du magasin"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="Marché KERNO"
                error={fieldErrors.storeName}
                required
              />

              <Input
                label="Enseigne"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="KERNO"
              />

              <div className="store-profile-form__row">
                <LocationSelect
                  value={formData.location}
                  onChange={handleChange}
                />

                <Input
                  label="Type de magasin"
                  name="storeType"
                  value={formData.storeType}
                  onChange={handleChange}
                  placeholder="Épicerie, concept store, café..."
                />
              </div>

              <div className="store-profile-form__field">
                <label htmlFor="sourcingNeeds">Besoins de sourcing</label>
                <textarea
                  id="sourcingNeeds"
                  name="sourcingNeeds"
                  value={formData.sourcingNeeds}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Décrivez les produits, fournisseurs ou quantités que vous recherchez."
                />
              </div>

              <div className="store-profile-form__row">
                <Input
                  label="Email professionnel"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="acheteur@exemple.fr"
                />

                <div className="store-profile-form__field">
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
                      "store-profile-phone",
                      fieldErrors.phone ? "store-profile-phone--error" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />

                  {fieldErrors.phone && (
                    <p className="store-profile-form__error">
                      {fieldErrors.phone}
                    </p>
                  )}

                  <p className="store-profile-form__helper">
                    Sélectionnez un pays puis saisissez le numéro.
                  </p>
                </div>
              </div>

              <button
                className="store-profile-form__submit"
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

          <aside className="store-profile-page__side">
            <section
              className="store-profile-page__card store-profile-preview"
              aria-labelledby="store-profile-preview-title"
            >
              <div className="store-profile-page__card-header">
                <div>
                  <h2 id="store-profile-preview-title">
                    Aperçu côté fournisseur
                  </h2>
                  <p>
                    Voici les informations visibles lorsqu’un fournisseur
                    consulte votre demande.
                  </p>
                </div>
              </div>

              <div className="store-profile-preview__identity">
                <span className="store-profile-preview__mark">
                  <StoreProfileIcon name="store" />
                </span>
                <div>
                  <small>Magasin</small>
                  <strong>{formData.storeName || fallback}</strong>
                  <span>{formData.brandName || fallback}</span>
                </div>
              </div>

              <dl className="store-profile-preview__details">
                <div>
                  <dt>Localisation</dt>
                  <dd>{formData.location || fallback}</dd>
                </div>
                <div>
                  <dt>Type de magasin</dt>
                  <dd>{formData.storeType || fallback}</dd>
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

              <div className="store-profile-preview__needs">
                <small>Besoins de sourcing</small>
                <p>
                  {formData.sourcingNeeds ||
                    "Aucun besoin de sourcing renseigné"}
                </p>
              </div>
            </section>

            <section className="store-profile-completion">
              <div className="store-profile-completion__content">
                <div>
                  <p>Profil magasin</p>
                  <h2>
                    {completionPercent === 100
                      ? "Profil complet"
                      : "Complétez votre profil"}
                  </h2>
                  <span>
                    {completionPercent === 100
                      ? "Gérez les informations visibles par les fournisseurs lorsqu’ils consultent vos demandes."
                      : "Ajoutez les informations manquantes pour renforcer votre crédibilité."}
                  </span>
                </div>

                <div
                  className="store-profile-completion__gauge"
                  style={{ "--progress": completionPercent }}
                  aria-label={`Profil complété à ${completionPercent}%`}
                >
                  <strong>{completionPercent}%</strong>
                </div>
              </div>

              <div className="store-profile-completion__progress">
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

export default StoreProfilePage;
