import React, { useEffect, useState } from 'react';
import { Form, Select } from "antd";
import { Country, State, City } from 'country-state-city';
import iso6391 from 'iso-639-1';

type InputSelectProps = {
  label: string;
  name: string;
  options?: { value: string; label: string }[];
  size?: "large" | "middle" | "small";
  type?: "country" | "state" | "city" | "language" | "subject";
  required?: boolean;
  mode?: "multiple" | "tags";
  maxCount?: number;
  selectedCountry?: string;
  selectedState?: string;
  onCountryChange?: (value: string) => void;
  onStateChange?: (value: string) => void;
};

const InputSelect: React.FC<InputSelectProps> = ({
  label,
  name,
  options,
  size = "large",
  type = "country",
  required = true,
  mode,
  maxCount,
  selectedCountry,
  selectedState,
  onCountryChange,
  onStateChange
}) => {
  const [states, setStates] = useState<{ value: string; label: string }[]>([]);
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);

  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.name,
    label: country.name,
  }));

  const languageOptions = iso6391.getAllCodes().map((code) => ({
    value: code,
    label: iso6391.getName(code) || "",
  }));

  const subjectOptions = [
    { label: 'Mathematics', value: 'Mathematics' },
    { label: 'Science', value: 'Science' },
    { label: 'History', value: 'History' },
    { label: 'Literature', value: 'Literature' },
  ];

  useEffect(() => {
    if (selectedCountry) {
      const countryData = Country.getAllCountries().find(
        country => country.name === selectedCountry
      );
      if (countryData) {
        const statesList = State.getStatesOfCountry(countryData.isoCode);
        setStates(statesList.map(state => ({
          value: state.name,
          label: state.name
        })));
      }
    } else {
      setStates([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const countryData = Country.getAllCountries().find(
        country => country.name === selectedCountry
      );
      if (countryData) {
        const stateData = State.getStatesOfCountry(countryData.isoCode).find(
          state => state.name === selectedState
        );
        if (stateData) {
          const citiesList = City.getCitiesOfState(countryData.isoCode, stateData.isoCode);
          setCities(citiesList.map(city => ({
            value: city.stateCode,
            label: city.name
          })));
        }
      }
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState]);

  const selectOptions = (() => {
    // If custom options are provided, use them regardless of type
    if (options) {
      return options;
    }

    // Otherwise, use type-based options
    switch (type) {
      case 'country':
        return countryOptions;
      case 'state':
        return states;
      case 'city':
        return cities;
      case 'language':
        return languageOptions;
      case 'subject':
        return subjectOptions;
      default:
        return [];
    }
  })();

  const handleChange = (value: string) => {
    if (type === 'country' && onCountryChange) {
      onCountryChange(value);
    } else if (type === 'state' && onStateChange) {
      onStateChange(value);
    }
  };

  return (
    <Form.Item
      label={<span style={{ fontWeight: "500" }}>{label}</span>}
      name={name}
      rules={[{ required, message: `Please select your ${label}` }]}
    >
      <Select
        maxCount={maxCount}
        mode={mode}
        size={size}
        showSearch
        filterOption={(input, option) =>
          typeof option?.label === "string" &&
          option.label.toLowerCase().includes(input.toLowerCase())
        }
        placeholder={`Select your ${type}`}
        onChange={handleChange}
        disabled={(type === 'state' && !selectedCountry) ||
          (type === 'city' && (!selectedCountry || !selectedState))}
      >
        {selectOptions.map((option) => (
          <Select.Option
            key={option.value}
            value={option.value}
            label={option.label}
          >
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default InputSelect;