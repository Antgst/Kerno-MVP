import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/shared/PageHeader";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ErrorState from "../components/ui/ErrorState";
import Input from "../components/ui/Input";
import LoadingState from "../components/ui/LoadingState";
import Select from "../components/ui/Select";
import { registerUser } from "../services/authService";
import { getDashboardPathByRole } from "../utils/authNavigation";

const roleOptions = [
  { value: "SUPPLIER", label: "Supplier" },
  { value: "STORE", label: "Store" },
];

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "",
};

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
      errors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    }

    if (formData.password && formData.password.length < 8) {
      errors.password = "Password must contain at least 8 characters.";
    }

    if (!formData.role) {
      errors.role = "Role is required.";
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
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      const dashboardPath = getDashboardPathByRole(response?.user?.role);

      navigate(dashboardPath);
    } catch (error) {
      setSubmitError(error.message || "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          eyebrow="KERNO onboarding"
          title="Create your Kerno account"
          description="Choose the role that matches your journey: supplier or store."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {submitError && (
                <ErrorState
                  title="Account creation failed"
                  message={submitError}
                />
              )}

              {isSubmitting && <LoadingState message="Creating your account..." />}

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="First name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ada"
                  error={fieldErrors.firstName}
                  required
                />

                <Input
                  label="Last name"
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
                placeholder="At least 8 characters"
                error={fieldErrors.password}
                helperText="Use at least 8 characters."
                required
              />

              <Select
                label="Account role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions}
                placeholder="Choose your role"
                error={fieldErrors.role}
                helperText="Suppliers manage products. Stores contact suppliers."
                required
              />

              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Card>

          <aside className="flex flex-col justify-center rounded-3xl border border-emerald-900 bg-emerald-950 p-6 text-white shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">
              Already registered?
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Sign in and continue your journey.
            </h2>

            <p className="mt-4 leading-7 text-emerald-50">
              After signing in, suppliers are sent to the supplier dashboard and
              stores are sent to the store dashboard.
            </p>

            <Link
              className="mt-6 inline-flex w-fit rounded-full bg-white px-5 py-3 text-sm font-black text-emerald-950 hover:bg-stone-100"
              to="/login"
            >
              Sign in
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
