import { useEffect, useId, useMemo, useRef, useState } from "react";

const MAX_SUGGESTIONS = 8;
const CITY_DATA_URL = `${import.meta.env.BASE_URL}data/franceCities.txt`;

let cachedCityOptions = null;
let cachedCityOptionsPromise = null;

function normalizeSearchValue(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr-FR")
    .trim();
}

function parseCityOptions(source) {
  return source
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split("|"))
    .filter(([cityName, regionName]) => cityName && regionName);
}

function loadCityOptions() {
  if (cachedCityOptions) {
    return Promise.resolve(cachedCityOptions);
  }

  if (!cachedCityOptionsPromise) {
    cachedCityOptionsPromise = fetch(CITY_DATA_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Impossible de charger les villes.");
        }

        return response.text();
      })
      .then((source) => {
        cachedCityOptions = parseCityOptions(source);
        return cachedCityOptions;
      })
      .catch((error) => {
        cachedCityOptionsPromise = null;
        throw error;
      });
  }

  return cachedCityOptionsPromise;
}

function getCityOption(cityTuple) {
  const [cityName, regionName] = cityTuple;
  const label = `${cityName}, ${regionName}, France`;

  return {
    value: label,
    label,
    cityName,
    regionName,
  };
}

function getMatchScore(cityOption, search) {
  const cityName = normalizeSearchValue(cityOption.cityName);
  const fullLabel = normalizeSearchValue(cityOption.label);

  if (cityName.startsWith(search)) {
    return 0;
  }

  if (fullLabel.startsWith(search)) {
    return 1;
  }

  if (cityName.includes(search)) {
    return 2;
  }

  if (fullLabel.includes(search)) {
    return 3;
  }

  return Number.POSITIVE_INFINITY;
}

function LocationSelect({
  label = "Localisation",
  name = "location",
  value,
  onChange,
  required = false,
  error,
  helperText = "Tapez le nom de votre ville.",
}) {
  const componentId = useId();
  const listboxId = `${componentId}-suggestions`;
  const wrapperRef = useRef(null);
  const isComponentMountedRef = useRef(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [cityOptions, setCityOptions] = useState(() => cachedCityOptions || []);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [cityDataError, setCityDataError] = useState("");

  const filteredCities = useMemo(() => {
    const search = normalizeSearchValue(value);

    if (search.length < 2) {
      return [];
    }

    const matchingCities = [];

    for (const cityTuple of cityOptions) {
      const cityOption = getCityOption(cityTuple);
      const matchScore = getMatchScore(cityOption, search);

      if (Number.isFinite(matchScore)) {
        matchingCities.push({
          ...cityOption,
          matchScore,
        });
      }
    }

    return matchingCities
      .sort(
        (firstCity, secondCity) =>
          firstCity.matchScore - secondCity.matchScore ||
          firstCity.cityName.localeCompare(secondCity.cityName, "fr"),
      )
      .slice(0, MAX_SUGGESTIONS);
  }, [cityOptions, value]);

  const shouldShowDropdown =
    isOpen && normalizeSearchValue(value).length >= 2;
  const activeOptionId =
    activeIndex >= 0 ? `${componentId}-option-${activeIndex}` : undefined;

  useEffect(() => {
    return () => {
      isComponentMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  function emitLocationChange(cityValue) {
    onChange({
      target: {
        name,
        value: cityValue,
      },
    });
  }

  function ensureCityOptionsLoaded() {
    if (cachedCityOptions) {
      setCityOptions(cachedCityOptions);
      setCityDataError("");
      return;
    }

    setIsLoadingCities(true);

    loadCityOptions()
      .then((loadedCityOptions) => {
        if (!isComponentMountedRef.current) {
          return;
        }

        setCityOptions(loadedCityOptions);
        setCityDataError("");
      })
      .catch(() => {
        if (!isComponentMountedRef.current) {
          return;
        }

        setCityOptions([]);
        setCityDataError("Impossible de charger les suggestions.");
      })
      .finally(() => {
        if (isComponentMountedRef.current) {
          setIsLoadingCities(false);
        }
      });
  }

  function handleInputChange(event) {
    onChange(event);
    ensureCityOptionsLoaded();
    setIsOpen(true);
    setActiveIndex(-1);
  }

  function handleSelectCity(cityValue) {
    emitLocationChange(cityValue);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!shouldShowDropdown || filteredCities.length === 0) {
      if (event.key === "ArrowDown" && normalizeSearchValue(value).length >= 2) {
        ensureCityOptionsLoaded();
        setIsOpen(true);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((currentIndex) =>
        currentIndex >= filteredCities.length - 1 ? 0 : currentIndex + 1,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((currentIndex) =>
        currentIndex <= 0 ? filteredCities.length - 1 : currentIndex - 1,
      );
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      handleSelectCity(filteredCities[activeIndex].value);
    }
  }

  return (
    <div className="form-field location-autocomplete">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-mark"> *</span>}
        </label>
      )}

      <div className="location-autocomplete__wrapper" ref={wrapperRef}>
        <input
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            ensureCityOptionsLoaded();
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onBlur={(event) => {
            if (!wrapperRef.current?.contains(event.relatedTarget)) {
              setIsOpen(false);
              setActiveIndex(-1);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ex. Rennes, Nantes, Betton..."
          required={required}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={shouldShowDropdown}
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          aria-invalid={Boolean(error)}
          className={`form-input ${error ? "form-input--error" : ""}`}
        />

        {shouldShowDropdown && (
          <div className="location-autocomplete__dropdown">
            {filteredCities.length > 0 ? (
              <ul
                id={listboxId}
                className="location-autocomplete__list"
                role="listbox"
                aria-label="Suggestions de villes"
              >
                {filteredCities.map((city, index) => (
                  <li
                    id={`${componentId}-option-${index}`}
                    key={city.value}
                    role="option"
                    aria-selected={activeIndex === index}
                  >
                    <button
                      type="button"
                      className={[
                        "location-autocomplete__option",
                        activeIndex === index
                          ? "location-autocomplete__option--active"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      tabIndex="-1"
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => handleSelectCity(city.value)}
                    >
                      <span
                        className="location-autocomplete__pin"
                        aria-hidden="true"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 11 16 0Z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                      </span>
                      <span className="location-autocomplete__copy">
                        <strong>{city.cityName}</strong>
                        <small>{city.regionName}, France</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="location-autocomplete__empty">
                {isLoadingCities
                  ? "Chargement des villes..."
                  : cityDataError || "Aucune ville trouvée"}
              </p>
            )}
          </div>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}
      {!error && helperText && <p className="form-helper">{helperText}</p>}
    </div>
  );
}

export default LocationSelect;
