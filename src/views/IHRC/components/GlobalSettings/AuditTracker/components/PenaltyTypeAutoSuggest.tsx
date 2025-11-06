import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import OutlinedInput from '@/components/ui/OutlinedInput';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { toast, Notification } from '@/components/ui';

interface PenaltyTypeData {
  id: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface PenaltyTypeAutoSuggestProps {
  value: string;
  onChange: (value: string) => void;
  onPenaltySelect: (id: number | string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
}

const PenaltyTypeAutoSuggest: React.FC<PenaltyTypeAutoSuggestProps> = ({ 
  value, 
  onChange,
  onPenaltySelect,
  label = "Penalty Type",
  placeholder = "Select Penalty Type",
  isDisabled
}: PenaltyTypeAutoSuggestProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [penaltyTypes, setPenaltyTypes] = useState<PenaltyTypeData[]>([]);
  const [filteredPenaltyTypes, setFilteredPenaltyTypes] = useState<PenaltyTypeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchPenaltyTypes = async (search = '') => {
    setIsLoading(true);
    try {
      const {data} = await httpClient.get(endpoints.compliances.penaltyTypesList());
      const penaltyTypesData = Array.isArray(data?.data) ? data.data : [data?.data];
      setPenaltyTypes(penaltyTypesData);
      setFilteredPenaltyTypes(penaltyTypesData);
    } catch (error) {
      console.error('Error fetching penalty types:', error);
      setPenaltyTypes([])
      setFilteredPenaltyTypes([])
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPenaltyTypes();
  }, []);

  useEffect(() => {
    const searchPenaltyType = async () => {
        if(!value) {
            setFilteredPenaltyTypes(penaltyTypes);
            return;
        }
        setIsLoading(true);
        try{
             const { data } = await httpClient.get(endpoints.compliances.penaltyTypesList(), {
          params: { search: value }
        });

        const penaltyTypesData = Array.isArray(data?.data) ? data.data : [data?.data];
        setFilteredPenaltyTypes(penaltyTypesData)

        } catch (error) {
        console.error('Error fetching penalty types:', error);
        setFilteredPenaltyTypes([]);
      } finally {
        setIsLoading(false);
      }
    }
    searchPenaltyType()
  }, [value]);

  const handleCreatePenaltyType = async (penaltyName: string) => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const response = await httpClient.post(endpoints.compliances.createpenaltyTypes(), {
        name: penaltyName
      });
      
      const newPenaltyType = response.data;
      setPenaltyTypes(prev => [...prev, newPenaltyType]);
      onChange(penaltyName);
      onPenaltySelect(newPenaltyType.id || penaltyName);
      setIsOpen(false);
      
      toast.push(
        <Notification title="Success" type="success">
          Penalty type created successfully!
        </Notification>
      );
    } catch (error) {
      console.error('Error creating penalty type:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to create penalty type. Please try again.
        </Notification>
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelect = (penalty: PenaltyTypeData) => {
    onChange(penalty.name);
    onPenaltySelect(penalty.id || penalty.name)
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
      handleCreatePenaltyType(value);
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
              Loading penalty types...
            </div>
          ) : filteredPenaltyTypes.length > 0 ? (
            <ul className="max-h-60 overflow-auto">
              {filteredPenaltyTypes.map((penalty) => (
                <li
                  key={penalty.id || penalty.name}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(penalty)}
                >
                  {penalty.name}
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
              onClick={() => !isCreating && handleCreatePenaltyType(value)}
            >
              {isCreating ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  Creating penalty type "{value}"...
                </>
              ) : (
                <>Press Enter to create penalty type "{value}"</>
              )}
            </div>
          ) : (
            <div className="p-2 text-gray-500">No penalty types found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PenaltyTypeAutoSuggest;