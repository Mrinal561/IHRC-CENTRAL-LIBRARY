import React, { forwardRef, useState } from 'react';


interface OutlinedInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  isDisabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const OutlinedInput: React.FC<OutlinedInputProps> = ({ label, value, onChange, textarea = false,isDisabled = false, onKeyDown }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isFloating = isFocused || value !== '';

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

      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          className="w-full px-3 py-2 bg-transparent border-none focus:outline-none resize-none"
          rows={4}
          disabled={isDisabled}
        />
      ) : (
       <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
            disabled={isDisabled}
          />
      )}
    </div>
  );
};

export default OutlinedInput;


// import React, { useState, forwardRef } from 'react';

// interface OutlinedInputProps {
//   label: string;
//   value: string;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   textarea?: boolean;
//   isDisabled?: boolean;
//   onFocus?: () => void;
//   onBlur?: () => void;
//   onKeyDown?: (event: React.KeyboardEvent) => void;
// }

// const OutlinedInput = forwardRef<HTMLInputElement, OutlinedInputProps>(({ 
//   label, 
//   value, 
//   onChange, 
//   textarea = false,
//   isDisabled = false,
//   onFocus,
//   onBlur,
//   onKeyDown
// }, ref) => {
//   const [isFocused, setIsFocused] = useState(false);

//   const handleFocus = () => {
//     setIsFocused(true);
//     onFocus?.();
//   };

//   const handleBlur = () => {
//     setIsFocused(false);
//     onBlur?.();
//   };

//   const isFloating = isFocused || value !== '';

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

//       {textarea ? (
//         <textarea
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           onKeyDown={onKeyDown}
//           className="w-full px-3 py-2 bg-transparent border-none focus:outline-none resize-none"
//           rows={4}
//           disabled={isDisabled}
//         />
//       ) : (
//         <input
//           ref={ref}
//           type="text"
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           onKeyDown={onKeyDown}
//           className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
//           disabled={isDisabled}
//         />
//       )}
//     </div>
//   );
// });

// OutlinedInput.displayName = 'OutlinedInput';

// export default OutlinedInput;