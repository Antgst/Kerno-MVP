import { requestStatusOptions } from "../../utils/status";
import RequestIcon from "./RequestIcon";

function RequestToolbar({
  ariaLabel,
  filters,
  hasActiveFilters,
  onFilterChange,
  onResetFilters,
  searchPlaceholder,
}) {
  return (
    <section className="supplier-requests-toolbar" aria-label={ariaLabel}>
      <label className="supplier-requests-search">
        <span className="sr-only">Rechercher une demande</span>
        <RequestIcon name="search" />
        <input
          name="search"
          value={filters.search}
          onChange={onFilterChange}
          placeholder={searchPlaceholder}
        />
      </label>

      <select
        name="status"
        value={filters.status}
        onChange={onFilterChange}
        aria-label="Filtrer par statut"
      >
        <option value="">Tous les statuts</option>
        {requestStatusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        name="sort"
        value={filters.sort}
        onChange={onFilterChange}
        aria-label="Trier les demandes"
      >
        <option value="recent">Plus récentes d’abord</option>
        <option value="oldest">Plus anciennes d’abord</option>
      </select>

      <button
        className="supplier-requests-toolbar__reset"
        type="button"
        disabled={!hasActiveFilters}
        onClick={onResetFilters}
      >
        Réinitialiser
      </button>
    </section>
  );
}

export default RequestToolbar;
