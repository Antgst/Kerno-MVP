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
  public: "Page publique.",
  auth: "Page réservée aux utilisateurs connectés.",
  supplier: "Page réservée aux fournisseurs.",
  store: "Page réservée aux magasins.",
};

const roleOptions = [
  { value: "SUPPLIER", label: "Fournisseur" },
  { value: "STORE", label: "Magasin" },
];

const accessLabels = {
  public: "Public",
  auth: "Authentifié",
  supplier: "Fournisseur",
  store: "Magasin",
};

function PlaceholderPage({ route }) {
  const params = useParams();
  const hasParams = Object.keys(params).length > 0;

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Route KERNO MVP"
          title={route.label}
          description="Cette page temporaire utilise les composants partagés du MVP KERNO."
        >
          <Link className="font-black text-emerald-900 hover:underline" to="/">
            Retour à l’accueil
          </Link>
        </PageHeader>

        <div className="grid gap-4 md:grid-cols-3">
          <DashboardStatCard
            label="Chemin"
            value={route.path}
            helperText="Route actuelle"
          />

          <DashboardStatCard
            label="Accès"
            value={accessLabels[route.access] || "À confirmer"}
            helperText="Niveau d’accès attendu"
          />

          <DashboardStatCard
            label="Statut"
            value="Prête"
            trend="UI"
            helperText={accessMessages[route.access]}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="m-0 text-xl font-black">
                  Aperçu des composants partagés
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Les boutons, champs, cartes et badges sont réutilisables dans
                  les différents espaces KERNO.
                </p>
              </div>

              <StatusBadge status={route.access === "public" ? "ACTIVE" : "PENDING"} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Champ d’exemple"
                name="exampleField"
                placeholder="Champ réutilisable"
                helperText="Utilisé dans les formulaires de l’application."
              />

              <Select
                label="Rôle d’exemple"
                name="exampleRole"
                options={roleOptions}
                placeholder="Choisir un rôle"
                helperText="Liste réutilisable avec des options simples."
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button>Action principale</Button>
              <Button variant="secondary">Action secondaire</Button>
              <Button variant="ghost">Action discrète</Button>
            </div>
          </Card>

          <Card>
            {hasParams ? (
              <div>
                <h2 className="m-0 text-xl font-black">
                  Paramètres de la route
                </h2>

                <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-white">
                  {JSON.stringify(params, null, 2)}
                </pre>
              </div>
            ) : (
              <EmptyState
                title="Aucun paramètre de route"
                message="Les valeurs dynamiques apparaîtront ici sur les pages de détail."
              />
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}

export default PlaceholderPage;
