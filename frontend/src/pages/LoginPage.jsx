import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorState from "../components/ui/ErrorState";
import Input from "../components/ui/Input";
import LoadingState from "../components/ui/LoadingState";
import registerLocalSourcingBanner from "../assets/register/register-local-sourcing-banner.webp";
import { loginUser } from "../services/authService";
import { getDashboardPathByRole } from "../utils/authNavigation";

const loginBenefits = [
  "Un accès rapide à votre tableau de bord",
  "Vos demandes et profils centralisés",
  "Un parcours adapté à votre rôle",
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
    <main className="auth-page register-page">
      <section className="register-shell">
        <aside className="register-editorial" aria-labelledby="login-title">
          <p className="register-eyebrow">CONNEXION</p>
          <h1 id="login-title">Retrouvez votre espace KERNO</h1>
          <p>
            Accédez à vos demandes, vos profils et vos premiers échanges
            commerciaux dans un environnement clair et professionnel.
          </p>

          <figure className="register-visual">
            <img
              src={registerLocalSourcingBanner}
              alt="Produits locaux présentés dans un espace professionnel KERNO"
            />
          </figure>

          <ul className="register-benefits" aria-label="Bénéfices KERNO">
            {loginBenefits.map((benefit) => (
              <li key={benefit}>
                <span aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </aside>

        <section className="register-card" aria-labelledby="login-form-title">
          <div className="register-card__header">
            <p className="register-card__eyebrow">Espace professionnel</p>
            <h2 id="login-form-title">Se connecter</h2>
            <p>Renseignez vos identifiants pour accéder à votre espace.</p>
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

            <p className="register-login-link">
              Pas encore de compte ? <Link to="/register">Créer un compte</Link>
            </p>
          </form>
        </section>
      </section>
    </main>
  );
}

export default LoginPage;
