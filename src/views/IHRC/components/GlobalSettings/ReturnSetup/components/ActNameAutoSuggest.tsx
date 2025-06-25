// ActNameAutosuggest.tsx
import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import OutlinedInput from '@/components/ui/OutlinedInput';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { toast, Notification } from '@/components/ui';

interface Act {
  id?: number;
  act_name: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ActOption {
  value: string;
  label: string;
  originalId: number;
}

interface ActNameAutoSuggestProps {
  value: string;
  onChange: (value: string) => void;
  onActSelect: (id: number | string) => void;
  options?: ActOption[]; // Add this
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
}


const ActNameAutoSuggest = ({ 
  value, 
  onChange,
  onActSelect,
  options = [], // Add default value
  label = "Act Name",
  placeholder = "Enter Act Name",
  isDisabled
}: ActNameAutoSuggestProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [acts, setActs] = useState<Act[]>([]);
  const [filteredActs, setFilteredActs] = useState<Act[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchAllActs = async () => {
    setIsLoading(true);
    try {
      const { data } = await httpClient.get(endpoints.return.listactname());
      const actsData = Array.isArray(data?.data) ? data.data : [data?.data];
      setActs(actsData);
      setFilteredActs(actsData);
    } catch (error) {
      console.error('Error fetching acts:', error);
      setActs([]);
      setFilteredActs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllActs();
  }, []);

  useEffect(() => {
    const searchActs = async () => {
      if (!value) {
        setFilteredActs(acts);
        return;
      }

      setIsLoading(true);
      try {
        const { data } = await httpClient.get(endpoints.return.listactname(), {
          params: { search: value }
        });
        const actsData = Array.isArray(data?.data) ? data.data : [data?.data];
        setFilteredActs(actsData);
      } catch (error) {
        console.error('Error fetching acts:', error);
        setFilteredActs([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchActs();
  }, [value]);

  const handleCreateAct = async (actName: string) => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const { data } = await httpClient.post(endpoints.return.createActName(), {
        act_name: actName
      });
      
      const newAct = data;
      setActs(prev => [...prev, newAct]);
      onChange(actName);
      onActSelect(newAct.id || actName);
      setIsOpen(false);
      
      toast.push(
        <Notification title="Success" type="success">
          Act created successfully!
        </Notification>
      );
    } catch (error) {
      console.error('Error creating act:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to create act. Please try again.
        </Notification>
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelect = (act: Act) => {
    onChange(act.act_name);
    onActSelect(act.id || act.act_name);
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleCreateAct(value);
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
              Loading acts...
            </div>
          ) : filteredActs.length > 0 ? (
            <ul className="max-h-60 overflow-auto">
              {filteredActs.map((act) => (
                <li
                  key={act.id || act.act_name}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(act)}
                >
                  {act.act_name}
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
              onClick={() => !isCreating && handleCreateAct(value)}
            >
              {isCreating ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  Creating act "{value}"...
                </>
              ) : (
                <>Press Enter to create act "{value}"</>
              )}
            </div>
          ) : (
            <div className="p-2 text-gray-500">No acts found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActNameAutoSuggest;