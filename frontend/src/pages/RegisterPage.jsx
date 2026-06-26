import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorState from "../components/ui/ErrorState";
import Input from "../components/ui/Input";
import LoadingState from "../components/ui/LoadingState";
import registerLocalSourcingBanner from "../assets/register/register-local-sourcing-banner.webp";
import { registerUser } from "../services/authService";
import { getDashboardPathByRole } from "../utils/authNavigation";

const registerBenefits = [
  "Un parcours adapté à votre rôle",
  "Un profil professionnel clair et crédible",
  "Des premiers échanges B2B mieux structurés",
];

const roleCards = [
  {
    value: "STORE",
    title: "Magasin",
    description: "Je veux trouver des fournisseurs et des produits fiables.",
  },
  {
    value: "SUPPLIER",
    title: "Fournisseur",
    description: "Je veux présenter mes produits et recevoir des demandes qualifiées.",
  },
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

  function handleRoleSelect(role) {
    setFormData((currentData) => ({
      ...currentData,
      role,
    }));

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      role: "",
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
    <div className="register-public-page">
      <main className="auth-page register-page" data-testid="register-page">
      <section className="register-shell">
        <aside className="register-editorial" aria-labelledby="register-title">
          <h1 id="register-title">Créez votre espace KERNO</h1>
          <p>
            Créez votre accès professionnel pour sourcer des fournisseurs, présenter vos produits et structurer vos premiers échanges B2B.
          </p>

          <figure className="register-visual">
            <img
              src={registerLocalSourcingBanner}
              alt="Produits locaux présentés dans un espace professionnel KERNO"
            />
          </figure>

          <ul className="register-benefits" aria-label="Bénéfices KERNO">
            {registerBenefits.map((benefit) => (
              <li key={benefit}>
                <span aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </aside>

        <section className="register-card" aria-labelledby="register-form-title">
          <div className="register-card__header">
            <h2 id="register-form-title">Inscription</h2>
            <p>Choisissez votre rôle et créez votre accès professionnel.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {submitError && (
              <ErrorState
                title="Échec de création du compte"
                message={submitError}
              />
            )}

            {isSubmitting && <LoadingState message="Création du compte..." />}

            <div className="register-role-group">
              <div className="register-role-group__label">
                <span>Type de compte</span>
                <strong aria-hidden="true">*</strong>
              </div>

              <div
                className="register-role-grid"
                role="radiogroup"
                aria-label="Type de compte"
                aria-describedby={
                  fieldErrors.role ? "register-role-error" : undefined
                }
              >
                {roleCards.map((role) => (
                  <button
                    type="button"
                    key={role.value}
                    className={[
                      "register-role-card",
                      formData.role === role.value
                        ? "register-role-card--selected"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    role="radio"
                    aria-checked={formData.role === role.value}
                    onClick={() => handleRoleSelect(role.value)}
                  >
                    <span className="register-role-card__indicator" />
                    <span className="register-role-card__content">
                      <strong>{role.title}</strong>
                      <small>{role.description}</small>
                    </span>
                  </button>
                ))}
              </div>

              {fieldErrors.role && (
                <p id="register-role-error" className="register-field-error">
                  {fieldErrors.role}
                </p>
              )}
            </div>

            <div className="auth-form__row">
              <Input
                label="Prénom"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Votre prénom"
                error={fieldErrors.firstName}
                required
              />

              <Input
                label="Nom"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Votre nom"
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
              helperText="8 caractères minimum."
              required
            />

            <button
              className="auth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Création..." : "Créer mon compte"}
            </button>

            <p className="register-login-link">
              Déjà un compte ? <Link to="/login">Se connecter</Link>
            </p>
            <p className="register-required-note">Champs obligatoires indiqués par *.</p>
          </form>
        </section>
      </section>
      </main>
    </div>
  );
}

export default RegisterPage;
