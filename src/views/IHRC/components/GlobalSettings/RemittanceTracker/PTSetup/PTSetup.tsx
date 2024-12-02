import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Dialog, Notification, toast } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import AdaptableCard from '@/components/shared/AdaptableCard';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import DatePicker from '@/components/ui/DatePicker';
import BulkUpload from './components/BulkUpload';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { createPTRCConfig, createPTECConfig, resetPTSetupState } from '@/store/slices/ptConfig/ptConfigSlice';
import { PTECConfigData, PTRCConfigData } from '@/@types/ptConfig';
import PTTable from './components/PTTable';

const frequencyOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
];

const initialPFData = {
  ptEcFrequency: '',
  ptRcFrequency: '',
  ptEcFirstDueDate: null,
  ptEcSecondDueDate: null,
  ptEcThirdDueDate: null,
  ptEcFourthDueDate: null,
  ptRcFirstDueDate: null,
  ptRcSecondDueDate: null,
  ptRcThirdDueDate: null,
  ptRcFourthDueDate: null,
};

interface SelectOption {
  value: string
  label: string
}

const PTSetup = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state: RootState) => state.ptconfig);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPFId, setCurrentPFId] = useState<string | null>(null);
  const [pfData, setPFData] = useState(initialPFData);
  const [pfTableData, setPFTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [states, setStates] = useState<SelectOption[]>([]);
  const [selectedStates, setSelectedStates] = useState<SelectOption | null>(null);
  const [isActive, setIsActive] = useState(false);

  const [dateFieldsState, setDateFieldsState] = useState({
    ptEc: {
      isSecondDateEnabled: false,
      isThirdDateEnabled: false,
      isLastDateEnabled: false
    },
    ptRc: {
      isSecondDateEnabled: false,
      isThirdDateEnabled: false,
      isLastDateEnabled: false
    }
  });

   const loadStates = async () => {
         setIsLoading(true);
         const response = await httpClient.get(endpoints.common.getStatesAll()) 
       try {
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
    if (name === 'ptEcFrequency' || name === 'ptRcFrequency') {
      const frequencyValue = value && typeof value === 'object' && 'value' in value 
        ? value.value 
        : value;
      
      setPFData(prev => {
        const updated = { ...prev, [name]: frequencyValue };
        
        // Reset date fields and update date field states based on frequency
        const updateDateFields = (prefix: 'ptEc' | 'ptRc') => {
          switch (frequencyValue) {
            case 'monthly':
            case 'yearly':
              updated[`${prefix}SecondDueDate`] = null;
              updated[`${prefix}ThirdDueDate`] = null;
              updated[`${prefix}FourthDueDate`] = null;
              setDateFieldsState(prev => ({
                ...prev,
                [prefix]: {
                  isSecondDateEnabled: false,
                  isThirdDateEnabled: false,
                  isLastDateEnabled: false
                }
              }));
              break;
            case 'half_yearly':
              updated[`${prefix}SecondDueDate`] = null;
              updated[`${prefix}ThirdDueDate`] = null;
              setDateFieldsState(prev => ({
                ...prev,
                [prefix]: {
                  isSecondDateEnabled: false,
                  isThirdDateEnabled: false,
                  isLastDateEnabled: true
                }
              }));
              break;
            case 'quarterly':
              setDateFieldsState(prev => ({
                ...prev,
                [prefix]: {
                  isSecondDateEnabled: true,
                  isThirdDateEnabled: true,
                  isLastDateEnabled: true
                }
              }));
              break;
          }
        };

        if (name === 'ptEcFrequency') {
          updateDateFields('ptEc');
        } else {
          updateDateFields('ptRc');
        }
        
        return updated;
      });
    } else if (name in initialPFData) {
      setPFData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Helper function to determine if a due date should be disabled
  const isDueDateDisabled = (prefix: 'ptEc' | 'ptRc', dateIndex: number) => {
    const frequency = prefix === 'ptEc' ? pfData.ptEcFrequency : pfData.ptRcFrequency;
    
    switch (frequency) {
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

  const handleEdit = (pfToEdit) => {
    setIsEditMode(true);
    setCurrentPFId(pfToEdit.id);
    setPFData({
      ptEcFrequency: pfToEdit.ptEcFrequency,
      ptRcFrequency: pfToEdit.ptRcFrequency,
      ptEcFirstDueDate: pfToEdit.ptEcFirstDueDate,
      ptEcSecondDueDate: pfToEdit.ptEcSecondDueDate,
      ptEcThirdDueDate: pfToEdit.ptEcThirdDueDate,
      ptEcFourthDueDate: pfToEdit.ptEcFourthDueDate,
      ptRcFirstDueDate: pfToEdit.ptRcFirstDueDate,
      ptRcSecondDueDate: pfToEdit.ptRcSecondDueDate,
      ptRcThirdDueDate: pfToEdit.ptRcThirdDueDate,
      ptRcFourthDueDate: pfToEdit.ptRcFourthDueDate
    });
    setIsDialogOpen(true);
  
    // Update date fields state based on frequencies
    setDateFieldsState({
      ptEc: {
        isSecondDateEnabled: pfToEdit.ptEcFrequency === 'quarterly',
        isThirdDateEnabled: pfToEdit.ptEcFrequency === 'quarterly',
        isLastDateEnabled: 
          pfToEdit.ptEcFrequency === 'quarterly' || 
          pfToEdit.ptEcFrequency === 'half_yearly'
      },
      ptRc: {
        isSecondDateEnabled: pfToEdit.ptRcFrequency === 'quarterly',
        isThirdDateEnabled: pfToEdit.ptRcFrequency === 'quarterly',
        isLastDateEnabled: 
          pfToEdit.ptRcFrequency === 'quarterly' || 
          pfToEdit.ptRcFrequency === 'half_yearly'
      }
    });
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentPFId(null);
    
    // Reset to initial state
    setPFData(initialPFData);
    
    // Reset date fields state
    setDateFieldsState({
      ptEc: {
        isSecondDateEnabled: false,
        isThirdDateEnabled: false,
        isLastDateEnabled: false
      },
      ptRc: {
        isSecondDateEnabled: false,
        isThirdDateEnabled: false,
        isLastDateEnabled: false
      }
    });
  };
  
  const handleConfirm = async () => {
    // Validation checks
    const validateForm = () => {
      // Check if state is selected
      if (!selectedStates) {
        toast.push(
          <Notification title="Validation Error" type="danger">
            Please select a state
          </Notification>
        );
        return false;
      }
  
      // Check if frequencies are selected
      if (!pfData.ptEcFrequency) {
        toast.push(
          <Notification title="Validation Error" type="danger">
            Please select PT EC Frequency
          </Notification>
        );
        return false;
      }
  
      if (!pfData.ptRcFrequency) {
        toast.push(
          <Notification title="Validation Error" type="danger">
            Please select PT RC Frequency
          </Notification>
        );
        return false;
      }
  
      // Check if first due dates are selected
      if (!pfData.ptEcFirstDueDate) {
        toast.push(
          <Notification title="Validation Error" type="danger">
            Please select PT EC First Due Date
          </Notification>
        );
        return false;
      }
  
      if (!pfData.ptRcFirstDueDate) {
        toast.push(
          <Notification title="Validation Error" type="danger">
            Please select PT RC First Due Date
          </Notification>
        );
        return false;
      }
  
      return true;
    };
  
    // If validation fails, stop further processing
    if (!validateForm()) {
      return;
    }
  
    try {
      // Prepare PTEC Config Data
      const ptecConfigData: PTECConfigData = {
        payment_mode: 'online', // You might want to make this dynamic
        frequency: pfData.ptEcFrequency as 'monthly' | 'half_yearly' | 'yearly' | 'quarterly',
        payment_due_date: {
          first_date: pfData.ptEcFirstDueDate || '',
          second_date: pfData.ptEcSecondDueDate || '',
          third_date: pfData.ptEcThirdDueDate || '',
          last_date: pfData.ptEcFourthDueDate || ''
        },
        active: true,
        state_id: selectedStates?.value
      };

      // Prepare PTRC Config Data
      const ptrcConfigData: PTRCConfigData = {
        payment_mode: 'online', // You might want to make this dynamic
        frequency: pfData.ptRcFrequency as 'monthly' | 'half_yearly' | 'yearly' | 'quarterly',
        payment_due_date: {
          first_date: pfData.ptRcFirstDueDate || '',
          second_date: pfData.ptRcSecondDueDate || '',
          third_date: pfData.ptRcThirdDueDate || '',
          last_date: pfData.ptRcFourthDueDate || ''
        },
        active: true,
        state_id: selectedStates?.value
      };

      // Dispatch PTEC and PTRC creation actions
      const ptecResult = await dispatch(createPTECConfig(ptecConfigData)).unwrap();
      const ptrcResult = await dispatch(createPTRCConfig(ptrcConfigData)).unwrap();

      // Show success notification
      toast.push(
        <Notification title="Success" type="success">
          PT Setup created successfully!
        </Notification>
      );

      // Close dialog and reset form
      handleDialogClose();

      // Reset Redux state
      dispatch(resetPTSetupState());

    } catch (error) {
      console.error('Error in PT Setup submission:', error);
      
      toast.push(
        <Notification title="Error" type="danger">
          Failed to save PT Setup. Please try again.
        </Notification>
      );

      // Reset Redux state
      dispatch(resetPTSetupState());
    }
  };


  useEffect(() => {
    if (success) {
      toast.push(
        <Notification title="Success" type="success">
          PT Setup created successfully!
        </Notification>
      );
      dispatch(resetPTSetupState());
    }

    if (error) {
      toast.push(
        <Notification title="Error" type="danger">
          {error}
        </Notification>
      );
      dispatch(resetPTSetupState());
    }
  }, [success, error, dispatch]);

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">PT Global Setup</h3>
        </div>
        <div className="flex gap-2">
          {/* <BulkUpload /> */}
          <Button
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={() => setIsDialogOpen(true)}
          >
            Add PT Setup
          </Button>
        </div>
      </div>
      
      <PTTable 
        // Add necessary props
        onEdit={handleEdit}
      />

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
        width={1200}
        height={600}
      >
        <h5 className="mb-6">{isEditMode ? 'Edit PT Setup' : 'Add PT Setup'}</h5>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">State</label>
              <OutlinedSelect
                label="Select State"
                options={states}
                value={selectedStates}
                onChange={handleStateChange}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">PT EC Frequency</label>
              <OutlinedSelect
                label="Select PT EC Frequency"
                options={frequencyOptions}
                value={frequencyOptions.find(option => option.value === pfData.ptEcFrequency) || null}
                onChange={(value) => handleInputChange('ptEcFrequency', value)}
              />
            </div>
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">PT RC Frequency</label>
              <OutlinedSelect
                label="Select PT RC Frequency"
                options={frequencyOptions}
                value={frequencyOptions.find(option => option.value === pfData.ptRcFrequency) || null}
                onChange={(value) => handleInputChange('ptRcFrequency', value)}
              />
            </div>
          </div>

          <div className='flex gap-4 w-full'>

          <div className="mb-4 w-full">
            <h4 className="text-lg font-semibold mb-4">PT EC Due Dates</h4>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">PT EC First Due Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className="w-full"
                  placeholder="Select PT EC first due date"
                  value={pfData.ptEcFirstDueDate}
                  onChange={(date) => handleInputChange('ptEcFirstDueDate', date)}
                />
              </div>
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">PT EC Second Due Date</label>
                <DatePicker
                  className="w-full"
                  placeholder="Select PT EC second due date"
                  value={pfData.ptEcSecondDueDate}
                  onChange={(date) => handleInputChange('ptEcSecondDueDate', date)}
                  disabled={isDueDateDisabled('ptEc', 1)}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">PT EC Third Due Date</label>
                <DatePicker
                  className="w-full"
                  placeholder="Select PT EC third due date"
                  value={pfData.ptEcThirdDueDate}
                  onChange={(date) => handleInputChange('ptEcThirdDueDate', date)}
                  disabled={isDueDateDisabled('ptEc', 2)}
                />
              </div>
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">PT EC Fourth Due Date</label>
                <DatePicker
                  className="w-full"
                  placeholder="Select PT EC fourth due date"
                  value={pfData.ptEcFourthDueDate}
                  onChange={(date) => handleInputChange('ptEcFourthDueDate', date)}
                  disabled={isDueDateDisabled('ptEc', 3)}
                />
              </div>
            </div>
          </div>

          <div className="mb-4 w-full">
            <h4 className="text-lg font-semibold mb-4">PT RC Due Dates</h4>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">PT RC First Due Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className="w-full"
                  placeholder="Select PT RC first due date"
                  value={pfData.ptRcFirstDueDate}
                  onChange={(date) => handleInputChange('ptRcFirstDueDate', date)}
                />
              </div>
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">PT RC Second Due Date</label>
                <DatePicker
                  className="w-full"
                  placeholder="Select PT RC second due date"
                  value={pfData.ptRcSecondDueDate}
                  onChange={(date) => handleInputChange('ptRcSecondDueDate', date)}
                  disabled={isDueDateDisabled('ptRc', 1)}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">PT RC Third Due Date</label>
                <DatePicker
                  className="w-full"
                  placeholder="Select PT RC third due date"
                  value={pfData.ptRcThirdDueDate}
                  onChange={(date) => handleInputChange('ptRcThirdDueDate', date)}
                  disabled={isDueDateDisabled('ptRc', 2)}
                />
              </div>
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">PT RC Fourth Due Date</label>
                <DatePicker
                  className="w-full"
                  placeholder="Select PT RC fourth due date"
                  value={pfData.ptRcFourthDueDate}
                  onChange={(date) => handleInputChange('ptRcFourthDueDate', date)}
                  disabled={isDueDateDisabled('ptRc', 3)}
                />
              </div>
            </div>
          </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isActive}
              onChange={(checked) => setIsActive(checked)}
            />
            <label className="text-gray-600">
              Is PT applicable for Selected State
            </label>
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

export default PTSetup;