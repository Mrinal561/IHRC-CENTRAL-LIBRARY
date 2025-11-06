
import React, { useState, useEffect } from 'react';
import { Select } from '../Select';
import { IoClose } from 'react-icons/io5';

interface OutlinedSelectProps {
  label: string;
  options: any[];
  value: any;
  onChange: (value: any) => void;
  onBlur?: (e: React.FocusEvent) => void;
  isMulti?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  showClearButton?: boolean;
}

const OutlinedSelect = ({ 
  label, 
  options, 
  value, 
  onChange, 
  onBlur,
  isMulti = false, 
  disabled = false,
  loading = false,
  error = false,
  showClearButton = true
}: OutlinedSelectProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value || (isMulti ? [] : null));
  }, [value, isMulti]);

  const handleFocus = () => !disabled && setIsFocused(true);
  const handleBlur = (e: any) => {
    !disabled && setIsFocused(false);
    onBlur && onBlur(e);
  };

  const handleChange = (newValue: any) => {
    if (disabled) return;
    setSelectedValue(newValue || (isMulti ? [] : null));
    onChange(newValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = isMulti ? [] : null;
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const isFloating = isFocused || 
    (selectedValue !== null && 
     selectedValue !== undefined && 
     (isMulti ? selectedValue.length > 0 : selectedValue !== ''));

  const shouldShowClearButton = showClearButton && !disabled && 
    ((isMulti && selectedValue?.length > 0) || 
     (!isMulti && selectedValue !== null && selectedValue !== undefined && selectedValue !== ''));

  return (
    <div className={`relative ${disabled ? 'border-gray-300 border rounded-md' : ''}`}>
      {!disabled && (
        <div className={`absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none ${error ? 'border-red-500' : 'border-gray-300'}`}>
          <span
            className={`absolute px-1 transition-all duration-200 ${
              isFloating
                ? `-top-3 left-3 text-xs font-semibold bg-white ${error ? 'text-red-600' : 'text-indigo-600'}`
                : `top-2 left-2 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`
            }`}
          >
            {label}
          </span>
        </div>
      )}
      <div className="relative flex items-center">
        <Select
          isMulti={isMulti}
          value={selectedValue}
          onChange={handleChange}
          options={options}
          onFocus={handleFocus}
          onBlur={handleBlur}
          isDisabled={disabled}
          isLoading={loading}
          className={`w-full border-none bg-transparent ${disabled ? 'pointer-events-none' : ''}`}
          styles={{
            control: (provided, state) => ({
              ...provided,
              minHeight: '36px',
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              cursor: disabled ? 'not-allowed' : 'default',
              paddingRight: shouldShowClearButton ? '30px' : '8px',
              '&:hover': {
                borderColor: error ? '#ef4444' : provided.borderColor
              }
            }),
            placeholder: (provided) => ({
              ...provided,
              color: 'transparent',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: '#000',
              marginTop: isFloating ? '8px' : '0',
            }),
            multiValue: (provided) => ({
              ...provided,
              marginTop: isFloating ? '8px' : '0',
            }),
            valueContainer: (provided) => ({
              ...provided,
              padding: '2px 8px',
            }),
            input: (provided) => ({
              ...provided,
              marginTop: isFloating ? '8px' : '0',
              color: '#000',
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
            }),
            indicatorSeparator: () => ({
              display: 'none',
            }),
          }}
          placeholder=""
        />
        {shouldShowClearButton && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full focus:outline-none hover:bg-gray-100 transition-colors"
            onClick={handleClear}
            type="button"
            aria-label="Clear selection"
          >
            <IoClose className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default OutlinedSelect;