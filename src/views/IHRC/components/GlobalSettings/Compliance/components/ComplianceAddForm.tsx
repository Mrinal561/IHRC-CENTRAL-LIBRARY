
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Notification, toast } from '@/components/ui'
import { IoArrowBack } from 'react-icons/io5'
import OutlinedSelect from '@/components/ui/Outlined'
import OutlinedInput from '@/components/ui/OutlinedInput'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { createCompliance } from '@/store/slices/compliances/compliancesSlice'
import { DatePicker } from '@/components/ui/DatePicker'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
interface SelectOption {
    value: string
    label: string
}

const ComplianceAddForm = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [states, setStates] = useState<SelectOption[]>([]);
    const [selectedStates, setSelectedStates] = useState<SelectOption | null>(null);

    const [formData, setFormData] = useState({
        legislation: '',
        category: '',
        header: '',
        description: '',
        penalty_description: '',
        applicablility: '',
        bare_act_text: '',
        caluse: '',
        type: '',
        frequency: '',
        scope: '',
        state_id: null,        
        statutory_auth: '',
        approval_required: true,
        criticality: '',
        penalty_type: '',
        first_date: '',
        second_date: '',
        third_date: '',
        last_date: '',
        scheduled_frequency: '',
        proof_mandatory: true,
    })

    // State to control last_date field
    const [dateFieldsState, setDateFieldsState] = useState({
        isSecondDateEnabled: false,
        isThirdDateEnabled: false,
        isLastDateEnabled: false
    })

    // Effect to handle last_date field enablement



    useEffect(() => {
        switch (formData.frequency) {
            case 'quarterly':
                setDateFieldsState({
                    isSecondDateEnabled: true,
                    isThirdDateEnabled: true,
                    isLastDateEnabled: true
                })
                break
            case 'half_yearly':
                setDateFieldsState({
                    isSecondDateEnabled: false,
                    isThirdDateEnabled: false,
                    isLastDateEnabled: true
                })
                // Clear disabled date fields
                setFormData(prev => ({
                    ...prev,
                    second_date: '',
                    third_date: ''
                }))
                break
            case 'yearly':
            case 'monthly':
                setDateFieldsState({
                    isSecondDateEnabled: false,
                    isThirdDateEnabled: false,
                    isLastDateEnabled: false
                })
                // Clear disabled date fields
                setFormData(prev => ({
                    ...prev,
                    second_date: '',
                    third_date: '',
                    last_date: ''
                }))
                break
            default:
                setDateFieldsState({
                    isSecondDateEnabled: false,
                    isThirdDateEnabled: false,
                    isLastDateEnabled: false
                })
        }
    }, [formData.frequency])

    const transformFormDataForBackend = (data: any) => {
        return {
            legislation: data.legislation,
            category: data.category,
            header: data.header,
            description: data.description,
            penalty_description: data.penalty_description,
            applicablility: data.applicablility,
            bare_act_text: data.bare_act_text,
            caluse: data.caluse,
            type: data.type,
            frequency: data.frequency,
            statutory_auth: data.statutory_auth,
            approval_required: data.approval_required,
            criticality: data.criticality,
            penalty_type: data.penalty_type,
            default_due_date: {
                first_date: data.first_date || null,
                second_date: data.second_date || null,
                third_date: data.third_date || null,
                last_date: data.last_date || null,
            },
            scope: formData.scope,
            state_id: formData.scope === 'state' ? formData.state_id : null,
            scheduled_frequency: data.scheduled_frequency,
            proof_mandatory: data.proof_mandatory,
        }
    }

    const showNotification = (type: 'success' | 'info' | 'danger' | 'warning', message: string) => {
        toast.push(
          <Notification
            title={type.charAt(0).toUpperCase() + type.slice(1)}
            type={type}
          >
            {message}
          </Notification>
        );
      };

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
            showNotification('danger', 'Invalid state data received');
          }
        } catch (error) {
          console.error('Failed to load states:', error);
          showNotification('danger', 'Failed to load states');
        } finally {
          setIsLoading(false);
        }
      };
    
      useEffect(() => {
        loadStates();
      }, []);

    const openNotification = (
        type: 'success' | 'info' | 'danger' | 'warning',
        message: string,
        error?: any,
    ) => {
        let errorMessage = message
        if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.message
        ) {
            errorMessage = error.response.data.message.join(', ')
        }
        toast.push(
            <Notification
                title={type.charAt(0).toUpperCase() + type.slice(1)}
                type={type}
            >
                {errorMessage}
            </Notification>,
        )
    }

    const validateForm = () => {
        const requiredFields = [
            'legislation',
            'header',
            'category',
            'description',
            'type',
            'frequency',
            'statutory_auth',
            'criticality',
            'first_date',
            'penalty_type',
            'scheduled_frequency',
        ]

        const missingFields = requiredFields.filter((field) => !formData[field])

        if (missingFields.length > 0) {
            openNotification(
                'danger',
                `Please fill in all required fields: ${missingFields.join(', ')}`,
            )
            return false
        }

        return true
    }


    const handleSubmit = async () => {
        try {
            if (!validateForm()) return

            setIsLoading(true)
            const transformedData = transformFormDataForBackend(formData)
            const result = await dispatch(createCompliance(transformedData))
                .unwrap()
                .catch((error: any) => {
                    if (error.response?.data?.message) {
                        showErrorNotification(error.response.data.message)
                    } else if (error.message) {
                        showErrorNotification(error.message)
                    } else if (Array.isArray(error)) {
                        showErrorNotification(error)
                    } else {
                        showErrorNotification('An unexpected error occurred. Please try again.')
                    }
                    throw error
                })

            if (result) {
                openNotification('success', 'Compliance added successfully!')
                navigate('/compliance')
            }
        } catch (error: any) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: string, value: any) => {
        if (field === 'first_date' || field === 'last_date') {
            // Handle date values - convert Date object to ISO string or empty string
            const dateValue = value ? value.toISOString().split('T')[0] : ''
            setFormData(prev => ({ ...prev, [field]: dateValue }))
        } 
        if (field === 'scope') {
            setFormData(prev => ({
                ...prev,
                scope: value,
                state_id: value === 'central' ? null : prev.state_id
            }))
            console.log(formData);
            
            return
        } 
            setFormData(prev => ({ ...prev, [field]: value }))
        }
    
    // Options for select fields

    const criticalityOptions: SelectOption[] = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
    ]

    const typeOptions: SelectOption[] = [
        { value: 'on_going', label: 'On going' },
        { value: 'time_based', label: 'Time Based' },
        { value: 'event_based', label: 'Event Based' },
        { value: 'one_time', label: 'One Time' },
    ]

    const frequencyOptions: SelectOption[] = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'half_yearly', label: 'Half Yearly' },
        { value: 'yearly', label: 'Yearly' },
        { value: 'quarterly', label: 'Quarterly' },
    ]

    const scheduledOptions: SelectOption[] = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
    ]

    const penaltyType: SelectOption[] = [
        { value: 'fine', label: 'Fine' }
    ]

    const scopeOptions: SelectOption[] = [
        { value: 'central', label: 'Central' },
        { value: 'state', label: 'State' },
    ]


      // Handle state selection
  const handleStateChange = (option: SelectOption | null) => {
    setSelectedStates(option);
    if (option) {
      setFormData(prev => ({
        ...prev,
        state_id: parseInt(option.value),
        // State: option.label,
        // District: '' // Reset district when state changes
      }));
    }
  };


