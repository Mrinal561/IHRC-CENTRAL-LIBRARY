import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button, Notification, toast } from '@/components/ui';
import { IoArrowBack } from 'react-icons/io5';
import OutlinedSelect from '@/components/ui/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { updateCompliance, fetchComplianceById } from '@/store/slices/compliances/compliancesSlice';

interface SelectOption {
  value: string;
  label: string;
}

const ComplianceEditForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with the data passed through navigation state
  const [formData, setFormData] = useState({
    legislation: '',
    category: '',
    penalty_type: '',
    first_date: '',
    last_date: '',
    scheduled_frequency: '',
    proof_mandatory: false,
    header: '',
    description: '',
    penalty_description: '',
    applicablility: '',
    bare_act_text: '',
    type: '',
    caluse: '',
    frequency: '',
    statutory_auth: '',
    approval_required: false,
    criticality: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await dispatch(fetchComplianceById(id)).unwrap();
          if (response) {
            // Transform the received data to match form structure
            setFormData({
              legislation: response.legislation || '',
              category: response.category || '',
              penalty_type: response.penalty_type || '',
              first_date: response.default_due_date?.first_date || '',
              last_date: response.default_due_date?.last_date || '',
              scheduled_frequency: response.scheduled_frequency || '',
              proof_mandatory: response.proof_mandatory || false,
              header: response.header || '',
              description: response.description || '',
              penalty_description: response.penalty_description || '',
              applicablility: response.applicablility || '',
              bare_act_text: response.bare_act_text || '',
              type: response.type || '',
              caluse: response.caluse || '',
              frequency: response.frequency || '',
              statutory_auth: response.statutory_auth || '',
              approval_required: response.approval_required || false,
              criticality: response.criticality || '',
            });
          }
        } catch (error) {
          console.error('Error fetching compliance:', error);
          openNotification('danger', 'Failed to fetch compliance details');
        }
      }
    };

    fetchData();
  }, [id, dispatch]);

  const transformFormDataForBackend = (data: any) => {
    return {
      legislation: data.legislation,
      category: data.category,
      penalty_type: data.penalty_type,
      default_due_date: {
        first_date: data.first_date,
        last_date: data.last_date
      },
      scheduled_frequency: data.scheduled_frequency,
      proof_mandatory: data.proof_mandatory,
      header: data.header,
      description: data.description,
      penalty_description: data.penalty_description,
      applicablility: data.applicablility,
      bare_act_text: data.bare_act_text,
      type: data.type,
      caluse: data.caluse,
      frequency: data.frequency,
      statutory_auth: data.statutory_auth,
      approval_required: data.approval_required,
      criticality: data.criticality
    };
  };

  const openNotification = (type: 'success' | 'info' | 'danger' | 'warning', message: string) => {
    toast.push(
      <Notification title={type.charAt(0).toUpperCase() + type.slice(1)} type={type}>
        {message}
      </Notification>
    );
  };

  const validateForm = () => {
    const requiredFields = [
      'header',
      'category',
      'description',
      'type',
      'frequency',
      'statutory_auth',
      'criticality',
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      openNotification('danger', `Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      setIsLoading(true);
      const transformedData = transformFormDataForBackend(formData);
      
      if (id) {
        const result = await dispatch(updateCompliance({ id, data: transformedData })).unwrap();
        if (result) {
          openNotification('success', 'Compliance updated successfully!');
          navigate(-1);
        }
      }
    } catch (error: any) {
      openNotification('danger', error.message || 'Failed to update compliance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Options arrays (same as in ComplianceAddForm)
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
    { value: 'ongoing', label: 'On going' },
  ];

  const frequencyOptions: SelectOption[] = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'half_yearly', label: 'Half Yearly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const scheduledOptions: SelectOption[] = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const penaltyType: SelectOption[] = [
    { value: 'fine', label: 'Fine' }
  ];

  // Return the same form layout as ComplianceAddForm but with different title and button text
  return (
    <div className="p-2 bg-white rounded-lg">
      <div className='flex gap-1 items-center mb-10'>
        <Button
          size="sm"
          variant="plain"
          icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
          onClick={() => navigate(-1)}
          disabled={isLoading}
        />
        <h3 className="text-2xl font-semibold">Edit Compliance</h3>
      </div>

      {/* Form fields - same as ComplianceAddForm */}
      <div className="space-y-6">
        {/* ... All the same form fields as ComplianceAddForm ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="mb-2">Compliance Header <span className="text-red-500">*</span></p>
            <OutlinedInput
              label="Compliance Header"
              value={formData.header}
              onChange={(value: string) => handleInputChange('header', value)}
            />
          </div>
          {/* ... Rest of the form fields ... */}
          <div>
            <p className="mb-2">Compliance Applicability</p>
            <OutlinedInput
              label="Compliance Applicability"
              value={formData.applicablility}
              onChange={(value: string) => handleInputChange('applicablility', value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="mb-2">Compliance Category <span className="text-red-500">*</span></p>
            <OutlinedInput
              label="Select Category"
              value={formData.category}
              onChange={(value: string) => handleInputChange('category', value)}
              
            />
          </div>
          <div>
            <p className="mb-2">Compliance Clause</p>
            <OutlinedInput
              label="Compliance Clause"
              value={formData.caluse}
              onChange={(value: string) => handleInputChange('caluse', value)}
            />
          </div>
        </div>

        <div>
          <p className="mb-2">Compliance Description <span className="text-red-500">*</span></p>
          <OutlinedInput
            label="Compliance Description"
            value={formData.description}
            onChange={(value: string) => handleInputChange('description', value)}
            textarea={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="mb-2">Compliance Type <span className="text-red-500">*</span></p>
            <OutlinedSelect
              label="Select Compliance Type"
              options={typeOptions}
              value={typeOptions.find(option => option.value === formData.type)}
              onChange={(selectedOption: SelectOption | null) => {
                handleInputChange('type', selectedOption?.value || '');
              }}
            />
          </div>
          <div>
            <p className="mb-2">Compliance Frequency <span className="text-red-500">*</span></p>
            <OutlinedSelect
              label="Select Frequency"
              options={frequencyOptions}
              value={frequencyOptions.find(option => option.value === formData.frequency)}
              onChange={(selectedOption: SelectOption | null) => {
                handleInputChange('frequency', selectedOption?.value || '');
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="mb-2">Statutory Authority <span className="text-red-500">*</span></p>
            <OutlinedInput
              label="Statutory Authority"
              value={formData.statutory_auth}
              onChange={(value: string) => handleInputChange('statutory_auth', value)}
              required
            />
          </div>
          <div>
            <p className="mb-2">Criticality <span className="text-red-500">*</span></p>
            <OutlinedSelect
              label="Select Criticality"
              options={criticalityOptions}
              value={criticalityOptions.find(option => option.value === formData.criticality)}
              onChange={(selectedOption: SelectOption | null) => {
                handleInputChange('criticality', selectedOption?.value || '');
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
              value={scheduledOptions.find(option => option.value === formData.scheduled_frequency)}
              onChange={(selectedOption: SelectOption | null) => {
                handleInputChange('scheduled_frequency', selectedOption?.value || '');
              }}
            />
          </div>
          <div>
            <p className="mb-2">Penalty Type</p>
            <OutlinedSelect
              label="Select Penalty Type"
              options={penaltyType}
              value={penaltyType.find(option => option.value === formData.penalty_type)}
              onChange={(selectedOption: SelectOption | null) => {
                handleInputChange('penalty_type', selectedOption?.value || '');
              }}
            />
          </div>
        </div>

        <div>
          <p className="mb-2">Penalty Description</p>
          <OutlinedInput
            label="Penalty Description"
            value={formData.penalty_description}
            onChange={(value: string) => handleInputChange('penalty_description', value)}
            textarea={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="mb-2">Legislation</p>
            <OutlinedInput
              label="Legislation"
              value={formData.legislation}
              onChange={(value: string) => handleInputChange('legislation', value)}
            />
          </div>
          <div>
            <p className="mb-2">Proof Mandatory</p>
            <OutlinedSelect
              label="Proof Mandatory"
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' }
              ]}
              value={{ 
                value: String(formData.proof_mandatory), 
                label: formData.proof_mandatory ? 'Yes' : 'No' 
              }}
              onChange={(selectedOption: SelectOption | null) => {
                handleInputChange('proof_mandatory', selectedOption?.value === 'true');
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="mb-2">Approval Required</p>
            <OutlinedSelect
              label="Approval Required"
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' }
              ]}
              value={{ 
                value: String(formData.approval_required), 
                label: formData.approval_required ? 'Yes' : 'No' 
              }}
              onChange={(selectedOption: SelectOption | null) => {
                handleInputChange('approval_required', selectedOption?.value === 'true');
              }}
            />
          </div>
        </div>

        <div>
          <p className="mb-2">Bare Act Text</p>
          <OutlinedInput
            label="Bare Act Text"
            value={formData.bare_act_text}
            onChange={(value: string) => handleInputChange('bare_act_text', value)}
            textarea={true}
          />
        </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="solid" 
            size="sm" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Compliance'}
          </Button>
          <Button 
            type="button" 
            variant="plain" 
            size="sm" 
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
  );
};

export default ComplianceEditForm;