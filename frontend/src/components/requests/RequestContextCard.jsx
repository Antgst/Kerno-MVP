import StatusBadge from "../ui/StatusBadge";
import { formatProductPrice } from "../../utils/productPrice";

function RequestContextCard({ product, supplier }) {
  return (
    <>
      <div className="request-context-card__heading">
        <div>
          <h2>Contexte de la demande</h2>
          <p>
            Vérifiez le fournisseur et le produit concernés avant l’envoi.
          </p>
        </div>

        <StatusBadge status="DRAFT" label="Avant envoi" />
      </div>

      <div className="space-y-5">
        <div className="request-context-card__target">
          <p>Fournisseur</p>
          <strong>{supplier?.companyName || "Fournisseur à sélectionner"}</strong>
          <span>
            {supplier?.location ||
              "Sélectionnez un fournisseur depuis le catalogue."}
          </span>
        </div>

        <div className="request-context-card__target">
          <p>Produit</p>
          <strong>{product?.name || "Demande générale"}</strong>
          <span>
            {product
              ? formatProductPrice(product)
              : "La demande ne concerne pas un produit en particulier."}
          </span>
        </div>

        <div className="request-context-card__note">
          <p>Conseil</p>

          <h3>Facilitez la réponse du fournisseur</h3>

          <span>
            Mentionnez le volume envisagé, vos délais et les conditions
            professionnelles que vous souhaitez connaître.
          </span>
        </div>
      </div>
    </>
  );
}

export default RequestContextCard;
