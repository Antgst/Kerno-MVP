import { useMemo, useState } from "react";
import { City, State } from "country-state-city";

function LocationSelect({
  label = "Localisation",
  name = "location",
  value,
  onChange,
  required = false,
  error,
  helperText = "Tapez le nom de votre ville.",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const cityOptions = useMemo(() => {
    const cities = City.getCitiesOfCountry("FR");

    const formattedCities = cities.map((city) => {
      const state = State.getStateByCodeAndCountry(city.stateCode, "FR");

      const regionName = state?.name || city.stateCode;

      return {
        value: `${city.name}, ${regionName}, France`,
        label: `${city.name}, ${regionName}, France`,
      };
    });

    return Array.from(
      new Map(formattedCities.map((city) => [city.value, city])).values()
    ).sort((a, b) => a.label.localeCompare(b.label, "fr"));
  }, []);

  const filteredCities = useMemo(() => {
    const search = value.trim().toLowerCase();

    if (search.length < 2) {
      return [];
    }

    return cityOptions
      .filter((city) => city.label.toLowerCase().includes(search))
      .slice(0, 8);
  }, [cityOptions, value]);

  function handleInputChange(event) {
    onChange(event);
    setIsOpen(true);
  }

  function handleSelectCity(cityValue) {
    onChange({
      target: {
        name,
        value: cityValue,
      },
    });

    setIsOpen(false);
  }

  return (
    <div className="form-field location-autocomplete">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-mark"> *</span>}
        </label>
      )}

      <div className="location-autocomplete__wrapper">
        <input
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 150);
          }}
          placeholder="Ex : Betton, Rennes, Nantes..."
          required={required}
          autoComplete="off"
          className={`form-input ${error ? "form-input--error" : ""}`}
        />

        {isOpen && filteredCities.length > 0 && (
          <ul className="location-autocomplete__list">
            {filteredCities.map((city) => (
              <li key={city.value}>
                <button
                  type="button"
                  className="location-autocomplete__option"
                  onMouseDown={() => handleSelectCity(city.value)}
                >
                  {city.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}
      {!error && helperText && <p className="form-helper">{helperText}</p>}
    </div>
  );
}

export default LocationSelect;