import React, { useState, useEffect } from 'react';
import { Select } from '../Select';

const OutlinedSelect = ({ label, options, value, onChange, isMulti = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    setSelectedValue(value || (isMulti ? [] : ''));
  }, [value, isMulti]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleChange = (newValue) => {
    setSelectedValue(newValue || (isMulti ? [] : ''));
    onChange(newValue);
  };

  const isFloating = isFocused || (selectedValue !== null && selectedValue !== undefined && (isMulti ? selectedValue.length > 0 : selectedValue !== ''));

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none border-gray-300">
        <span
          className={`absolute px-1 transition-all duration-200 ${
            isFloating
              ? '-top-3 left-3 text-xs font-semibold bg-white text-indigo-600'
              : 'top-2 left-2 text-sm text-gray-500'
          }`}
        >
          {label}
        </span>
      </div>
      <Select
        isMulti={isMulti}
        value={selectedValue}
        onChange={handleChange}
        options={options}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
            marginTop: isFloating ? '8px' : '0',
          }),
          multiValue: (provided) => ({
            ...provided,
            marginTop: isFloating ? '8px' : '0',
          }),
          input: (provided) => ({
            ...provided,
            marginTop: isFloating ? '8px' : '0',
          }),
        }}
        placeholder=""
      />
    </div>
  );
};

export default OutlinedSelect;



// import React, { useState, useEffect, ReactNode } from 'react';
// import { Select, SelectProps } from '../Select';
// import { HiCheck } from 'react-icons/hi';
// import { useConfig } from '../ConfigProvider';

// interface Option {
//   label: string;
//   value: string | number;
// }

// interface OutlinedSelectProps extends Omit<SelectProps<Option, false>, 'components'> {
//   label: string;
//   options: Option[];
//   value: Option | null;
//   onChange: (selectedOption: Option | null) => void;
//   isMulti?: false;
//   selectedIndicator?: ReactNode;
// }

// const OutlinedSelect: React.FC<OutlinedSelectProps> = ({ 
//   label, 
//   options, 
//   value, 
//   onChange, 
//   isMulti = false, 
//   selectedIndicator,
//   ...restProps
// }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const [selectedValue, setSelectedValue] = useState<Option | null | Option[]>(value);
//   const { themeColor, controlSize, primaryColorLevel, mode } = useConfig()


//   useEffect(() => {
//     setSelectedValue(value || (isMulti ? [] : null));
//   }, [value, isMulti]);

//   const handleFocus = () => setIsFocused(true);
//   const handleBlur = () => setIsFocused(false);

//   const handleChange = (newValue: Option | null | Option[]) => {
//     setSelectedValue(newValue);
//     onChange(newValue as Option | null);
//   };

//   const isFloating = isFocused || (selectedValue !== null && (Array.isArray(selectedValue) ? selectedValue.length > 0 : true));

//   const CustomOption: React.FC<any> = ({ innerProps, label, isSelected, ...rest }) => {
//     return (
//       <div className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100" {...innerProps}>
//         <span>{label}</span>
//         {isSelected && (
//           selectedIndicator ? selectedIndicator :  <HiCheck
//           className={`text-${themeColor} dark:text-white text-xl`}
//       />
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="relative">
//       <div className="absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none border-gray-300">
//         <span
//           className={`absolute px-1 transition-all duration-200 ${
//             isFloating
//               ? '-top-3 left-3 text-xs font-semibold bg-white text-indigo-600'
//               : 'top-2 left-2 text-sm text-gray-500'
//           }`}
//         >
//           {label}
//         </span>
//       </div>
//       <Select<Option, false>
//         isMulti={isMulti}
//         value={selectedValue as Option}
//         onChange={handleChange}
//         options={options}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         className="w-full border-none bg-transparent"
//         styles={{
//           control: (provided) => ({
//             ...provided,
//             minHeight: '36px',
//             backgroundColor: 'transparent',
//             border: 'none',
//             boxShadow: 'none',
//             '&:hover': {
//               border: 'none',
//             },
//           }),
//           placeholder: (provided) => ({
//             ...provided,
//             color: 'transparent',
//           }),
//           singleValue: (provided) => ({
//             ...provided,
//             color: '#000',
//             marginTop: isFloating ? '8px' : '0',
//           }),
//           multiValue: (provided) => ({
//             ...provided,
//             marginTop: isFloating ? '8px' : '0',
//           }),
//           input: (provided) => ({
//             ...provided,
//             marginTop: isFloating ? '8px' : '0',
//           }),
//         }}
//         placeholder=""
//         components={{
//           Option: CustomOption,
//         }}
//         {...restProps}
//       />
//     </div>
//   );
// };

// export default OutlinedSelect;