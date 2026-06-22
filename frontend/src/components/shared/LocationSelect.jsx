import { useEffect, useId, useMemo, useRef, useState } from "react";
import { City, State } from "country-state-city";

const MAX_SUGGESTIONS = 8;

function normalizeSearchValue(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr-FR")
    .trim();
}

function getMatchScore(city, search) {
  const cityName = normalizeSearchValue(city.cityName);
  const fullLabel = normalizeSearchValue(city.label);

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
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const cityOptions = useMemo(() => {
    const formattedCities = City.getCitiesOfCountry("FR").map((city) => {
      const state = State.getStateByCodeAndCountry(city.stateCode, "FR");
      const regionName = state?.name || city.stateCode;
      const label = `${city.name}, ${regionName}, France`;

      return {
        value: label,
        label,
        cityName: city.name,
        regionName,
      };
    });

    return Array.from(
      new Map(formattedCities.map((city) => [city.value, city])).values(),
    );
  }, []);

  const filteredCities = useMemo(() => {
    const search = normalizeSearchValue(value);

    if (search.length < 2) {
      return [];
    }

    return cityOptions
      .map((city) => ({
        ...city,
        matchScore: getMatchScore(city, search),
      }))
      .filter((city) => Number.isFinite(city.matchScore))
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

  function handleInputChange(event) {
    onChange(event);
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
                      <span className="location-autocomplete__pin" aria-hidden="true">
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
                          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
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
                Aucune ville trouvée
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
