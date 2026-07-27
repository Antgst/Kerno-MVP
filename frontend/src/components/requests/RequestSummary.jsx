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
        <span>Lues</span>
        <strong>{statusCounts.read}</strong>
      </div>
      <div>
        <span>Répondues</span>
        <strong>{statusCounts.answered}</strong>
      </div>
    </section>
  );
}

export default RequestSummary;
