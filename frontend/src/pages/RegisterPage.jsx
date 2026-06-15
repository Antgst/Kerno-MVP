import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorState from "../components/ui/ErrorState";
import Input from "../components/ui/Input";
import LoadingState from "../components/ui/LoadingState";
import Select from "../components/ui/Select";
import { registerUser } from "../services/authService";
import { getDashboardPathByRole } from "../utils/authNavigation";

const roleOptions = [
  { value: "SUPPLIER", label: "Fournisseur" },
  { value: "STORE", label: "Magasin" },
];

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "",
};

function getRoleFromResponse(response, fallbackRole) {
  return (
    response?.user?.role ||
    response?.role ||
    response?.account?.role ||
    response?.data?.user?.role ||
    response?.data?.role ||
    response?.data?.account?.role ||
    fallbackRole
  );
}

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setSubmitError("");
  }

  function validateForm() {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "Le prénom est obligatoire.";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Le nom est obligatoire.";
    }

    if (!formData.email.trim()) {
      errors.email = "L'email est obligatoire.";
    }

    if (!formData.password) {
      errors.password = "Le mot de passe est obligatoire.";
    }

    if (formData.password && formData.password.length < 8) {
      errors.password = "Le mot de passe doit contenir au moins 8 caractères.";
    }

    if (!formData.role) {
      errors.role = "Le rôle est obligatoire.";
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
    setSubmitError("");

    try {
      const response = await registerUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      const role = getRoleFromResponse(response, formData.role);
      const dashboardPath = getDashboardPathByRole(role);

      navigate(dashboardPath);
    } catch (error) {
      setSubmitError(error.message || "Création du compte impossible.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-intro">
          <p className="marketing-eyebrow">KERNO ONBOARDING</p>
          <h1>Créez votre compte Kerno.</h1>
          <p>
            Choisissez le rôle qui correspond à votre usage : fournisseur pour
            gérer vos produits, magasin pour rechercher et contacter.
          </p>
        </div>

        <div className="auth-grid auth-grid--register">
          <section className="auth-card">
            <div className="auth-card__header">
              <h2>Inscription</h2>
              <p>Quelques informations suffisent pour démarrer le MVP.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {submitError && (
                <ErrorState
                  title="Échec de création du compte"
                  message={submitError}
                />
              )}

              {isSubmitting && <LoadingState message="Création du compte..." />}

              <div className="auth-form__row">
                <Input
                  label="Prénom"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ada"
                  error={fieldErrors.firstName}
                  required
                />

                <Input
                  label="Nom"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Lovelace"
                  error={fieldErrors.lastName}
                  required
                />
              </div>

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="vous@example.com"
                error={fieldErrors.email}
                required
              />

              <Input
                label="Mot de passe"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Au moins 8 caractères"
                error={fieldErrors.password}
                helperText="Utilisez au moins 8 caractères."
                required
              />

              <Select
                label="Type de compte"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions}
                placeholder="Choisir un rôle"
                error={fieldErrors.role}
                helperText="Fournisseur : produits. Magasin : catalogue et demandes."
                required
              />

              <button
                className="auth-submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Création..." : "Créer le compte"}
              </button>
            </form>
          </section>

          <aside className="auth-panel auth-panel--orange">
            <div>
              <p className="auth-panel__eyebrow">DÉJÀ INSCRIT ?</p>
              <h2>Connectez-vous et reprenez votre parcours.</h2>
              <p>
                Après connexion, les fournisseurs arrivent sur leur dashboard et
                les magasins sur leur espace de sourcing.
              </p>
            </div>

            <div className="auth-panel__features">
              <span>Dashboard</span>
              <span>Profil</span>
              <span>Suivi</span>
            </div>

            <Link className="auth-panel__button" to="/login">
              Se connecter
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;
