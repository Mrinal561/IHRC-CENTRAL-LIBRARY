import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import OutlinedInput from '@/components/ui/OutlinedInput';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { toast, Notification } from '@/components/ui';

interface CategorizationData {
  id: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ComplianceCategorizationAutoSuggestProps {
  value: string;
  onChange: (value: string) => void;
  onCategorizationSelect: (id: number | string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
}

const ComplianceCategorizationAutoSuggest: React.FC<ComplianceCategorizationAutoSuggestProps> = ({ 
  value, 
  onChange,
  onCategorizationSelect,
  label = "Compliance Categorization",
  placeholder = "Select Compliance Categorization",
  isDisabled
}: ComplianceCategorizationAutoSuggestProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categorizations, setCategorizations] = useState<CategorizationData[]>([]);
  const [filteredCategorizations, setFilteredCategorizations] = useState<CategorizationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchCategorizations = async (search = '') => {
    setIsLoading(true);
    try {
      const {data} = await httpClient.get(endpoints.compliances.complianceCategorizationsList());
      const categorizationsData = Array.isArray(data?.data) ? data.data : [data?.data];
      setCategorizations(categorizationsData);
      setFilteredCategorizations(categorizationsData);
    } catch (error) {
      console.error('Error fetching categorizations:', error);
      setCategorizations([])
      setFilteredCategorizations([])
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorizations();
  }, []);

  useEffect(() => {
    const searchCategorization = async () => {
        if(!value) {
            setFilteredCategorizations(categorizations);
            return;
        }
        setIsLoading(true);
        try{
             const { data } = await httpClient.get(endpoints.compliances.complianceCategorizationsList(), {
          params: { search: value }
        });

        const categorizationsData = Array.isArray(data?.data) ? data.data : [data?.data];
        setFilteredCategorizations(categorizationsData)

        } catch (error) {
        console.error('Error fetching categorizations:', error);
        setFilteredCategorizations([]);
      } finally {
        setIsLoading(false);
      }
    }
    searchCategorization()
  }, [value]);

  const handleCreateCategorization = async (catName: string) => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const response = await httpClient.post(endpoints.compliances.createcomplianceCategorizations(), {
        name: catName
      });
      
      const newCategorization = response.data;
      setCategorizations(prev => [...prev, newCategorization]);
      onChange(catName);
      onCategorizationSelect(newCategorization.id || catName);
      setIsOpen(false);
      
      toast.push(
        <Notification title="Success" type="success">
          Compliance categorization created successfully!
        </Notification>
      );
    } catch (error) {
      console.error('Error creating categorization:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to create compliance categorization. Please try again.
        </Notification>
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelect = (cat: CategorizationData) => {
    onChange(cat.name);
    onCategorizationSelect(cat.id || cat.name)
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
      handleCreateCategorization(value);
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
              Loading categorizations...
            </div>
          ) : filteredCategorizations.length > 0 ? (
            <ul className="max-h-60 overflow-auto">
              {filteredCategorizations.map((cat) => (
                <li
                  key={cat.id || cat.name}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(cat)}
                >
                  {cat.name}
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
              onClick={() => !isCreating && handleCreateCategorization(value)}
            >
              {isCreating ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  Creating categorization "{value}"...
                </>
              ) : (
                <>Press Enter to create categorization "{value}"</>
              )}
            </div>
          ) : (
            <div className="p-2 text-gray-500">No categorizations found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplianceCategorizationAutoSuggest;