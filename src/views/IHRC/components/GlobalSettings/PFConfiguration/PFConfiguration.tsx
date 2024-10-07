import React, { useState, useEffect } from 'react';
import { AdaptableCard } from '@/components/shared';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { DatePicker } from '@/components/ui/DatePicker';
import PFTable from './components/PFTable';
import BulkUpload from './components/BulkUpload';

interface PFData {
  id: string;
  frequency: string;
  firstDueDate: Date | null;
  secondDueDate: Date | null;
}

const PFConfiguration = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pfData, setPfData] = useState<PFData[]>([
    { id: '1', frequency: 'Yearly', firstDueDate: new Date(), secondDueDate: null },
    { id: '2', frequency: 'Half Yearly', firstDueDate: new Date(), secondDueDate: new Date() },
    { id: '3', frequency: 'Monthly', firstDueDate: new Date(), secondDueDate: null },
  ]);
  const [newPF, setNewPF] = useState<PFData>({
    id: '',
    frequency: 'Yearly',
    firstDueDate: null,
    secondDueDate: null,
  });

  const handlePFState = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setNewPF({
      id: '',
      frequency: 'Yearly',
      firstDueDate: null,
      secondDueDate: null,
    });
  };

  const handleConfirm = () => {
    toast.push(
      <Notification title="Success" type="success">
        PF Configuration added successfully!
      </Notification>
    );
    handleDialogClose();
  };

  const handleInputChange = (name: string, value: any) => {
    console.log(`handleInputChange called with name: ${name}, value:`, value);
    setNewPF(prev => {
      const updatedValue = name === 'frequency' ? value : value;
      const updated = { ...prev, [name]: updatedValue };
      if (name === 'frequency' && updatedValue !== 'Half Yearly') {
        updated.secondDueDate = null;
      }
      console.log('Updated newPF:', updated);
      return updated;
    });
  };

  useEffect(() => {
    console.log('Current newPF state:', newPF);
  }, [newPF]);

  const isSecondDateDisabled = newPF.frequency !== 'Half Yearly';
  console.log('isSecondDateDisabled:', isSecondDateDisabled);

  const frequencyOptions = [
    { value: 'Yearly', label: 'Yearly' },
    { value: 'Half Yearly', label: 'Half Yearly' },
    { value: 'Monthly', label: 'Monthly' },
  ];

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="lg:flex items-center justify-between mb-4">
        <h3 className="mb-4 lg:mb-0">PF Configuration</h3>
        <div className='flex gap-4'>
        <BulkUpload />
        <Button size='sm' variant="solid" onClick={handlePFState} icon={<HiPlusCircle />}>
          Add PF
        </Button>
        </div>
      </div>

      <PFTable pfData={pfData} />

      <Dialog isOpen={isDialogOpen} onClose={handleDialogClose}>
        <h5 className="mb-4">Add PF Configuration</h5>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label>PF Frequency</label>
            <OutlinedSelect
             label='Select Frequency'
             options={frequencyOptions}
             value={frequencyOptions.find(option => option.value === newPF.frequency)}
             onChange={(selectedOption) => {
               console.log('OutlinedSelect onChange called with value:', selectedOption);
               handleInputChange('frequency', selectedOption.value);
             }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>First Default Due Date</label>
            <DatePicker
              value={newPF.firstDueDate}
              onChange={(date) => handleInputChange('firstDueDate', date)}
              placeholder="Select first due date"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Second Default Due Date</label>
            <DatePicker
              value={newPF.secondDueDate}
              onChange={(date) => handleInputChange('secondDueDate', date)}
              disabled={isSecondDateDisabled}
              placeholder="Select second due date"
            />
          </div>
        </div>
        <div className="text-right mt-6">
          <Button variant="plain" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button variant="solid" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </Dialog>
    </AdaptableCard>
  );
};

export default PFConfiguration;