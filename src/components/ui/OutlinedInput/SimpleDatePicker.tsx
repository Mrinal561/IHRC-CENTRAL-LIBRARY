// import React, { useState, useRef, useEffect } from 'react';

// const SimpleDatePicker = ({ value, onChange, placeholder, disabled, className }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const wrapperRef = useRef(null);

//   // Generate numbers 1-31 for the calendar
//   const dates = Array.from({ length: 31 }, (_, i) => i + 1);

//   // Handle click outside to close the picker
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Handle date selection
//   const handleDateSelect = (date) => {
//     const now = new Date();
//     const selectedDate = new Date(now.getFullYear(), now.getMonth(), date);
//     onChange?.(selectedDate);
//     setIsOpen(false);
//   };

//   // Format the displayed date
//   const formatDisplayDate = (date) => {
//     return date ? date.getDate().toString() : '';
//   };

//   return (
//     <div className="relative w-full" ref={wrapperRef}>
//       <input
//         type="text"
//         className={`w-full h-11 px-4 rounded-md ${
//           disabled 
//             ? 'bg-gray-50 border border-gray-200 text-gray-400'
//             : 'bg-white border border-gray-300 hover:border-gray-400'
//         } ${className}`}
//         value={value ? formatDisplayDate(value) : ''}
//         placeholder={placeholder || 'Select date'}
//         onClick={() => !disabled && setIsOpen(!isOpen)}
//         readOnly
//         disabled={disabled}
//       />
      
//       {isOpen && (
//         <div className="absolute z-50 mt-1 bg-white border rounded-md shadow-lg w-64">
//           <div className="grid grid-cols-7 gap-2 p-4">
//             {dates.map((date) => (
//               <button
//                 key={date}
//                 className={`h-8 w-8 flex items-center justify-center text-sm
//                   ${value && value.getDate() === date 
//                     ? 'bg-indigo-600 text-white rounded-md' 
//                     : 'text-gray-600 hover:bg-gray-100 rounded-md'
//                   }
//                   ${date <= 7 ? 'text-gray-400' : ''}
//                 `}
//                 onClick={() => handleDateSelect(date)}
//               >
//                 {date}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SimpleDatePicker;

// import React, { useState, useRef, useEffect } from 'react';

// const SimpleDatePicker = ({ value, onChange, placeholder, disabled, className }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const wrapperRef = useRef(null);

//   // Get the number of days in the current month
//   const getDaysInMonth = (date) => {
//     return new Date(
//       date.getFullYear(),
//       date.getMonth() + 1,
//       0
//     ).getDate();
//   };

//   // Generate dates array based on current month
//   const getDates = () => {
//     const now = value || new Date();
//     const daysInMonth = getDaysInMonth(now);
//     return Array.from({ length: daysInMonth }, (_, i) => i + 1);
//   };

//   // Handle click outside to close the picker
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Handle date selection
//   const handleDateSelect = (date) => {
//     const now = value || new Date();
//     const selectedDate = new Date(now.getFullYear(), now.getMonth(), date);
    
//     // Validate if the date is valid for the current month
//     if (selectedDate.getMonth() === now.getMonth()) {
//       onChange?.(selectedDate);
//       setIsOpen(false);
//     }
//   };

//   // Format the displayed date
//   const formatDisplayDate = (date) => {
//     if (!date) return '';
//     return new Intl.DateTimeFormat('en-US', { 
//       day: 'numeric',
//       month: 'short'
//     }).format(date);
//   };

//   const dates = getDates();

//   return (
//     <div className="relative w-full" ref={wrapperRef}>
//       <input
//         type="text"
//         className={`w-full h-11 px-4 rounded-md ${
//           disabled 
//             ? 'bg-gray-50 border border-gray-200 text-gray-400'
//             : 'bg-white border border-gray-300 hover:border-gray-400'
//         } ${className}`}
//         value={formatDisplayDate(value)}
//         placeholder={placeholder || 'Select date'}
//         onClick={() => !disabled && setIsOpen(!isOpen)}
//         readOnly
//         disabled={disabled}
//       />
      
//       {isOpen && (
//         <div className="absolute z-50 mt-1 bg-white border rounded-md shadow-lg w-64">
//           <div className="grid grid-cols-7 gap-2 p-4">
//             {dates.map((date) => (
//               <button
//                 key={date}
//                 className={`h-8 w-8 flex items-center justify-center text-sm
//                   ${value && value.getDate() === date 
//                     ? 'bg-indigo-600 text-white rounded-md' 
//                     : 'text-gray-600 hover:bg-gray-100 rounded-md'
//                   }
//                   ${date <= 7 ? 'text-gray-400' : ''}
//                 `}
//                 onClick={() => handleDateSelect(date)}
//               >
//                 {date}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SimpleDatePicker;

import React, { useState, useRef, useEffect } from 'react';

const SimpleDatePicker = ({ value, onChange, placeholder, disabled, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Get the number of days in the current month
  const getDaysInMonth = (date) => {
    return new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
  };

  // Generate dates array based on current month
  const getDates = () => {
    const now = value || new Date();
    const daysInMonth = getDaysInMonth(now);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  // Handle click outside to close the picker
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle date selection
  const handleDateSelect = (date) => {
    const now = value || new Date();
    const selectedDate = new Date(now.getFullYear(), now.getMonth(), date);
    
    // Validate if the date is valid for the current month
    if (selectedDate.getMonth() === now.getMonth()) {
      onChange?.(selectedDate);
      setIsOpen(false);
    }
  };

  // Format the displayed date to show only the day
  const formatDisplayDate = (date) => {
    if (!date) return '';
    return date.getDate().toString();
  };

  const dates = getDates();

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        className={`w-full h-11 px-4 rounded-md ${
          disabled 
            ? 'bg-gray-50 border border-gray-200 text-gray-400'
            : 'bg-white border border-gray-300 hover:border-gray-400'
        } ${className}`}
        value={formatDisplayDate(value)}
        placeholder={placeholder || 'Select day'}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        readOnly
        disabled={disabled}
      />
      
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border rounded-md shadow-lg w-64">
          <div className="grid grid-cols-7 gap-2 p-4">
            {dates.map((date) => (
              <button
                key={date}
                className={`h-8 w-8 flex items-center justify-center text-sm
                  ${value && value.getDate() === date
                    ? 'bg-indigo-600 text-white rounded-md'
                    : 'text-gray-600 hover:bg-gray-100 rounded-md'
                  }
                  ${date <= 7 ? 'text-gray-400' : ''}
                `}
                onClick={() => handleDateSelect(date)}
              >
                {date}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleDatePicker;