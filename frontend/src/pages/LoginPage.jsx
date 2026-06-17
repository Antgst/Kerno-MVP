import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorState from "../components/ui/ErrorState";
import Input from "../components/ui/Input";
import LoadingState from "../components/ui/LoadingState";
import { loginUser } from "../services/authService";
import { getDashboardPathByRole } from "../utils/authNavigation";

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
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-intro">
          <p className="marketing-eyebrow">KERNO ACCESS</p>
          <h1>Connectez-vous à votre espace.</h1>
          <p>
            Retrouvez votre tableau de bord fournisseur ou magasin, vos profils,
            vos produits et vos demandes de contact.
          </p>
        </div>

        <div className="auth-grid">
          <section className="auth-card">
            <div className="auth-card__header">
              <h2>Connexion</h2>
              <p>Utilisez les identifiants de votre compte Kerno.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {submitError && (
                <ErrorState title="Échec de connexion" message={submitError} />
              )}

              {isSubmitting && <LoadingState message="Connexion en cours..." />}

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
            </form>
          </section>

          <aside className="auth-panel">
            <div>
              <p className="auth-panel__eyebrow">NOUVEAU SUR KERNO ?</p>
              <h2>Créez un compte fournisseur ou magasin.</h2>
              <p>
                Les fournisseurs gèrent leurs produits. Les magasins explorent
                le catalogue et contactent les fournisseurs.
              </p>
            </div>

            <div className="auth-panel__features">
              <span>Profil</span>
              <span>Catalogue</span>
              <span>Demandes</span>
            </div>

            <Link className="auth-panel__button" to="/register">
              Créer un compte
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
