import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import OutlinedInput from '@/components/ui/OutlinedInput';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { toast, Notification } from '@/components/ui';

interface ComplianceTypeData {
  id: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ComplianceTypeAutoSuggestProps {
  value: string;
  onChange: (value: string) => void;
  onTypeSelect: (id: number | string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
}

const ComplianceTypeAutoSuggest: React.FC<ComplianceTypeAutoSuggestProps> = ({ 
  value, 
  onChange,
  onTypeSelect,
  label = "Compliance Type",
  placeholder = "Select Compliance Type",
  isDisabled
}: ComplianceTypeAutoSuggestProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [types, setTypes] = useState<ComplianceTypeData[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<ComplianceTypeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchTypes = async (search = '') => {
    setIsLoading(true);
    try {
      const {data} = await httpClient.get(endpoints.compliances.complianceTypeList());
      const typesData = Array.isArray(data?.data) ? data.data : [data?.data];
      setTypes(typesData);
      setFilteredTypes(typesData);
    } catch (error) {
      console.error('Error fetching compliance types:', error);
      setTypes([])
      setFilteredTypes([])
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  useEffect(() => {
    const searchType = async () => {
        if(!value) {
            setFilteredTypes(types);
            return;
        }
        setIsLoading(true);
        try{
             const { data } = await httpClient.get(endpoints.compliances.complianceTypeList(), {
          params: { search: value }
        });

        const typesData = Array.isArray(data?.data) ? data.data : [data?.data];
        setFilteredTypes(typesData)

        } catch (error) {
        console.error('Error fetching compliance types:', error);
        setFilteredTypes([]);
      } finally {
        setIsLoading(false);
      }
    }
    searchType()
  }, [value]);

  const handleCreateType = async (typeName: string) => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const response = await httpClient.post(endpoints.compliances.createcomplianceType(), {
        name: typeName
      });
      
      const newType = response.data;
      setTypes(prev => [...prev, newType]);
      onChange(typeName);
      onTypeSelect(newType.id || typeName);
      setIsOpen(false);
      
      toast.push(
        <Notification title="Success" type="success">
          Compliance type created successfully!
        </Notification>
      );
    } catch (error) {
      console.error('Error creating compliance type:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to create compliance type. Please try again.
        </Notification>
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelect = (type: ComplianceTypeData) => {
    onChange(type.name);
    onTypeSelect(type.id || type.name)
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
      handleCreateType(value);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <p className="mb-2">{label} <span className="text-red-500">*</span></p>
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
              Loading compliance types...
            </div>
          ) : filteredTypes.length > 0 ? (
            <ul className="max-h-60 overflow-auto">
              {filteredTypes.map((type) => (
                <li
                  key={type.id || type.name}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(type)}
                >
                  {type.name}
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
              onClick={() => !isCreating && handleCreateType(value)}
            >
              {isCreating ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  Creating compliance type "{value}"...
                </>
              ) : (
                <>Press Enter to create compliance type "{value}"</>
              )}
            </div>
          ) : (
            <div className="p-2 text-gray-500">No compliance types found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplianceTypeAutoSuggest;