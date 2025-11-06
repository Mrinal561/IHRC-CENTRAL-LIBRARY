import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import OutlinedInput from '@/components/ui/OutlinedInput';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { toast, Notification } from '@/components/ui';

interface ApplicabilityData {
  id: number;
  name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ComplianceApplicabilityAutoSuggestProps {
  value: string;
  onChange: (value: string) => void;
  onApplicabilitySelect: (id: number | string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
}

const ComplianceApplicabilityAutoSuggest: React.FC<ComplianceApplicabilityAutoSuggestProps> = ({ 
  value, 
  onChange,
  onApplicabilitySelect,
  label = "Compliance Applicability",
  placeholder = "Select Compliance Applicability",
  isDisabled
}: ComplianceApplicabilityAutoSuggestProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [applicabilities, setApplicabilities] = useState<ApplicabilityData[]>([]);
  const [filteredApplicabilities, setFilteredApplicabilities] = useState<ApplicabilityData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchApplicabilities = async (search = '') => {
    setIsLoading(true);
    try {
      const {data} = await httpClient.get(endpoints.compliances.complianceApplicabilityList());
      const applicabilitiesData = Array.isArray(data?.data) ? data.data : [data?.data];
      setApplicabilities(applicabilitiesData);
      setFilteredApplicabilities(applicabilitiesData);
    } catch (error) {
      console.error('Error fetching applicabilities:', error);
      setApplicabilities([])
      setFilteredApplicabilities([])
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicabilities();
  }, []);

  useEffect(() => {
    const searchApplicability = async () => {
        if(!value) {
            setFilteredApplicabilities(applicabilities);
            return;
        }
        setIsLoading(true);
        try{
             const { data } = await httpClient.get(endpoints.compliances.complianceApplicabilityList(), {
          params: { search: value }
        });

        const applicabilitiesData = Array.isArray(data?.data) ? data.data : [data?.data];
        setFilteredApplicabilities(applicabilitiesData)

        } catch (error) {
        console.error('Error fetching applicabilities:', error);
        setFilteredApplicabilities([]);
      } finally {
        setIsLoading(false);
      }
    }
    searchApplicability()
  }, [value]);

  const handleCreateApplicability = async (appName: string) => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const response = await httpClient.post(endpoints.compliances.createcomplianceApplicability(), {
        name: appName
      });
      
      const newApplicability = response.data;
      setApplicabilities(prev => [...prev, newApplicability]);
      onChange(appName);
      onApplicabilitySelect(newApplicability.id || appName);
      setIsOpen(false);
      
      toast.push(
        <Notification title="Success" type="success">
          Compliance applicability created successfully!
        </Notification>
      );
    } catch (error) {
      console.error('Error creating applicability:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to create compliance applicability. Please try again.
        </Notification>
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelect = (app: ApplicabilityData) => {
    onChange(app.name);
    onApplicabilitySelect(app.id || app.name)
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
      handleCreateApplicability(value);
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
              Loading applicabilities...
            </div>
          ) : filteredApplicabilities.length > 0 ? (
            <ul className="max-h-60 overflow-auto">
              {filteredApplicabilities.map((app) => (
                <li
                  key={app.id || app.name}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(app)}
                >
                  {app.name}
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
              onClick={() => !isCreating && handleCreateApplicability(value)}
            >
              {isCreating ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  Creating applicability "{value}"...
                </>
              ) : (
                <>Press Enter to create applicability "{value}"</>
              )}
            </div>
          ) : (
            <div className="p-2 text-gray-500">No applicabilities found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplianceApplicabilityAutoSuggest;