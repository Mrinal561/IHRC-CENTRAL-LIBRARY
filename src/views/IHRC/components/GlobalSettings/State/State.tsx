

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import AdaptableCard from '@/components/shared/AdaptableCard';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import DatePicker from '@/components/ui/DatePicker';
import BulkUpload from './components/BulkUpload';
import StateTable from './components/StateTable';
import { 
  fetchStates, 
  createState, 
  updateState,
  clearError 
} from '@/store/slices/state/stateSlice';
import { AppDispatch, RootState } from '@/store';
import { transformStatePayload } from '@/@types/stateTransformer';

const frequencyOptions = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'monthly', label: 'Monthly' },
];

const paymentOptions = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
];

const initialStateData = {
  name: '',
  ptec_frequency: '',
  ptrc_frequency: '',
  lwf_frequency: '',
  paymentFrequency: '',
  ptEcFirstDueDate: null,
  ptEcLastDueDate: null,
  ptRcFirstDueDate: null,
  ptRcLastDueDate: null,
  lwfFirstDueDate: null,
  lwfLastDueDate: null,
};

const State = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { states, loading, error } = useSelector((state: RootState) => state.state);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStateId, setCurrentStateId] = useState(null);
  const [stateData, setStateData] = useState(initialStateData);
  const [stateTableData, setStateTableData] = useState([]);

  useEffect(() => {
    fetchStateData()
  }, [])


  const fetchStateData = async () => {
    const { payload: data } = await dispatch(
      fetchStates(1, 0),
    )
  }

  useEffect(() => {
    if (error) {
      toast.push(
        <Notification title="Error" type="danger">
          {error}
        </Notification>
      );
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleEdit = (stateToEdit) => {
    setIsEditMode(true);
    setCurrentStateId(stateToEdit.id);
    console.log(stateToEdit);
    setStateData({
      name: stateToEdit.name,
      ptec_frequency: stateToEdit.ptec_frequency,
      ptrc_frequency: stateToEdit.ptrc_frequency,
      lwf_frequency: stateToEdit.lwf_frequency,
      paymentFrequency: stateToEdit.payment_mode,
      ptEcFirstDueDate: stateToEdit.ptec_payment_due_date?.first_date || null,
      ptEcLastDueDate: stateToEdit.ptec_payment_due_date?.last_date || null,
      ptRcFirstDueDate: stateToEdit.ptrc_payment_due_date?.first_date || null,
      ptRcLastDueDate: stateToEdit.ptrc_payment_due_date?.last_date || null,
      lwfFirstDueDate: stateToEdit.lwf_payment_due_date?.first_date || null,
      lwfLastDueDate: stateToEdit.lwf_payment_due_date?.last_date || null,
    });
    setIsDialogOpen(true);
  };

  const handleInputChange = (name: string, value: string | Date | null | React.ChangeEvent<HTMLInputElement>) => {
    if (value === null) {
      setStateData(prev => ({ ...prev, [name]: null }));
    } else if (typeof value === 'object' && 'target' in value) {
      setStateData(prev => ({ ...prev, [name]: value.target.value }));
    } else {
      setStateData(prev => {
        const updated = { ...prev, [name]: value };
        if (name.includes('Frequency')) {
          const lastDueDateField = name.replace('Frequency', 'LastDueDate');
          if (value === 'yearly' || value === 'monthly') {
            updated[lastDueDateField] = null;
          }
        }
        return updated;
      });
    }
  };


  const handleConfirm = async () => {
    try {
      const transformedData = transformStatePayload(stateData);
      if (isEditMode) {
        await dispatch(updateState({ id: currentStateId, data: transformedData })).unwrap();
        await dispatch()
        toast.push(
          <Notification title="Success" type="success">
            State updated successfully!
          </Notification>
        );
        
      } else {
        await dispatch(createState(transformedData));
        toast.push(
          <Notification title="Success" type="success">
            State created successfully!
          </Notification>
        );
        
      }
    } catch (error) {
      // Error handling is done in the useEffect above
    }
    handleDialogClose()
    fetchStateData();

  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentStateId(null);
    setStateData(initialStateData);
  };

  const FrequencyRow = ({ 
    title,
    frequencyName,
    firstDateName,
    lastDateName,
    frequency,
  }) => (
    <div className="flex gap-4">
      <div className="w-1/3">
        <label className="text-gray-600 mb-2 block">{title}</label>
        <OutlinedSelect
          label="Frequency"
          options={frequencyOptions}
          value={frequency}
          onChange={(value) => handleInputChange(frequencyName, value)}
        />
      </div>
      <div className="w-1/3">
        <label className="text-gray-600 mb-2 block">First Due Date</label>
        <DatePicker
          className="w-full"
          placeholder="Select date"
          value={stateData[firstDateName]}
          onChange={(date) => handleInputChange(firstDateName, date)}
        />
      </div>
      <div className="w-1/3">
        <label className="text-gray-600 mb-2 block">Last Due Date</label>
        <DatePicker
          className="w-full"
          placeholder="Select date"
          value={stateData[lastDateName]}
          onChange={(date) => handleInputChange(lastDateName, date)}
          disabled={frequency !== 'half_yearly'}
        />
      </div>
    </div>
  );

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">State Manager</h3>
        </div>
        <div className="flex gap-2">
          <BulkUpload />
          <Button
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={() => setIsDialogOpen(true)}
          >
            Add State
          </Button>
        </div>
      </div>
      
      <StateTable 
        stateData={stateTableData} 
        loading={loading}
        onEdit={handleEdit}
      />

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-6">{isEditMode ? 'Edit State' : 'Add State'}</h5>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">State Name</label>
              <OutlinedInput 
                label="Enter state name"
                value={stateData.name}
                onChange={(e) => handleInputChange('name', e)}
              />
            </div>
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">Payment Mode</label>
              <OutlinedSelect
                label="Select payment mode"
                options={paymentOptions}
                value={stateData.paymentFrequency}
                onChange={(value) => handleInputChange('paymentFrequency', value)}
              />
            </div>
          </div>

          <FrequencyRow
            title="PT EC Frequency"
            frequencyName="ptec_frequency"
            firstDateName="ptEcFirstDueDate"
            lastDateName="ptEcLastDueDate"
            frequency={stateData.ptec_frequency}
          />

          <FrequencyRow
            title="PT RC Frequency"
            frequencyName="ptrc_frequency"
            firstDateName="ptRcFirstDueDate"
            lastDateName="ptRcLastDueDate"
            frequency={stateData.ptrc_frequency}
          />

          <FrequencyRow
            title="LWF Frequency"
            frequencyName="lwf_frequency"
            firstDateName="lwfFirstDueDate"
            lastDateName="lwfLastDueDate"
            frequency={stateData.lwf_frequency}
          />
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

export default State;