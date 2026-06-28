import { Link } from "react-router-dom";
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

      <form
        className="request-form-fields"
        data-testid="request-form"
        onSubmit={onSubmit}
      >
        <input
          type="hidden"
          name="supplierId"
          value={formData.supplierId}
          onChange={onChange}
        />
        <input
          type="hidden"
          name="productId"
          value={formData.productId}
          onChange={onChange}
        />

        {fieldErrors.supplierId && (
          <p className="request-form-fields__target-error">
            {fieldErrors.supplierId}
          </p>
        )}

        <div className="request-form-fields__section">
          <div className="request-form-fields__heading">
            <span>01</span>
            <div>
              <h2>Votre besoin</h2>
              <p>Donnez un objet clair à votre demande.</p>
            </div>
          </div>

          <Input
            label="Objet de la demande"
            name="subject"
            value={formData.subject}
            onChange={onChange}
            placeholder="Demande d’informations produit"
            error={fieldErrors.subject}
            required
          />

          <Input
          label="Volume ou besoin professionnel"
            name="requestedQuantity"
            value={formData.requestedQuantity}
            onChange={onChange}
            placeholder="50 kg, 100 unités, approvisionnement régulier..."
            helperText="Indiquez, si possible, le volume ou le besoin envisagé."
          />
        </div>

        <div className="request-form-fields__section">
          <div className="request-form-fields__heading">
            <span>02</span>
            <div>
              <h2>Votre message</h2>
              <p>Précisez vos attentes et les informations souhaitées.</p>
            </div>
          </div>

          <label
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
            aria-invalid={Boolean(fieldErrors.message)}
          />

          {fieldErrors.message && (
            <p className="request-form-fields__error">
              {fieldErrors.message}
            </p>
          )}
        </div>

        <div className="request-form-fields__actions">
          <Link to="/catalog">Annuler</Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Envoi..." : "Envoyer la demande"}
          </Button>
        </div>
      </form>
    </>
  );
}

export default RequestFormFields;
