// import React, { ChangeEvent, forwardRef, useState } from 'react';


// interface OutlinedInputProps {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   textarea?: boolean;
//   isDisabled?: boolean;
//    maxCharsPerLine?: number;
//   onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
// }

// const OutlinedInput: React.FC<OutlinedInputProps> = ({ label, value, onChange, textarea = false,isDisabled = false, onKeyDown, maxCharsPerLine }) => {
//   const [isFocused, setIsFocused] = useState(false);

//   const handleFocus = () => setIsFocused(true);
//   const handleBlur = () => setIsFocused(false);

//   const isFloating = isFocused || value !== '';

//   const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
//     if (!maxCharsPerLine) {
//       onChange(e.target.value);
//       return;
//     }

//     const cursorPosition = e.target.selectionStart;
//     const newValue = e.target.value;
//     const lines = newValue.split('\n');
    
//     // Process each line to ensure it doesn't exceed maxCharsPerLine
//     const processedLines = lines.map((line, index) => {
//       // For existing lines (not the current line being edited)
//       if (index < lines.length - 1) {
//         return line.length > maxCharsPerLine ? line.substring(0, maxCharsPerLine) : line;
//       }
//       return line; // Current line being edited will be handled by keyDown
//     });

//     onChange(processedLines.join('\n'));
//   };

//   const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (maxCharsPerLine) {
//       const textarea = e.currentTarget;
//       const cursorPosition = textarea.selectionStart;
//       const valueBeforeCursor = textarea.value.substring(0, cursorPosition);
//       const currentLineStart = valueBeforeCursor.lastIndexOf('\n') + 1;
//       const currentLineLength = cursorPosition - currentLineStart;
//         const linesBeforeCursor = valueBeforeCursor.split('\n');
//           const currentLineIndex = linesBeforeCursor.length - 1;


//         const currentLine = linesBeforeCursor[currentLineIndex];


//       // If current line reaches max chars and user didn't press enter, prevent input
//         if (currentLine.length >= maxCharsPerLine && e.key !== 'Enter' && e.key !== 'Backspace') {
//     e.preventDefault();
//   }
//     }

//     if (onKeyDown) {
//       onKeyDown(e);
//     }
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

//       {textarea ? (
//         <div>
//           <textarea
//             value={value}
//             onChange={handleTextareaChange}
//             onKeyDown={handleTextareaKeyDown}
//             onFocus={handleFocus}
//             onBlur={handleBlur}
//             className="w-full px-3 py-2 bg-transparent border-none focus:outline-none resize-none"
//             rows={4}
//             disabled={isDisabled}
//           />
//           {maxCharsPerLine && (
//             <div className="text-xs text-gray-500 mt-1">
//               Max {maxCharsPerLine} characters per line (press Enter for new line)
//             </div>
//           )}
//         </div>
//       ) : (
//         <input
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
// };

// export default OutlinedInput;












import React, { ChangeEvent, forwardRef, useState } from 'react';

interface OutlinedInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent) => void; 
  textarea?: boolean;
  isDisabled?: boolean;
  maxCharsPerLine?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: boolean; // Add error prop
}

const OutlinedInput: React.FC<OutlinedInputProps> = ({ 
  label, 
  value, 
  onChange, 
  textarea = false,
  isDisabled = false, 
  onKeyDown, 
  maxCharsPerLine,
  error = false // Add error prop with default value
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isFloating = isFocused || value !== '';

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!maxCharsPerLine) {
      onChange(e.target.value);
      return;
    }

    const newValue = e.target.value;
    const lines = newValue.split('\n');
    
    const processedLines = lines.map((line, index) => {
      if (index < lines.length - 1) {
        return line.length > maxCharsPerLine ? line.substring(0, maxCharsPerLine) : line;
      }
      return line;
    });

    onChange(processedLines.join('\n'));
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (maxCharsPerLine) {
      const textarea = e.currentTarget;
      const cursorPosition = textarea.selectionStart;
      const valueBeforeCursor = textarea.value.substring(0, cursorPosition);
      const currentLineStart = valueBeforeCursor.lastIndexOf('\n') + 1;
      const currentLineLength = cursorPosition - currentLineStart;
      const linesBeforeCursor = valueBeforeCursor.split('\n');
      const currentLineIndex = linesBeforeCursor.length - 1;
      const currentLine = linesBeforeCursor[currentLineIndex];

      if (currentLine.length >= maxCharsPerLine && e.key !== 'Enter' && e.key !== 'Backspace') {
        e.preventDefault();
      }
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className="relative">
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

      {textarea ? (
        <div>
          <textarea
            value={value}
            onChange={handleTextareaChange}
            onKeyDown={handleTextareaKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 bg-transparent border-none focus:outline-none resize-none ${error ? 'text-red-600' : ''}`}
            rows={4}
            disabled={isDisabled}
          />
          {maxCharsPerLine && (
            <div className="text-xs text-gray-500 mt-1">
              Max {maxCharsPerLine} characters per line (press Enter for new line)
            </div>
          )}
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          className={`w-full px-3 py-2 bg-transparent border-none focus:outline-none ${error ? 'text-red-600' : ''}`}
          disabled={isDisabled}
        />
      )}
    </div>
  );
};

export default OutlinedInput;