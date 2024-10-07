import React from 'react';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui';

const OutlinedBadgeSelect = ({ label, options, value, onChange, optionRenderer }) => {
  const CustomOption = ({ innerProps, label, isSelected, data }) => {
    return (
      <div className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100" {...innerProps}>
        {optionRenderer ? optionRenderer(data, isSelected) : (
          <>
            <span>{label}</span>
            {isSelected && (
              <div className="w-4 h-4 rounded-full bg-emerald-500" />
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none border-gray-300">
        <span className="absolute px-1 transition-all duration-200 -top-3 left-3 text-xs font-semibold bg-white text-indigo-600">
          {label}
        </span>
      </div>
      <Select
        value={value}
        onChange={onChange}
        options={options}
        className="w-full border-none bg-transparent"
        styles={{
          control: (provided) => ({
            ...provided,
            minHeight: '36px',
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
            '&:hover': {
              border: 'none',
            },
          }),
          placeholder: (provided) => ({
            ...provided,
            color: 'transparent',
          }),
          singleValue: (provided) => ({
            ...provided,
            color: '#000',
            marginTop: '8px',
          }),
          input: (provided) => ({
            ...provided,
            marginTop: '8px',
          }),
        }}
        placeholder=""
        components={{
          Option: CustomOption,
        }}
      />
    </div>
  );
};

export default OutlinedBadgeSelect;