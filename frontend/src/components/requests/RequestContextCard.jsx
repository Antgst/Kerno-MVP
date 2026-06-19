import StatusBadge from "../ui/StatusBadge";

function RequestContextCard({ product, supplier }) {
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="m-0 text-xl font-black">
            Contexte de la demande
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Vérifiez le fournisseur et le produit concernés avant l’envoi.
          </p>
        </div>

        <StatusBadge status="DRAFT" />
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Fournisseur
          </p>
          <p className="mt-1 text-xl font-black text-slate-950">
            {supplier?.companyName || "Fournisseur non chargé"}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {supplier?.location || "Localisation non renseignée"}
          </p>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Produit
          </p>
          <p className="mt-1 text-xl font-black text-slate-950">
            {product?.name || "Aucun produit spécifique"}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {product?.priceInfo || "Tarif sur demande"}
          </p>
        </div>

        <div className="rounded-3xl bg-emerald-950 p-6 text-white">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">
            Périmètre du MVP
          </p>

          <h3 className="mt-3 text-2xl font-black">
            Un premier contact professionnel
          </h3>

          <p className="mt-3 text-sm leading-6 text-emerald-50">
            Ce formulaire transmet une demande de contact. Il ne crée ni
            commande, ni paiement, ni échange de messagerie avancé.
          </p>
        </div>
      </div>
    </>
  );
}

export default RequestContextCard;