return (
    <div className="p-2 bg-white rounded-lg">
        <div className="flex gap-1 items-center mb-10">
            <Button
                size="sm"
                variant="plain"
                icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
                onClick={() => navigate(-1)}
                disabled={isLoading}
            />
            <h3 className="text-2xl font-semibold">Add Compliance</h3>
        </div>

        <div className="space-y-6">
            {/* Maintaining exact sequence with grid optimization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Legislation */}
                <div>
                    <p className="mb-2">Legislation (Act Name) <span className="text-red-500">*</span></p>
                    <OutlinedInput
                        label="Legislation"
                        value={formData.legislation}
                        onChange={(value: string) =>
                            handleInputChange('legislation', value)
                        }
                    />
                </div>

                {/* 2. Category */}
                <div>
                    <p className="mb-2">
                        Compliance Category <span className="text-red-500">*</span>
                    </p>
                    <OutlinedInput
                        label="Category"
                        value={formData.category}
                        onChange={(value: string) =>
                            handleInputChange('category', value)
                        }
                    />
                </div>
            </div>

            {/* 3. Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="mb-2">
                        Compliance Header <span className="text-red-500">*</span>
                    </p>
                    <OutlinedInput
                        label="Compliance Header"
                        value={formData.header}
                        onChange={(value: string) =>
                            handleInputChange('header', value)
                        }
                    />
                </div>


                 {/* 6. Applicability */}
                 <div>
                    <p className="mb-2">Compliance Applicability</p>
                    <OutlinedInput
                        label="Compliance Applicability"
                        value={formData.applicablility}
                        onChange={(value: string) =>
                            handleInputChange('applicablility', value)
                        }
                    />
                </div>

                
            </div>

            {/*Scope */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="mb-2">
                        Scope <span className="text-red-500">*</span>
                    </p>
                    <OutlinedSelect
                        label="Select Scope"
                        options={scopeOptions}
                        value={scopeOptions.find(option => option.value === formData.scope)}
                        onChange={(selectedOption: SelectOption | null) => 
                            handleInputChange('scope', selectedOption?.value || '')
                        }
                    />
                </div>


                 {/*  state */}
                 {formData.scope === 'state' && (

                     <div >
                    <p className="mb-2">State</p>
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

            )}
                
            </div>


            <div className="grid grid-row-1 md:grid-row-1 gap-4">

                 {/* 4. Description */}
                 <div>
                    <p className="mb-2">
                        Compliance Description <span className="text-red-500">*</span>
                    </p>
                    <OutlinedInput
                        label="Compliance Description"
                        value={formData.description}
                        onChange={(value: string) =>
                            handleInputChange('description', value)
                        }
                        textarea={true}
                    />
                </div>

                {/* 5. Penalty Description */}
                <div>
                    <p className="mb-2">Penalty Description</p>
                    <OutlinedInput
                        label="Penalty Description"
                        value={formData.penalty_description}
                        onChange={(value: string) =>
                            handleInputChange('penalty_description', value)
                        }
                        textarea={true}
                    />
                </div>

               
            </div>

            <div className="grid grid-row-1 md:grid-row-1 gap-4">
                {/* 7. Bare Act Text */}
                <div>
                    <p className="mb-2">Bare Act Text</p>
                    <OutlinedInput
                        label="Bare Act Text"
                        value={formData.bare_act_text}
                        onChange={(value: string) =>
                            handleInputChange('bare_act_text', value)
                        }
                        textarea={true}
                    />
                </div>

               
            </div>

            {/* 9-10. Type and Frequency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                 {/* 8. Clause */}
                 <div>
                    <p className="mb-2">Compliance Clause</p>
                    <OutlinedInput
                        label="Compliance Clause"
                        value={formData.caluse}
                        onChange={(value: string) =>
                            handleInputChange('caluse', value)
                        }
                    />
                </div>

                <div>
                    <p className="mb-2">
                        Compliance Type <span className="text-red-500">*</span>
                    </p>
                    <OutlinedSelect
                        label="Select Compliance Type"
                        options={typeOptions}
                        value={typeOptions.find(
                            (option) => option.value === formData.type
                        )}
                        onChange={(selectedOption: SelectOption | null) => {
                            handleInputChange('type', selectedOption?.value || '')
                        }}
                    />
                </div>
                <div>
                    <p className="mb-2">
                        Compliance Frequency <span className="text-red-500">*</span>
                    </p>
                    <OutlinedSelect
                        label="Select Frequency"
                        options={frequencyOptions}
                        value={frequencyOptions.find(
                            (option) => option.value === formData.frequency
                        )}
                        onChange={(selectedOption: SelectOption | null) => {
                            handleInputChange('frequency', selectedOption?.value || '')
                        }}
                    />
                </div>
            </div>

            {/* 11-13. Authority, Approval, Criticality */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <p className="mb-2">
                        Statutory Authority <span className="text-red-500">*</span>
                    </p>
                    <OutlinedInput
                        label="Statutory Authority"
                        value={formData.statutory_auth}
                        onChange={(value: string) =>
                            handleInputChange('statutory_auth', value)
                        }
                    />
                </div>
                <div>
                    <p className="mb-2">Approval Required</p>
                    <OutlinedSelect
                        label="Approval Required"
                        options={[
                            { value: 'true', label: 'Yes' },
                            { value: 'false', label: 'No' },
                        ]}
                        value={{
                            value: String(formData.approval_required),
                            label: formData.approval_required ? 'Yes' : 'No',
                        }}
                        onChange={(selectedOption: SelectOption | null) => {
                            handleInputChange(
                                'approval_required',
                                selectedOption?.value === 'true'
                            )
                        }}
                    />
                </div>
                <div>
                    <p className="mb-2">
                        Criticality <span className="text-red-500">*</span>
                    </p>
                    <OutlinedSelect
                        label="Select Criticality"
                        options={criticalityOptions}
                        value={criticalityOptions.find(
                            (option) => option.value === formData.criticality
                        )}
                        onChange={(selectedOption: SelectOption | null) => {
                            handleInputChange('criticality', selectedOption?.value || '')
                        }}
                    />
                </div>
            </div>

            {/* 14-16. Penalty Type and Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <p className="mb-2">Penalty Type <span className="text-red-500">*</span></p>
                    <OutlinedSelect
                        label="Select Penalty Type"
                        options={penaltyType}
                        value={penaltyType.find(
                            (option) => option.value === formData.penalty_type
                        )}
                        onChange={(selectedOption: SelectOption | null) => {
                            handleInputChange('penalty_type', selectedOption?.value || '')
                        }}
                    />
                </div>

                <div>
                    <p className="mb-2">Scheduled Frequency <span className="text-red-500">*</span></p>
                    <OutlinedSelect
                        label="Select Scheduled Frequency"
                        options={scheduledOptions}
                        value={scheduledOptions.find(
                            (option) => option.value === formData.scheduled_frequency
                        )}
                        onChange={(selectedOption: SelectOption | null) => {
                            handleInputChange(
                                'scheduled_frequency',
                                selectedOption?.value || ''
                            )
                        }}
                    />
                </div>
                <div>
                    <p className="mb-2">Proof of Compliance</p>
                    <OutlinedSelect
                        label="Proof Required"
                        options={[
                            { value: 'true', label: 'Yes' },
                            { value: 'false', label: 'No' },
                        ]}
                        value={{
                            value: String(formData.proof_mandatory),
                            label: formData.proof_mandatory ? 'Yes' : 'No',
                        }}
                        onChange={(selectedOption: SelectOption | null) => {
                            handleInputChange(
                                'proof_mandatory',
                                selectedOption?.value === 'true'
                            )
                        }}
                    />
                </div>
               
            </div>

            {/* 17-18. Scheduled Frequency and Proof */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <p className="mb-2">First Due Date <span className="text-red-500">*</span></p>
                <DatePicker
                    placeholder="Select first due date"
                    value={formData.first_date ? new Date(formData.first_date) : null}
                    onChange={(date: Date | null) => handleInputChange('first_date', date)}
                />
            </div>
            <div>
                <p className="mb-2">Second Due Date</p>
                <DatePicker
                    placeholder="Select second due date"
                    value={formData.second_date ? new Date(formData.second_date) : null}
                    onChange={(date: Date | null) => handleInputChange('second_date', date)}
                    disabled={!dateFieldsState.isSecondDateEnabled}
                />
            </div>
            <div>
                <p className="mb-2">Third Due Date</p>
                <DatePicker
                    placeholder="Select third due date"
                    value={formData.third_date ? new Date(formData.third_date) : null}
                    onChange={(date: Date | null) => handleInputChange('third_date', date)}
                    disabled={!dateFieldsState.isThirdDateEnabled}
                />
            </div>
            <div>
                <p className="mb-2">Last Due Date</p>
                <DatePicker
                    placeholder="Select last due date"
                    value={formData.last_date ? new Date(formData.last_date) : null}
                    onChange={(date: Date | null) => handleInputChange('last_date', date)}
                    disabled={!dateFieldsState.isLastDateEnabled}
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
                    {isLoading ? 'Adding...' : 'Add Compliance'}
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
    </div>
)
}
export default ComplianceAddForm






