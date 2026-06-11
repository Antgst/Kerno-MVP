import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardStatCard from "../../components/shared/DashboardStatCard";
import PageHeader from "../../components/shared/PageHeader";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import LoadingState from "../../components/ui/LoadingState";
import StatusBadge from "../../components/ui/StatusBadge";
import { getCurrentSupplierProfile } from "../../services/supplierService";

function getProfileCompletionLabel(profile) {
  if (!profile) {
    return "Missing";
  }

  const optionalFields = [
    profile.description,
    profile.location,
    profile.businessType,
    profile.contactEmail,
    profile.phone,
    profile.website,
  ];

  const completedFields = optionalFields.filter(Boolean).length;

  if (completedFields >= 4) {
    return "Complete";
  }

  if (completedFields >= 2) {
    return "In progress";
  }

  return "Basic";
}

function SupplierDashboardPage() {
  const [supplierProfile, setSupplierProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadSupplierProfile() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getCurrentSupplierProfile();

        if (shouldUpdateState) {
          setSupplierProfile(response.supplier);
        }
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        if (error.status === 404) {
          setSupplierProfile(null);
          return;
        }

        setErrorMessage(error.message || "Unable to load supplier dashboard.");
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

  const profileCompletionLabel = getProfileCompletionLabel(supplierProfile);

  return (
    <div className="text-slate-950">
      <PageHeader
        eyebrow="Supplier workspace"
        title="Supplier dashboard"
        description="Manage your supplier presence and prepare your product and request workflow."
      >
        <Link to="/supplier/profile">
          <Button variant="secondary">Edit profile</Button>
        </Link>

        <Link to="/supplier/products/new">
          <Button>Add product</Button>
        </Link>
      </PageHeader>

      {isLoading && <LoadingState message="Loading supplier dashboard..." />}

      {errorMessage && (
        <ErrorState
          className="mb-6"
          title="Dashboard unavailable"
          message={errorMessage}
        />
      )}

      {!isLoading && !errorMessage && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <DashboardStatCard
              label="Profile"
              value={profileCompletionLabel}
              trend={supplierProfile ? "Active" : "Missing"}
              helperText={
                supplierProfile
                  ? "Your supplier profile is connected to your account."
                  : "Create your supplier profile to become visible."
              }
            />

            <DashboardStatCard
              label="Products"
              value="Next"
              trend="Issue #43"
              helperText="Product management will be connected in the next supplier issue."
            />

            <DashboardStatCard
              label="Requests"
              value="Soon"
              trend="MVP"
              helperText="Received contact requests will appear here later."
            />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="m-0 text-xl font-black">
                    Supplier profile summary
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    This area shows the public information used for supplier
                    visibility.
                  </p>
                </div>

                <StatusBadge
                  status={supplierProfile ? "ACTIVE" : "PENDING"}
                  label={supplierProfile ? "Profile ready" : "Profile missing"}
                />
              </div>

              {supplierProfile ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Company
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-950">
                      {supplierProfile.companyName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Location
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-950">
                      {supplierProfile.location || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Business type
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-950">
                      {supplierProfile.businessType || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Contact
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-950">
                      {supplierProfile.contactEmail || "Not provided"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Description
                    </p>
                    <p className="mt-1 leading-7 text-slate-600">
                      {supplierProfile.description || "No description yet."}
                    </p>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No supplier profile yet"
                  message="Create your profile so stores can understand who you are and what you provide."
                  action={
                    <Link to="/supplier/profile">
                      <Button>Create supplier profile</Button>
                    </Link>
                  }
                />
              )}
            </Card>

            <div className="grid gap-6">
              <Card>
                <h2 className="m-0 text-xl font-black">Product summary</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Product management is intentionally kept simple for now.
                </p>

                <EmptyState
                  className="mt-5"
                  title="Products are coming next"
                  message="The product list and product creation page will be handled in issue #43."
                  action={
                    <Link to="/supplier/products">
                      <Button variant="secondary">View products placeholder</Button>
                    </Link>
                  }
                />
              </Card>

              <Card>
                <h2 className="m-0 text-xl font-black">Received requests</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Requests from stores will be listed here once the request
                  screens are connected.
                </p>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                  No received requests to display yet.
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SupplierDashboardPage;
