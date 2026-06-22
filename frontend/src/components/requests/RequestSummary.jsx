function RequestSummary({ ariaLabel = "Résumé", statusCounts }) {
  return (
    <section className="supplier-requests-summary" aria-label={ariaLabel}>
      <div>
        <span>Total</span>
        <strong>{statusCounts.total}</strong>
      </div>
      <div>
        <span>En attente</span>
        <strong>{statusCounts.pending}</strong>
      </div>
      <div>
        <span>Acceptées</span>
        <strong>{statusCounts.accepted}</strong>
      </div>
      <div>
        <span>Traitées</span>
        <strong>{statusCounts.processed}</strong>
      </div>
    </section>
  );
}

export default RequestSummary;
