import React, { useEffect, useState } from 'react';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import AdaptableCard from '@/components/shared/AdaptableCard';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import DatePicker from '@/components/ui/DatePicker';
import BulkUpload from './components/BulkUpload';
import PFSetupTable from './components/PFSetupTable';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

const frequencyOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
];

const initialPFData = {
  name: '',
  frequency: '',
  firstDueDate: null,
  secondDueDate: null,
  thirdDueDate: null,
  fourthDueDate: null,
};

interface SelectOption {
  value: string
  label: string
}

const PFSetup = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPFId, setCurrentPFId] = useState<string | null>(null);
  const [pfData, setPFData] = useState(initialPFData);
  const [pfTableData, setPFTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [states, setStates] = useState<SelectOption[]>([]);
  const [selectedStates, setSelectedStates] = useState<SelectOption | null>(null);

  const [dateFieldsState, setDateFieldsState] = useState({
    isSecondDateEnabled: false,
    isThirdDateEnabled: false,
    isLastDateEnabled: false
})

const loadStates = async () => {
  try {
    setIsLoading(true);
    const response = await httpClient.get(endpoints.common.getStatesAll())
    
    if (response.data) {
      const formattedStates = response.data.map((state: any) => ({
        label: state.name,
        value: String(state.id)
      }));
      
      console.log('Formatted States:', formattedStates); // Debug log
      setStates(formattedStates);
    } else {
      console.error('Invalid state data structure:', response.data);
      // showNotification('danger', 'Invalid state data received');
    }
  } catch (error) {
    console.error('Failed to load states:', error);
    // showNotification('danger', 'Failed to load states');
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  loadStates();
}, []);


const handleStateChange = (option: SelectOption | null) => {
  setSelectedStates(option);
};

const handleInputChange = (name: string, value: any) => {

  if (name === 'frequency') {
    const frequencyValue = value && typeof value === 'object' && 'value' in value 
      ? value.value 
      : value;
    
    setPFData(prev => {
      const updated = { ...prev, frequency: frequencyValue };
      
      // Reset date fields based on frequency
      switch (frequencyValue) {
        case 'monthly':
        case 'yearly':
          updated.secondDueDate = null;
          updated.thirdDueDate = null;
          updated.fourthDueDate = null;
          setDateFieldsState({
            isSecondDateEnabled: false,
            isThirdDateEnabled: false,
            isLastDateEnabled: false
          });
          break;
        case 'half_yearly':
          updated.secondDueDate = null;
          updated.thirdDueDate = null;
          setDateFieldsState({
            isSecondDateEnabled: false,
            isThirdDateEnabled: false,
            isLastDateEnabled: true
          });
          break;
        case 'quarterly':
          setDateFieldsState({
            isSecondDateEnabled: true,
            isThirdDateEnabled: true,
            isLastDateEnabled: true
          });
          break;
      }
      
      return updated;
    });
  } else if (name in initialPFData) {
    setPFData(prev => ({ ...prev, [name]: value }));
  }
};




  const handleEdit = (pfToEdit) => {
    setIsEditMode(true);
    setCurrentPFId(pfToEdit.id);
    setPFData({
      name: pfToEdit.name,
      frequency: pfToEdit.frequency,
      firstDueDate: pfToEdit.firstDueDate,
      secondDueDate: pfToEdit.secondDueDate,
      thirdDueDate: pfToEdit.thirdDueDate,
      fourthDueDate: pfToEdit.fourthDueDate,
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentPFId(null);
    setPFData(initialPFData);
  };

  const handleConfirm = async () => {
    try {
      // Here you would typically dispatch an action to create or update PF setup
      // For now, we'll just simulate the action
      if (isEditMode && currentPFId) {
        // Update existing PF setup
        toast.push(
          <Notification title="Success" type="success">
            PF Setup updated successfully!
          </Notification>
        );
      } else {
        // Create new PF setup
        toast.push(
          <Notification title="Success" type="success">
            PF Setup created successfully!
          </Notification>
        );
      }
      handleDialogClose();
    } catch (error) {
      // Error handling
      toast.push(
        <Notification title="Error" type="danger">
          Failed to save PF Setup
        </Notification>
      );
    }
  };

  // Helper function to determine if a due date should be disabled
  const isDueDateDisabled = (dateIndex: number) => {
    switch (pfData.frequency) {
      case 'monthly':
      case 'yearly':
        // Only first date is allowed
        return dateIndex > 0;
      case 'half_yearly':
        // First and last dates are allowed
        return dateIndex > 0 && dateIndex < 3;
      case 'quarterly':
        // All dates are allowed
        return false;
      default:
        return true;
    }
  };

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">PF Global Setup</h3>
        </div>
        <div className="flex gap-2">
          <BulkUpload />
          <Button
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={() => setIsDialogOpen(true)}
          >
            Add PF Setup
          </Button>
        </div>
      </div>
      
      <PFSetupTable 
        // Add necessary props
        onEdit={handleEdit}
      />

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-6">{isEditMode ? 'Edit PF Setup' : 'Add PF Setup'}</h5>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">State</label>
              <OutlinedSelect
                        label="Select State"
                        options={states}
                        value={selectedStates}
                        onChange={handleStateChange}
                        // onChange={(selectedOption: SelectOption | null) => {
                            //     // Only allow state selection if scope is 'state'
                            //     if (formData.scope === 'state') {
                                //         handleStateChange(selectedOption);
                                //     }
                        // }}
                        />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">PF Frequency</label>
              <OutlinedSelect
                label="Select PF Frequency"
                options={frequencyOptions}
                value={frequencyOptions.find(option => option.value === pfData.frequency) || null}
                onChange={(value) => handleInputChange('frequency', value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">First Due Date <span className="text-red-500">*</span></label>
              <DatePicker
                className="w-full"
                placeholder="Select first due date"
                value={pfData.firstDueDate}
                onChange={(date) => handleInputChange('firstDueDate', date)}
              />
            </div>
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">Second Due Date</label>
              <DatePicker
                className="w-full"
                placeholder="Select second due date"
                value={pfData.secondDueDate}
                onChange={(date) => handleInputChange('secondDueDate', date)}
                disabled={isDueDateDisabled(1)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">Third Due Date</label>
              <DatePicker
                className="w-full"
                placeholder="Select third due date"
                value={pfData.thirdDueDate}
                onChange={(date) => handleInputChange('thirdDueDate', date)}
                disabled={isDueDateDisabled(2)}
              />
            </div>
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">Fourth Due Date</label>
              <DatePicker
                className="w-full"
                placeholder="Select fourth due date"
                value={pfData.fourthDueDate}
                onChange={(date) => handleInputChange('fourthDueDate', date)}
                disabled={isDueDateDisabled(3)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="plain"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={handleConfirm}>
            {isEditMode ? 'Update' : 'Confirm'}
          </Button>
        </div>
      </Dialog>
    </AdaptableCard>
  );
};

export default PFSetup;