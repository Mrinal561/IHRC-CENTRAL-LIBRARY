
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Notification, toast } from '@/components/ui';
import { IoArrowBack } from 'react-icons/io5';
import OutlinedSelect from '@/components/ui/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput';

interface FormData {
  Compliance_Id: string;
  Compliance_Categorization: string;
  Compliance_Header: string;
  Compliance_Description: string;
  Compliance_Applicability: string;
  Compliance_Clause: string;
  Compliance_Type: string;
  Compliance_Frequency: string;
  Compliance_Statutory_Authority: string;
  Criticality: string;
  Penalt_Type: string;
  Scheduled_Frequency:string;
  Penalty_Description: string;
  Legislation: string;
  Applicability: string;
  Bare_Act_Text: string;

}

interface SelectOption {
  value: string;
  label: string;
}

const ComplianceAddForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<FormData>({
    Compliance_Id: '',
    Compliance_Categorization: '',
    Compliance_Header: '',
    Compliance_Description: '',
    Compliance_Applicability: '',
    Compliance_Clause: '',
    Compliance_Type: '',
    Compliance_Frequency: '',
    Compliance_Statutory_Authority: '',
    Criticality:'',
    Penalt_Type:'',
    Scheduled_Frequency:'',
    Penalty_Description:'',
    Legislation:'',
    Applicability:'',
    Bare_Act_Text:'',
  });

  const openNotification = (type: 'success' | 'info' | 'danger' | 'warning', message: string) => {
    toast.push(
      <Notification
        title={type.charAt(0).toUpperCase() + type.slice(1)}
        type={type}
      >
        {message}
      </Notification>
    )
  }

  const handleSubmit = () => {
    console.log(formData);
    openNotification('success', 'Compliance assigned successfully');
    navigate(-1);
  };

  // Mock options for select fields
  const categorizationOptions: SelectOption[] = [
    { value: 'category1', label: 'Category 1' },
    { value: 'category2', label: 'Category 2' },
  ];
  const criticalityOptions: SelectOption[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];
  
  const typeOptions: SelectOption[] = [
    { value: 'type1', label: 'Type 1' },
    { value: 'type2', label: 'Type 2' },
  ];

  const frequencyOptions: SelectOption[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];
  const scheduledOptions: SelectOption[] = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];
  return (
    <div className="p-2 bg-white rounded-lg">
      <div className='flex gap-1 items-center mb-10'>
        <Button
          size="sm"
          variant="plain"
          icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
          onClick={() => navigate(-1)}
        />
        <h3 className="text-2xl font-semibold">Add Compliance</h3>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
            <p className="mb-2">Compliance Header</p>
            <OutlinedInput
              label="Compliance Header"
              value={formData.Compliance_Header}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, Compliance_Header: value }));
              }}
            />
          </div>
        <div>
            <p className="mb-2">Compliance Applicability</p>
            <OutlinedInput
              label="Compliance Applicability"
              value={formData.Compliance_Applicability}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, Compliance_Applicability: value }));
              }}
            />
          </div>
         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="mb-2">Compliance Categorization</p>
            <OutlinedSelect
              label="Select Categorization"
              options={categorizationOptions}
              value={categorizationOptions.find(option => option.value === formData.Compliance_Categorization)}
              onChange={(selectedOption: SelectOption | null) => {
                setFormData(prev => ({
                  ...prev,
                  Compliance_Categorization: selectedOption?.value || '',
                }));
              }}
            />
          </div>
          <div>
            <p className="mb-2">Compliance Clause</p>
            <OutlinedInput
              label="Compliance Clause"
              value={formData.Compliance_Clause}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, Compliance_Clause: value }));
              }}
            />
          </div>
        </div>

        <div>
          <p className="mb-2">Compliance Description</p>
          <OutlinedInput
            label="Compliance Description"
            value={formData.Compliance_Description}
            onChange={(value: string) => {
              setFormData(prev => ({ ...prev, Compliance_Description: value }));
            }}
            textarea={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          
          <div>
            <p className="mb-2">Compliance Type</p>
            <OutlinedSelect
              label="Select Type"
              options={typeOptions}
              value={typeOptions.find(option => option.value === formData.Compliance_Type)}
              onChange={(selectedOption: SelectOption | null) => {
                setFormData(prev => ({
                  ...prev,
                  Compliance_Type: selectedOption?.value || '',
                }));
              }}
            />
          </div>
          <div>
            <p className="mb-2">Compliance Frequency</p>
            <OutlinedSelect
              label="Select Frequency"
              options={frequencyOptions}
              value={frequencyOptions.find(option => option.value === formData.Compliance_Frequency)}
              onChange={(selectedOption: SelectOption | null) => {
                setFormData(prev => ({
                  ...prev,
                  Compliance_Frequency: selectedOption?.value || '',
                }));
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          
          <div>
            <p className="mb-2">Compliance Statutory Authority</p>
            <OutlinedInput
              label="Compliance Statutory Authority"
              value={formData.Compliance_Statutory_Authority}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, Compliance_Statutory_Authority: value }));
              }}
            />
          </div>
          <div>
            <p className="mb-2">Criticality</p>
            <OutlinedSelect
              label="Select Criticality"
              options={criticalityOptions}
              value={criticalityOptions.find(option => option.value === formData.Compliance_Frequency)}
              onChange={(selectedOption: SelectOption | null) => {
                setFormData(prev => ({
                  ...prev,
                  Criticality: selectedOption?.value || '',
                }));
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="mb-2">Scheduled Frequency</p>
            <OutlinedSelect
              label="Select Scheduled Frequency"
              options={scheduledOptions}
              value={scheduledOptions.find(option => option.value === formData.Scheduled_Frequency)}
              onChange={(selectedOption: SelectOption | null) => {
                setFormData(prev => ({
                  ...prev,
                  Scheduled_Frequency: selectedOption?.value || '',
                }));
              }}
            />
          </div>
          <div>
        <p className="mb-2">Penalty Type</p>
            <OutlinedInput
              label="Penalty"
              value={formData.Penalt_Type}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, Penalt_Type: value }));
              }}
            />
          </div>
        </div>
        <div>
          <p className="mb-2">Penalty Description</p>
          <OutlinedInput
            label="Penalty Description"
            value={formData.Penalty_Description}
            onChange={(value: string) => {
              setFormData(prev => ({ ...prev, Penalty_Description: value }));
            }}
            textarea={true}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
        <p className="mb-2">Legislation</p>
            <OutlinedInput
              label="Legislation"
              value={formData.Legislation}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, Legislation: value }));
              }}
            />
          </div>
        <div>
        <p className="mb-2">Applicability</p>
            <OutlinedInput
              label="Applicability"
              value={formData.Applicability}
              onChange={(value: string) => {
                setFormData(prev => ({ ...prev, Applicability: value }));
              }}
            />
          </div>

        </div>
        <div>
          <p className="mb-2">Bare Act Text</p>
          <OutlinedInput
            label="Bare Act Text"
            value={formData.Bare_Act_Text}
            onChange={(value: string) => {
              setFormData(prev => ({ ...prev, Bare_Act_Text: value }));
            }}
            textarea={true}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="solid" size="sm" onClick={handleSubmit}>
            Add Compliance
          </Button>
          <Button type="button" variant="plain" size="sm" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceAddForm;