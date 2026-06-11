import { Link, useParams } from "react-router-dom";
import DashboardStatCard from "../components/shared/DashboardStatCard";
import PageHeader from "../components/shared/PageHeader";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import StatusBadge from "../components/ui/StatusBadge";

const accessMessages = {
  public: "Public page.",
  auth: "Protected page for authenticated users.",
  supplier: "Protected page for supplier users.",
  store: "Protected page for store users.",
};

const roleOptions = [
  { value: "SUPPLIER", label: "Supplier" },
  { value: "STORE", label: "Store" },
];

function PlaceholderPage({ route }) {
  const params = useParams();
  const hasParams = Object.keys(params).length > 0;

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="KERNO MVP route"
          title={route.label}
          description="This placeholder now uses the shared UI components required by issue #39. It keeps the MVP pages consistent while the real screens are being built."
        >
          <Link className="font-black text-emerald-900 hover:underline" to="/">
            Back to route map
          </Link>
        </PageHeader>

        <div className="grid gap-4 md:grid-cols-3">
          <DashboardStatCard
            label="Path"
            value={route.path}
            helperText="Current route pattern"
          />

          <DashboardStatCard
            label="Access"
            value={route.access}
            helperText="Expected access level"
          />

          <DashboardStatCard
            label="Status"
            value="Ready"
            trend="UI"
            helperText={accessMessages[route.access]}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="m-0 text-xl font-black">
                  Shared component preview
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Buttons, form fields, cards and badges can now be reused
                  across the supplier, store, catalog and request pages.
                </p>
              </div>

              <StatusBadge status={route.access === "public" ? "ACTIVE" : "PENDING"} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Example field"
                name="exampleField"
                placeholder="Reusable input"
                helperText="Used for login, profile, product and request forms."
              />

              <Select
                label="Example role"
                name="exampleRole"
                options={roleOptions}
                placeholder="Choose a role"
                helperText="Reusable select with simple options."
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary action</Button>
              <Button variant="ghost">Ghost action</Button>
            </div>
          </Card>

          <Card>
            {hasParams ? (
              <div>
                <h2 className="m-0 text-xl font-black">Route parameters</h2>

                <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-white">
                  {JSON.stringify(params, null, 2)}
                </pre>
              </div>
            ) : (
              <EmptyState
                title="No route parameters"
                message="Dynamic route values will appear here on detail pages such as products, suppliers and requests."
              />
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}

export default PlaceholderPage;
