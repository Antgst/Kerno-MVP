import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorState from "../components/ui/ErrorState";
import Input from "../components/ui/Input";
import LoadingState from "../components/ui/LoadingState";
import registerLocalSourcingBanner from "../assets/register/register-local-sourcing-banner.webp";
import { loginUser } from "../services/authService";
import { getDashboardPathByRole } from "../utils/authNavigation";

const loginBenefits = [
  "Demandes B2B centralisées",
  "Profils magasin et fournisseur à jour",
  "Accès sécurisé à votre espace professionnel",
];

const initialFormData = {
  email: "",
  password: "",
};

function getRoleFromResponse(response) {
  return (
    response?.user?.role ||
    response?.role ||
    response?.account?.role ||
    response?.data?.user?.role ||
    response?.data?.role ||
    response?.data?.account?.role ||
    null
  );
}

function LoginPage() {
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

    if (!formData.email.trim()) {
      errors.email = "L'email est obligatoire.";
    }

    if (!formData.password) {
      errors.password = "Le mot de passe est obligatoire.";
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
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      const role = getRoleFromResponse(response);
      const dashboardPath = getDashboardPathByRole(role);

      navigate(dashboardPath);
    } catch (error) {
      setSubmitError(error.message || "Connexion impossible.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-public-page">
      <main className="auth-page login-page" data-testid="login-page">
      <section className="login-shell">
        <aside className="login-editorial" aria-labelledby="login-title">
          <h1 id="login-title">Accédez à votre espace KERNO</h1>
          <p>Retrouvez vos demandes, vos profils et vos échanges B2B dans un espace clair, sécurisé et conçu pour les magasins comme les fournisseurs.</p>

          <figure className="login-visual">
            <img
              src={registerLocalSourcingBanner}
              alt="Produits locaux présentés dans un espace professionnel KERNO"
            />
          </figure>

          <ul className="login-benefits" aria-label="Bénéfices KERNO">
            {loginBenefits.map((benefit) => (
              <li key={benefit}>
                <span aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </aside>

        <section className="login-card" aria-labelledby="login-form-title">
          <div className="login-card__header">
            <h2 id="login-form-title">Connexion</h2>
            <p>Connectez-vous pour reprendre vos échanges et gérer votre activité KERNO.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {submitError && (
              <ErrorState title="Échec de connexion" message={submitError} />
            )}

            {isSubmitting && <LoadingState message="Connexion en cours..." />}

            <Input
              label="Email professionnel"
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
              placeholder="Votre mot de passe"
              error={fieldErrors.password}
              required
            />

            <button
              className="auth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </button>

            <p className="login-register-link">
              Pas encore de compte ? <Link to="/register">Créer un compte</Link>
            </p>
            <p className="login-required-note">Champs obligatoires indiqués par *.</p>
          </form>
        </section>
      </section>
      </main>
    </div>
  );
}

export default LoginPage;
