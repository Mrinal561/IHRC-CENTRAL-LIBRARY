import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Dialog, Notification, toast } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import AdaptableCard from '@/components/shared/AdaptableCard';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import DatePicker from '@/components/ui/DatePicker';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

import OutlinedInput from '@/components/ui/OutlinedInput';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { 
  createPTConfig, 
  fetchPTConfigs, 
  resetPTSetupState 
} from '@/store/slices/ptConfig/ptConfigSlice';
import { PTConfigData } from '@/@types/ptConfig';
import PTTable from './components/PTTable';
import { showErrorNotification } from '@/components/ui/ErrorMessage';

const frequencyOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
];

const initialPTData = {
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
  value: string;
  label: string;
}

const PTSetup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('')
  const { loading, error, success } = useSelector((state: RootState) => state.ptconfig);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [currentPTId, setCurrentPTId] = useState<string | null>(null);
  const [ptData, setPTData] = useState(initialPTData);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [isActive, setIsActive] = useState(false);


  const [ptecpaymentDueDates, setPTECPaymentDueDates] = useState({
    firstDate: null,
    secondDate: null,
    thirdDate: null,
    lastDate: null
  });
  const [ptrcpaymentDueDates, setPTRCPaymentDueDates] = useState({
    firstDate: null,
    secondDate: null,
    thirdDate: null,
    lastDate: null
  });
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

  const handleSearch = (value: string) => {
    setSearchTerm(value)
}

  const loadStates = async () => {
    try {
      const response = await httpClient.get(endpoints.common.getStatesAll());
      if (response.data) {
        const formattedStates = response.data.map((state: any) => ({
          label: state.name,
          value: String(state.id)
        }));
        setStates(formattedStates);
      }
    } catch (error) {
      console.error('Failed to load states:', error);
      toast.push(
        <Notification title="Error" type="danger">
          Failed to load states
        </Notification>
      );
    }
  };

  useEffect(() => {
    loadStates();
  }, []);

  const handleStateChange = (option: SelectOption | null) => {
    setSelectedState(option);
  };

  const handleInputChange = (name: string, value: any) => {
    if (name === 'ptEcFrequency' || name === 'ptRcFrequency') {
      const frequencyValue = value && typeof value === 'object' && 'value' in value 
        ? value.value 
        : value;
      
      setPTData(prev => {
        const updated = { ...prev, [name]: frequencyValue };
        
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
    } else if (name in initialPTData) {
      setPTData(prev => ({ ...prev, [name]: value }));
    }
  };

  const isDueDateDisabled = (prefix: 'ptEc' | 'ptRc', dateIndex: number) => {
    const frequency = prefix === 'ptEc' ? ptData.ptEcFrequency : ptData.ptRcFrequency;
    
    switch (frequency) {
      case 'monthly':
      case 'yearly':
        return dateIndex > 0;
      case 'half_yearly':
        return dateIndex > 0 && dateIndex < 3;
      case 'quarterly':
        return false;
      default:
        return true;
    }
  };

  const handleEdit = (ptToEdit: any) => {
    setIsEditMode(true);
    setCurrentPTId(ptToEdit.id);
    setPTData({
      ptEcFrequency: ptToEdit.ptEcFrequency,
      ptRcFrequency: ptToEdit.ptRcFrequency,
      ptEcFirstDueDate: ptToEdit.ptEcFirstDueDate,
      ptEcSecondDueDate: ptToEdit.ptEcSecondDueDate,
      ptEcThirdDueDate: ptToEdit.ptEcThirdDueDate,
      ptEcFourthDueDate: ptToEdit.ptEcFourthDueDate,
      ptRcFirstDueDate: ptToEdit.ptRcFirstDueDate,
      ptRcSecondDueDate: ptToEdit.ptRcSecondDueDate,
      ptRcThirdDueDate: ptToEdit.ptRcThirdDueDate,
      ptRcFourthDueDate: ptToEdit.ptRcFourthDueDate
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentPTId(null);
    setPTData(initialPTData);
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
    const validateForm = () => {
      if (!selectedState) {
        toast.push(
          <Notification title="Validation Error" type="danger">
            Please select a state
          </Notification>
        );
        return false;
      }
  
      if (!ptData.ptEcFrequency || !ptData.ptRcFrequency) {
        toast.push(
          <Notification title="Validation Error" type="danger">
            Please select frequencies for both PT EC and PT RC
          </Notification>
        );
        return false;
      }
  
      if (!ptData.ptEcFirstDueDate || !ptData.ptRcFirstDueDate) {
        toast.push(
          <Notification title="Validation Error" type="danger">
            Please select first due dates for both PT EC and PT RC
          </Notification>
        );
        return false;
      }
  
      return true;
    };
  
    if (!validateForm()) return;
  
    const prepareDueDates = (frequency: string, dates: {
      firstDueDate: any, 
      secondDueDate: any, 
      thirdDueDate: any, 
      fourthDueDate: any
    }) => {
      switch (frequency) {
        case 'monthly':
          return {
            first_date: dates.firstDueDate || '',
            second_date: null,
            third_date: null,
            last_date: null
          };
        case 'yearly':
          return {
            first_date: dates.firstDueDate || '',
            second_date: null,
            third_date: null,
            last_date: null
          };
        case 'half_yearly':
          return {
            first_date: dates.firstDueDate || '',
            second_date: null,
            third_date: null,
            last_date: dates.fourthDueDate || ''
          };
        case 'quarterly':
          return {
            first_date: dates.firstDueDate || '',
            second_date: dates.secondDueDate || '',
            third_date: dates.thirdDueDate || '',
            last_date: dates.fourthDueDate || ''
          };
        default:
          return {
            first_date: '',
            second_date: null,
            third_date: null,
            last_date: null
          };
      }
    };
  
    try {
      const ptConfigData: PTConfigData = {
        ptec_payment_mode: 'online',
        ptrc_payment_mode: 'online',
        ptec_frequency: ptData.ptEcFrequency as 'monthly' | 'half_yearly' | 'yearly' | 'quarterly',
        ptrc_frequency: ptData.ptRcFrequency as 'monthly' | 'half_yearly' | 'yearly' | 'quarterly',
        ptec_payment_due_date: prepareDueDates(ptData.ptEcFrequency, {
          firstDueDate: ptData.ptEcFirstDueDate,
          secondDueDate: ptData.ptEcSecondDueDate,
          thirdDueDate: ptData.ptEcThirdDueDate,
          fourthDueDate: ptData.ptEcFourthDueDate
        }),
        ptrc_payment_due_date: prepareDueDates(ptData.ptRcFrequency, {
          firstDueDate: ptData.ptRcFirstDueDate,
          secondDueDate: ptData.ptRcSecondDueDate,
          thirdDueDate: ptData.ptRcThirdDueDate,
          fourthDueDate: ptData.ptRcFourthDueDate
        }),
        active: isActive,
        state_id: selectedState?.value
      };
  
      const result = await dispatch(createPTConfig(ptConfigData))
      .unwrap()
      .catch((error: any) => {
        console.error('Full error object:', error);
        console.error('Error response:', error.response);
        console.error('Error message:', error.message);
        
        if (error.response?.data?.message) {
          showErrorNotification(error.response.data.message)
        } else if (error.message) {
          showErrorNotification(error.message)
        } else {
          // showErrorNotification('An unexpected error occurred. Please try again.')
          showErrorNotification(error);

        }
        throw error;
      });
  
     
  if(result) {

    handleDialogClose();
    dispatch(resetPTSetupState());
    dispatch(fetchPTConfigs({ page: 1, page_size: 10 }));
    setRefreshCounter(prev => prev + 1);   }
  
    } catch (error) {
      console.error('Error in PT Setup submission:', error);
      // showErrorNotification(error);
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
      <div className="mb-4 lg:mb-0 flex justify-between w-full">
          <h3 className="text-2xl font-bold">PT Global Setup</h3>
          <div className="flex items-center gap-4">
                        <OutlinedInput
                            label="Search By State Name"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e)}
                        />
                         </div>
        </div>
        <div className="flex gap-2">
          {/* <Button
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={() => setIsDialogOpen(true)}
          >
            Edit PT Setup
          </Button> */}
        </div>
      </div>
      
      <PTTable  search={searchTerm} onEdit={handleEdit} refreshTrigger={refreshCounter}/>

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
        width={1200}
        height={600}
      >
        <h5 className="mb-6">{'Edit PT Setup'}</h5>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">State</label>
              <OutlinedSelect
                label="Select State"
                options={states}
                value={selectedState}
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
                value={frequencyOptions.find(option => option.value === ptData.ptEcFrequency) || null}
                onChange={(value) => handleInputChange('ptEcFrequency', value)}
              />
            </div>
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">PT RC Frequency</label>
              <OutlinedSelect
                label="Select PT RC Frequency"
                options={frequencyOptions}
                value={frequencyOptions.find(option => option.value === ptData.ptRcFrequency) || null}
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
                  value={ptData.ptEcFirstDueDate}
                  onChange={(date) => handleInputChange('ptEcFirstDueDate', date)}
                />
              </div>
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">PT EC Second Due Date</label>
                <DatePicker
                  className="w-full"
                  placeholder="Select PT EC second due date"
                  value={ptData.ptEcSecondDueDate}
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
                  value={ptData.ptEcThirdDueDate}
                  onChange={(date) => handleInputChange('ptEcThirdDueDate', date)}
                  disabled={isDueDateDisabled('ptEc', 2)}
                />
              </div>
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">PT EC Fourth Due Date</label>
                <DatePicker
                  className="w-full"
                  placeholder="Select PT EC fourth due date"
                  value={ptData.ptEcFourthDueDate}
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
                  value={ptData.ptRcFirstDueDate}
                  onChange={(date) => handleInputChange('ptRcFirstDueDate', date)}
                />
              </div>
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">PT RC Second Due Date</label>
                <DatePicker
                  className="w-full"
                  placeholder="Select PT RC second due date"
                  value={ptData.ptRcSecondDueDate}
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
                  value={ptData.ptRcThirdDueDate}
                  onChange={(date) => handleInputChange('ptRcThirdDueDate', date)}
                  disabled={isDueDateDisabled('ptRc', 2)}
                />
              </div>
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">PT RC Fourth Due Date</label>
                <DatePicker
                  className="w-full"
                  placeholder="Select PT RC fourth due date"
                  value={ptData.ptRcFourthDueDate}
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