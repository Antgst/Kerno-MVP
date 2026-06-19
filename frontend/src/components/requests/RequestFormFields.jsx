import Button from "../ui/Button";
import ErrorState from "../ui/ErrorState";
import Input from "../ui/Input";
import LoadingState from "../ui/LoadingState";

function RequestFormFields({
  fieldErrors,
  formData,
  isSubmitting,
  onChange,
  onSubmit,
  submitErrorMessage,
}) {
  return (
    <>
      {submitErrorMessage && (
        <ErrorState
          className="mb-5"
          title="Échec de création de la demande"
          message={submitErrorMessage}
        />
      )}

      {isSubmitting && (
        <LoadingState className="mb-5" message="Création de la demande..." />
      )}

      <form className="space-y-5" onSubmit={onSubmit}>
        <Input
          label="Identifiant fournisseur"
          name="supplierId"
          value={formData.supplierId}
          onChange={onChange}
          placeholder="Identifiant du fournisseur"
          error={fieldErrors.supplierId}
          helperText="Ce champ est rempli automatiquement depuis une fiche fournisseur ou produit."
          required
        />

        <Input
          label="Identifiant produit"
          name="productId"
          value={formData.productId}
          onChange={onChange}
          placeholder="Identifiant du produit (facultatif)"
          helperText="Facultatif, si la demande concerne un produit précis."
        />

        <Input
          label="Objet"
          name="subject"
          value={formData.subject}
          onChange={onChange}
          placeholder="Demande de tarifs professionnels"
          error={fieldErrors.subject}
          required
        />

        <div>
          <label
            className="mb-2 block text-sm font-bold text-slate-800"
            htmlFor="message"
          >
            Message <span className="text-orange-500">*</span>
          </label>

          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={onChange}
            rows="6"
            placeholder="Décrivez votre besoin, les délais souhaités et vos questions."
            className={[
              "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900",
              "outline-none transition placeholder:text-slate-400 focus:ring-2",
              fieldErrors.message
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-emerald-800 focus:ring-emerald-100",
            ].join(" ")}
          />

          {fieldErrors.message && (
            <p className="mt-2 text-sm font-semibold text-red-600">
              {fieldErrors.message}
            </p>
          )}
        </div>

        <Input
          label="Quantité ou besoin professionnel"
          name="requestedQuantity"
          value={formData.requestedQuantity}
          onChange={onChange}
          placeholder="50 kg, 100 unités, approvisionnement régulier..."
          helperText="Facultatif. Indiquez simplement votre besoin."
        />

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Création..." : "Envoyer la demande"}
        </Button>
      </form>
    </>
  );
}

export default RequestFormFields;
