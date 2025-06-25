


import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import OutlinedInput from '@/components/ui/OutlinedInput';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { toast, Notification } from '@/components/ui';

interface FunctionData {
  id: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface FunctionAutoSuggestProps {
  value: string;
  onChange: (value: string) => void;
  onFunctionSelect: (id: number | string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
}

const FunctionAutoSuggest: React.FC<FunctionAutoSuggestProps> = ({ 
  value, 
  onChange,
  onFunctionSelect,
  label = "Function",
  placeholder = "Select Function",
  isDisabled
}: FunctionAutoSuggestProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [functions, setFunctions] = useState<FunctionData[]>([]);
  const [filteredFunctions, setFilteredFunctions] = useState<FunctionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchFunctions = async (search = '') => {
    setIsLoading(true);
    try {
      const {data} = await httpClient.get(endpoints.compliances.functionList());
      const functionsData = Array.isArray(data?.data) ? data.data : [data?.data];
      setFunctions(functionsData);
      setFilteredFunctions(functionsData);
    } catch (error) {
      console.error('Error fetching functions:', error);
      setFunctions([])
      setFilteredFunctions([])
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFunctions();
  }, []);

  useEffect(() => {
    const searchFunction = async () => {
        if(!value) {
            setFilteredFunctions(functions);
            return;
        }
        setIsLoading(true);
        try{
             const { data } = await httpClient.get(endpoints.compliances.functionList(), {
          params: { search: value }
        });

        const functionsData = Array.isArray(data?.data) ? data.data : [data?.data];
        setFilteredFunctions(functionsData)

        } catch (error) {
        console.error('Error fetching functions:', error);
        setFilteredFunctions([]);
      } finally {
        setIsLoading(false);
      }
    }
    searchFunction()
  }, [value]);

  const handleCreateFunction = async (funcName: string) => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const response = await httpClient.post(endpoints.compliances.createfunctions(), {
        name: funcName
      });
      
      const newFunction = response.data;
      setFunctions(prev => [...prev, newFunction]);
      onChange(funcName);
      onFunctionSelect(newFunction.id || funcName);
      setIsOpen(false);
      
      toast.push(
        <Notification title="Success" type="success">
          Function created successfully!
        </Notification>
      );
    } catch (error) {
      console.error('Error creating function:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to create function. Please try again.
        </Notification>
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelect = (func: FunctionData) => {
    onChange(func.name);
    onFunctionSelect(func.id || func.name)
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleCreateFunction(value);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <p className="mb-2">{label}</p>
      <div 
        className="relative"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <OutlinedInput
          value={value}
          onChange={(inputValue) => {
            onChange(inputValue);
            setIsOpen(true);
          }}
          label={placeholder}
          isDisabled={isDisabled || isCreating}
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
          disabled={isDisabled || isCreating}
        >
          {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {isLoading ? (
            <div className="p-2 text-gray-500 flex items-center justify-center">
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
              Loading functions...
            </div>
          ) : filteredFunctions.length > 0 ? (
            <ul className="max-h-60 overflow-auto">
              {filteredFunctions.map((func) => (
                <li
                  key={func.id || func.name}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(func)}
                >
                  {func.name}
                </li>
              ))}
            </ul>
          ) : value && !isLoading ? (
            <div 
              className={`p-2 text-gray-600 ${
                isCreating 
                  ? 'cursor-wait bg-gray-50' 
                  : 'cursor-pointer hover:bg-gray-100'
              } flex items-center justify-center`}
              onClick={() => !isCreating && handleCreateFunction(value)}
            >
              {isCreating ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  Creating function "{value}"...
                </>
              ) : (
                <>Press Enter to create function "{value}"</>
              )}
            </div>
          ) : (
            <div className="p-2 text-gray-500">No functions found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FunctionAutoSuggest;