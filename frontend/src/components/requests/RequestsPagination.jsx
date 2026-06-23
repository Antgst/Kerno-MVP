function getPaginationPages(currentPage, totalPages) {
  const pages = new Set([1, totalPages]);
  const firstNearbyPage = Math.max(1, currentPage - 1);
  const lastNearbyPage = Math.min(totalPages, currentPage + 1);

  for (let page = firstNearbyPage; page <= lastNearbyPage; page += 1) {
    pages.add(page);
  }

  return [...pages].sort((firstPage, secondPage) => firstPage - secondPage);
}

function RequestsPagination({
  currentPage,
  firstItemIndex,
  lastItemIndex,
  onPageChange,
  totalItems,
  totalPages,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPaginationPages(currentPage, totalPages);

  return (
    <nav
      className="supplier-requests-list__footer"
      aria-label="Pagination des demandes"
    >
      <p>
        Demandes {firstItemIndex + 1}-{lastItemIndex} sur {totalItems}
      </p>

      <div>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </button>

        {pages.map((page, index) => {
          const previousPage = pages[index - 1];
          const shouldShowGap = previousPage && page - previousPage > 1;

          return (
            <span className="supplier-requests-list__page-group" key={page}>
              {shouldShowGap && (
                <span
                  className="supplier-requests-list__gap"
                  aria-hidden="true"
                >
                  ...
                </span>
              )}
              <button
                type="button"
                className={page === currentPage ? "is-active" : ""}
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    </nav>
  );
}

export default RequestsPagination;
