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
import { getSentRequests } from "../../services/requestService";
import { getCurrentStoreProfile } from "../../services/storeService";

function getProfileCompletionLabel(profile) {
  if (!profile) {
    return "Missing";
  }

  const optionalFields = [
    profile.brandName,
    profile.location,
    profile.storeType,
    profile.sourcingNeeds,
    profile.contactEmail,
    profile.phone,
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

function getRequestsFromResponse(response) {
  return response?.requests || response?.contactRequests || [];
}

function StoreDashboardPage() {
  const [storeProfile, setStoreProfile] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let shouldUpdateState = true;

    async function loadStoreDashboard() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const storeResponse = await getCurrentStoreProfile();

        if (!shouldUpdateState) {
          return;
        }

        setStoreProfile(storeResponse.store);

        try {
          const requestsResponse = await getSentRequests();

          if (shouldUpdateState) {
            setSentRequests(getRequestsFromResponse(requestsResponse));
          }
        } catch {
          if (shouldUpdateState) {
            setSentRequests([]);
          }
        }
      } catch (error) {
        if (!shouldUpdateState) {
          return;
        }

        if (error.status === 404) {
          setStoreProfile(null);
          setSentRequests([]);
          return;
        }

        setErrorMessage(error.message || "Unable to load store dashboard.");
      } finally {
        if (shouldUpdateState) {
          setIsLoading(false);
        }
      }
    }

    loadStoreDashboard();

    return () => {
      shouldUpdateState = false;
    };
  }, []);

  const profileCompletionLabel = getProfileCompletionLabel(storeProfile);
  const pendingRequests = sentRequests.filter(
    (request) => request.status === "PENDING",
  );

  return (
    <div className="text-slate-950">
      <PageHeader
        eyebrow="Store workspace"
        title="Store dashboard"
        description="Manage your store profile, browse the catalog and follow your supplier contact requests."
      >
        <Link to="/catalog">
          <Button>Open catalog</Button>
        </Link>

        <Link to="/store/profile">
          <Button variant="secondary">Edit profile</Button>
        </Link>
      </PageHeader>

      {isLoading && <LoadingState message="Loading store dashboard..." />}

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
              trend={storeProfile ? "Active" : "Missing"}
              helperText={
                storeProfile
                  ? "Your store profile is connected to your account."
                  : "Create your store profile to make requests more credible."
              }
            />

            <DashboardStatCard
              label="Sent requests"
              value={sentRequests.length}
              helperText="Contact requests sent to suppliers."
            />

            <DashboardStatCard
              label="Pending"
              value={pendingRequests.length}
              trend="Requests"
              helperText="Requests still waiting for supplier action."
            />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="m-0 text-xl font-black">
                    Store profile summary
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    This information helps suppliers understand your store and
                    your sourcing needs.
                  </p>
                </div>

                <StatusBadge
                  status={storeProfile ? "ACTIVE" : "PENDING"}
                  label={storeProfile ? "Profile ready" : "Profile missing"}
                />
              </div>

              {storeProfile ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Store
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-950">
                      {storeProfile.storeName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Brand
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-950">
                      {storeProfile.brandName || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Location
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-950">
                      {storeProfile.location || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Store type
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-950">
                      {storeProfile.storeType || "Not provided"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Sourcing needs
                    </p>
                    <p className="mt-1 leading-7 text-slate-600">
                      {storeProfile.sourcingNeeds || "No sourcing needs yet."}
                    </p>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No store profile yet"
                  message="Create your profile before contacting suppliers. It helps suppliers understand your business."
                  action={
                    <Link to="/store/profile">
                      <Button>Create store profile</Button>
                    </Link>
                  }
                />
              )}
            </Card>

            <div className="grid gap-6">
              <Card>
                <h2 className="m-0 text-xl font-black">Catalog access</h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Browse suppliers and products before creating contact
                  requests.
                </p>

                <div className="mt-5 rounded-3xl bg-emerald-950 p-6 text-white">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">
                    Marketplace
                  </p>

                  <h3 className="mt-3 text-2xl font-black">
                    Discover supplier products
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-emerald-50">
                    Use the catalog to find products, compare suppliers and
                    prepare your next request.
                  </p>

                  <Link to="/catalog">
                    <Button className="mt-5 bg-white text-emerald-950 hover:bg-stone-100">
                      Open catalog
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card>
                <h2 className="m-0 text-xl font-black">Sent requests</h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your sent contact requests will appear here as the request
                  journey is connected.
                </p>

                {sentRequests.length === 0 ? (
                  <EmptyState
                    className="mt-5"
                    title="No sent requests yet"
                    message="Start from the catalog and contact a supplier when you find a relevant product."
                    action={
                      <Link to="/catalog">
                        <Button variant="secondary">Browse catalog</Button>
                      </Link>
                    }
                  />
                ) : (
                  <div className="mt-5 grid gap-3">
                    {sentRequests.slice(0, 3).map((request) => (
                      <article
                        key={request.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h3 className="m-0 font-black text-slate-950">
                            {request.subject}
                          </h3>

                          <StatusBadge status={request.status} />
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {request.message}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StoreDashboardPage;
