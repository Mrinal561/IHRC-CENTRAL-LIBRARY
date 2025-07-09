
// import React, { useState, useEffect } from 'react';
// import { Select } from '../Select';


// interface OutlinedSelectProps {
//   label: string;
//   options: any[];
//   value: any;
//   onChange: (value: any) => void;
//   isMulti?: boolean;
//   disabled?: boolean;
//   loading?: boolean; // Add this
// }


// const OutlinedSelect = ({ 
//   label, 
//   options, 
//   value, 
//   onChange, 
//   isMulti = false, 
//   disabled = false,
//   loading = false // Add this
// }: OutlinedSelectProps) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const [selectedValue, setSelectedValue] = useState(value);

//   useEffect(() => {
//     setSelectedValue(value || (isMulti? [] : ''));
//   }, [value, isMulti]);

//   const handleFocus = () =>!disabled && setIsFocused(true);
//   const handleBlur = () =>!disabled && setIsFocused(false);

//   const handleChange = (newValue) => {
//     if (disabled) return;
//     setSelectedValue(newValue || (isMulti? [] : ''));
//     onChange(newValue);
//   };

//   const isFloating = isFocused || (selectedValue!== null && selectedValue!== undefined && (isMulti? selectedValue.length > 0 : selectedValue!== ''));

//   return (
//     <div
//       className={`relative ${disabled? ' border-gray-300 border rounded-md' : ''}`}
//     >
//       {!disabled && (
//         <div className={`absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none`}>
//           <span
//             className={`absolute px-1 transition-all duration-200 ${
//               isFloating
//                ? `-top-3 left-3 text-xs font-semibold bg-white text-indigo-600`
//                 : `top-2 left-2 text-sm text-gray-500`
//             }`}
//           >
//             {label}
//           </span>
//         </div>
//       )}
//       <Select
//         isMulti={isMulti}
//         value={selectedValue}
//         onChange={handleChange}
//         options={options}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         isDisabled={disabled}
//         className={`w-full border-none bg-transparent ${disabled? 'pointer-events-none' : ''}`}
//         styles={{
//           control: (provided) => ({
//            ...provided,
//             minHeight: '36px',
//             backgroundColor: 'transparent',
//             border: 'none',
//             boxShadow: 'none',
//             cursor: disabled? 'not-allowed' : 'default',
//           }),
//         }}
//         placeholder=""
//       />
//     </div>
//   );
// };

// export default OutlinedSelect;














import React, { useState, useEffect } from 'react';
import { Select } from '../Select';

interface OutlinedSelectProps {
  label: string;
  options: any[];
  value: any;
  onChange: (value: any) => void;
  onBlur?: (e: React.FocusEvent) => void; 
  isMulti?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean; // Add error prop
}

const OutlinedSelect = ({ 
  label, 
  options, 
  value, 
  onChange, 
  isMulti = false, 
  disabled = false,
  loading = false,
  error = false // Add error prop with default value
}: OutlinedSelectProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value || (isMulti ? [] : ''));
  }, [value, isMulti]);

  const handleFocus = () => !disabled && setIsFocused(true);
  const handleBlur = () => !disabled && setIsFocused(false);

  const handleChange = (newValue: any) => {
    if (disabled) return;
    setSelectedValue(newValue || (isMulti ? [] : ''));
    onChange(newValue);
  };

  const isFloating = isFocused || (selectedValue !== null && selectedValue !== undefined && (isMulti ? selectedValue.length > 0 : selectedValue !== ''));

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
            '&:hover': {
              borderColor: error ? '#ef4444' : provided.borderColor
            }
          }),
        }}
        placeholder=""
      />
    </div>
  );
};

export default OutlinedSelect;