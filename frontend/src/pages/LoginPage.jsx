import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/shared/PageHeader";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ErrorState from "../components/ui/ErrorState";
import Input from "../components/ui/Input";
import LoadingState from "../components/ui/LoadingState";
import { loginUser } from "../services/authService";
import { getDashboardPathByRole } from "../utils/authNavigation";

const initialFormData = {
  email: "",
  password: "",
};

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
      errors.email = "Email is required.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
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
        email: formData.email,
        password: formData.password,
      });

      const dashboardPath = getDashboardPathByRole(response?.user?.role);

      navigate(dashboardPath);
    } catch (error) {
      setSubmitError(error.message || "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          eyebrow="KERNO access"
          title="Sign in to your workspace"
          description="Access your supplier or store dashboard with your Kerno account."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {submitError && (
                <ErrorState
                  title="Sign-in failed"
                  message={submitError}
                />
              )}

              {isSubmitting && <LoadingState message="Signing you in..." />}

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={fieldErrors.email}
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
                error={fieldErrors.password}
                required
              />

              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Card>

          <aside className="flex flex-col justify-center rounded-3xl border border-emerald-900 bg-emerald-950 p-6 text-white shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">
              New on Kerno?
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Create a supplier or store account.
            </h2>

            <p className="mt-4 leading-7 text-emerald-50">
              Suppliers can manage products and requests. Stores can explore
              products and contact suppliers.
            </p>

            <Link
              className="mt-6 inline-flex w-fit rounded-full bg-white px-5 py-3 text-sm font-black text-emerald-950 hover:bg-stone-100"
              to="/register"
            >
              Create an account
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
