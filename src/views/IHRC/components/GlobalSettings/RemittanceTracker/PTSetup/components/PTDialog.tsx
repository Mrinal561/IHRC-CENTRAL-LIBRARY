import React, { useState } from 'react';
import { Dialog, Button, DatePicker, Checkbox } from '@/components/ui';
import OutlinedSelect from '@/components/ui/Outlined';

const frequencyOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
];

const PTDialog = ({ isOpen, onClose, states, selectedData, onConfirm }) => {
  const [ptData, setPTData] = useState({
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
  });
  const [selectedState, setSelectedState] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const isDueDateDisabled = (type, dateIndex) => {
    const frequency = type === 'ptEc' ? ptData.ptEcFrequency : ptData.ptRcFrequency;
    switch (frequency) {
      case 'monthly':
      case 'yearly':
        return dateIndex > 0;
      case 'half_yearly':
        return dateIndex > 1;
      case 'quarterly':
        return false;
      default:
        return true;
    }
  };

  const handleInputChange = (field, value) => {
    setPTData(prev => ({
      ...prev,
      [field]: value?.value || value
    }));
  };

  const handleConfirm = () => {
    if (!selectedState || !ptData.ptEcFirstDueDate || !ptData.ptRcFirstDueDate) {
      return;
    }

    const formData = {
      state_id: selectedState.value,
      ptec_frequency: ptData.ptEcFrequency,
      ptrc_frequency: ptData.ptRcFrequency,
      ptec_payment_due_date: {
        first_date: ptData.ptEcFirstDueDate,
        second_date: ptData.ptEcSecondDueDate,
        third_date: ptData.ptEcThirdDueDate,
        last_date: ptData.ptEcFourthDueDate
      },
      ptrc_payment_due_date: {
        first_date: ptData.ptRcFirstDueDate,
        second_date: ptData.ptRcSecondDueDate,
        third_date: ptData.ptRcThirdDueDate,
        last_date: ptData.ptRcFourthDueDate
      },
      active: isActive
    };

    onConfirm(formData);
  };
  const getRequiredDateFields = (frequency) => {
    switch (frequency) {
      case 'monthly':
      case 'yearly':
        return {
          first: true,
          second: false,
          third: false,
          fourth: false
        };
      case 'half_yearly':
        return {
          first: true,
          second: false,
          third: false,
          fourth: true
        };
      case 'quarterly':
        return {
          first: true,
          second: true,
          third: true,
          fourth: true
        };
      default:
        return {
          first: false,
          second: false,
          third: false,
          fourth: false
        };
    }
  };

  const ptEcRequiredFields = getRequiredDateFields(ptData.ptEcFrequency);
  const ptRcRequiredFields = getRequiredDateFields(ptData.ptRcFrequency);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} width={1200} height={600}>
      <h5 className="mb-6">Edit PT Setup</h5>
      <div className="flex flex-col gap-6">
        <div className="w-full">
          <label className="text-gray-600 mb-2 block">State</label>
          <OutlinedSelect
            label="Select State"
            options={states}
            value={selectedState}
            onChange={setSelectedState}
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="text-gray-600 mb-2 block">PT EC Frequency</label>
            <OutlinedSelect
              label="Select PT EC Frequency"
              options={frequencyOptions}
              value={frequencyOptions.find(opt => opt.value === ptData.ptEcFrequency)}
              onChange={val => handleInputChange('ptEcFrequency', val)}
            />
          </div>
          <div className="w-1/2">
            <label className="text-gray-600 mb-2 block">PT RC Frequency</label>
            <OutlinedSelect
              label="Select PT RC Frequency"
              options={frequencyOptions}
              value={frequencyOptions.find(opt => opt.value === ptData.ptRcFrequency)}
              onChange={val => handleInputChange('ptRcFrequency', val)}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <h4 className="text-lg font-semibold mb-4">PT EC Due Dates</h4>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-gray-600 mb-2 block">First Due Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className="w-full"
                  value={ptData.ptEcFirstDueDate}
                  onChange={date => handleInputChange('ptEcFirstDueDate', date)}
                />
              </div>
              <div>
                <label className="text-gray-600 mb-2 block">Second Due Date<span className="text-red-500">*</span></label>
                <DatePicker
                  className="w-full"
                  value={ptData.ptEcSecondDueDate}
                  onChange={date => handleInputChange('ptEcSecondDueDate', date)}
                  disabled={isDueDateDisabled('ptEc', 1)}
                />
              </div>
              <div>
                <label className="text-gray-600 mb-2 block">Third Due Date<span className="text-red-500">*</span></label>
                <DatePicker
                  className="w-full"
                  value={ptData.ptEcThirdDueDate}
                  onChange={date => handleInputChange('ptEcThirdDueDate', date)}
                  disabled={isDueDateDisabled('ptEc', 2)}
                />
              </div>
              <div>
                <label className="text-gray-600 mb-2 block">Fourth Due Date<span className="text-red-500">*</span></label>
                <DatePicker
                  className="w-full"
                  value={ptData.ptEcFourthDueDate}
                  onChange={date => handleInputChange('ptEcFourthDueDate', date)}
                  disabled={isDueDateDisabled('ptEc', 3)}
                />
              </div>
            </div>
          </div>

          <div className="w-1/2">
            <h4 className="text-lg font-semibold mb-4">PT RC Due Dates</h4>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-gray-600 mb-2 block">First Due Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className="w-full"
                  value={ptData.ptRcFirstDueDate}
                  onChange={date => handleInputChange('ptRcFirstDueDate', date)}
                />
              </div>
              <div>
                <label className="text-gray-600 mb-2 block">Second Due Date</label>
                <DatePicker
                  className="w-full"
                  value={ptData.ptRcSecondDueDate}
                  onChange={date => handleInputChange('ptRcSecondDueDate', date)}
                  disabled={isDueDateDisabled('ptRc', 1)}
                />
              </div>
              <div>
                <label className="text-gray-600 mb-2 block">Third Due Date</label>
                <DatePicker
                  className="w-full"
                  value={ptData.ptRcThirdDueDate}
                  onChange={date => handleInputChange('ptRcThirdDueDate', date)}
                  disabled={isDueDateDisabled('ptRc', 2)}
                />
              </div>
              <div>
                <label className="text-gray-600 mb-2 block">Fourth Due Date</label>
                <DatePicker
                  className="w-full"
                  value={ptData.ptRcFourthDueDate}
                  onChange={date => handleInputChange('ptRcFourthDueDate', date)}
                  disabled={isDueDateDisabled('ptRc', 3)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox checked={isActive} onChange={setIsActive} />
          <label className="text-gray-600">Is PT applicable for Selected State</label>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="plain" onClick={onClose}>Cancel</Button>
          <Button variant="solid" onClick={handleConfirm}>Update</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default PTDialog;