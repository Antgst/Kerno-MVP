function SupplierRequestsHeader({
  errorMessage,
  isLoading,
  pendingCount,
  requestCount,
}) {
  return (
    <header className="supplier-requests-header">
      <div>
        <h1>Demandes reçues</h1>
        <p>
          Suivez les demandes de contact et de devis reçues des magasins.
        </p>
      </div>

      {!isLoading && !errorMessage && requestCount > 0 && (
        <div className="supplier-requests-header__summary">
          <strong>{pendingCount}</strong>
          <span>
            {pendingCount > 1 ? "demandes à examiner" : "demande à examiner"}
          </span>
        </div>
      )}
    </header>
  );
}

export default SupplierRequestsHeader;
