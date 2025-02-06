import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface OutlinedPasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const OutlinedPasswordInput: React.FC<OutlinedPasswordInputProps> = ({ 
  label, 
  value, 
  onChange
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

export default OutlinedPasswordInput;