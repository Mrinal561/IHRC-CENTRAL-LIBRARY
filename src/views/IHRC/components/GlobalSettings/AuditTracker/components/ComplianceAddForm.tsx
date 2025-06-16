import React, { useState } from 'react'
import { Button } from '@/components/ui'
import { IoArrowBack } from 'react-icons/io5'
import OutlinedSelect from '@/components/ui/Outlined'
import OutlinedInput from '@/components/ui/OutlinedInput'
import { DatePicker } from '@/components/ui/DatePicker'
import { useNavigate } from 'react-router-dom'

interface SelectOption {
    value: string
    label: string
}

const ComplianceAddForm = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        country: '',
        function: '',
        scope: '',
        legislation: '',
        category: '',
        penalty_type: '',
        header: '',
        description: '',
        penalty_description: '',
        applicablility: '',
        reference: '',
        type: '',
        frequency: '',
        criticality: '',
        due_date_frequency: '',
        first_date: '',
        second_date: '',
        third_date: '',
        last_date: '',
    })

    const [showDateFields, setShowDateFields] = useState(false)
      const [selectedCountry, setSelectedCountry] = useState<string>('INDIA') 
    

    const handleInputChange = (field: string, value: any) => {
        // Special handling for due_date_frequency to show/hide date fields
        if (field === 'due_date_frequency') {
            const shouldShowDates = !['one', 'na'].includes(value.toLowerCase())
            setShowDateFields(shouldShowDates)
        }

        // Handle date values - convert Date object to ISO string or empty string
        if (field.includes('_date')) {
            const dateValue = value ? value.toISOString().split('T')[0] : ''
            setFormData(prev => ({ ...prev, [field]: dateValue }))
            return
        }

        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Options for select fields
    const countryOptions: SelectOption[] = [
        { value: 'india', label: 'India' },
        { value: 'usa', label: 'USA' },
    ]

    const functionOptions: SelectOption[] = [
        { value: 'finance', label: 'Finance' },
        { value: 'hr', label: 'HR' },
        { value: 'operations', label: 'Operations' },
    ]

    const scopeOptions: SelectOption[] = [
        { value: 'central', label: 'Central' },
        { value: 'state', label: 'State' },
    ]

    const legislationOptions: SelectOption[] = [
        { value: 'act1', label: 'Companies Act' },
        { value: 'act2', label: 'Labour Act' },
    ]

    const categoryOptions: SelectOption[] = [
        { value: 'tax', label: 'Tax' },
        { value: 'labor', label: 'Labor' },
    ]

    const penaltyTypeOptions: SelectOption[] = [
        { value: 'fine', label: 'Fine' },
        { value: 'imprisonment', label: 'Imprisonment' },
    ]

    const applicabilityOptions: SelectOption[] = [
        { value: 'all', label: 'All Companies' },
        { value: 'manufacturing', label: 'Manufacturing' },
    ]

    const typeOptions: SelectOption[] = [
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'time_based', label: 'Time Based' },
    ]

    const frequencyOptions: SelectOption[] = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
    ]

    const criticalityOptions: SelectOption[] = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
    ]

    const dueDateFrequencyOptions: SelectOption[] = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'half_yearly', label: 'Half Yearly' },
        { value: 'na', label: 'NA' },
        { value: 'one', label: 'One' },
    ]

    const handleSubmit = () => {
        console.log('Form submitted:', formData)
        // Here you would typically handle form submission
    }

      const selectedCountryOption = countryOptions.find(option => option.value === selectedCountry) || countryOptions[0]


    return (
        <div className="p-2 bg-white rounded-lg">
            <div className="flex gap-1 items-center mb-10">
                <Button
                    size="sm"
                    variant="plain"
                    icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
                    onClick={() => navigate(-1)}
                />
                <h3 className="text-2xl font-semibold">Add Compliance Parameter</h3>
            </div>

            <div className="space-y-6">
                {/* 1st Row: Country and Function */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="mb-2">Country</p>
                        <OutlinedSelect
                            label="Select Country"
                            options={countryOptions}
                                         value={selectedCountryOption} 

                                          onChange={(option) => setSelectedCountry(option?.value || 'INDIA')}

                        />
                    </div>
                    <div>
                        <p className="mb-2">Function</p>
                        <OutlinedSelect
                            label="Select Function"
                            options={functionOptions}
                            value={functionOptions.find(option => option.value === formData.function)}
                            onChange={(selectedOption: SelectOption | null) => 
                                handleInputChange('function', selectedOption?.value || '')
                            }
                        />
                    </div>
                </div>

                {/* 2nd Row: Scope and Legislation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="mb-2">Central/State</p>
                        <OutlinedSelect
                            label="Select Scope"
                            options={scopeOptions}
                            value={scopeOptions.find(option => option.value === formData.scope)}
                            onChange={(selectedOption: SelectOption | null) => 
                                handleInputChange('scope', selectedOption?.value || '')
                            }
                        />
                    </div>
                    <div>
                        <p className="mb-2">Legislation Act</p>
                        <OutlinedSelect
                            label="Select Legislation"
                            options={legislationOptions}
                            value={legislationOptions.find(option => option.value === formData.legislation)}
                            onChange={(selectedOption: SelectOption | null) => 
                                handleInputChange('legislation', selectedOption?.value || '')
                            }
                        />
                    </div>
                </div>

                {/* 3rd Row: Category and Penalty Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="mb-2">Compliance Categorization</p>
                        <OutlinedSelect
                            label="Select Category"
                            options={categoryOptions}
                            value={categoryOptions.find(option => option.value === formData.category)}
                            onChange={(selectedOption: SelectOption | null) => 
                                handleInputChange('category', selectedOption?.value || '')
                            }
                        />
                    </div>
                    <div>
                        <p className="mb-2">Penalty Type</p>
                        <OutlinedSelect
                            label="Select Penalty Type"
                            options={penaltyTypeOptions}
                            value={penaltyTypeOptions.find(option => option.value === formData.penalty_type)}
                            onChange={(selectedOption: SelectOption | null) => 
                                handleInputChange('penalty_type', selectedOption?.value || '')
                            }
                        />
                    </div>
                </div>

                {/* 4th Row: Compliance Header */}
                <div>
                    <p className="mb-2">Compliance Header</p>
                    <OutlinedInput
                        label="Compliance Header"
                        value={formData.header}
                        onChange={(value: string) =>
                            handleInputChange('header', value)
                        }
                    />
                </div>

                {/* 5th Row: Compliance Description */}
                <div>
                    <p className="mb-2">Compliance Description</p>
                    <OutlinedInput
                        label="Compliance Description"
                        value={formData.description}
                        onChange={(value: string) =>
                            handleInputChange('description', value)
                        }
                        textarea={true}
                    />
                </div>

                {/* 6th Row: Penalty Description */}
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

                {/* 7th Row: Applicability and Reference */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="mb-2">Compliance Applicability</p>
                        <OutlinedSelect
                            label="Select Applicability"
                            options={applicabilityOptions}
                            value={applicabilityOptions.find(option => option.value === formData.applicablility)}
                            onChange={(selectedOption: SelectOption | null) => 
                                handleInputChange('applicablility', selectedOption?.value || '')
                            }
                        />
                    </div>
                    <div>
                        <p className="mb-2">Compliance Reference</p>
                        <OutlinedInput
                            label="Compliance Reference"
                            value={formData.reference}
                            onChange={(value: string) =>
                                handleInputChange('reference', value)
                            }
                        />
                    </div>
                </div>

                {/* 8th Row: Type and Frequency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="mb-2">Compliance Type</p>
                        <OutlinedSelect
                            label="Select Type"
                            options={typeOptions}
                            value={typeOptions.find(option => option.value === formData.type)}
                            onChange={(selectedOption: SelectOption | null) => 
                                handleInputChange('type', selectedOption?.value || '')
                            }
                        />
                    </div>
                    <div>
                        <p className="mb-2">Compliance Frequency</p>
                        <OutlinedSelect
                            label="Select Frequency"
                            options={frequencyOptions}
                            value={frequencyOptions.find(option => option.value === formData.frequency)}
                            onChange={(selectedOption: SelectOption | null) => 
                                handleInputChange('frequency', selectedOption?.value || '')
                            }
                        />
                    </div>
                </div>

                {/* 9th Row: Criticality and Due Date Frequency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="mb-2">Criticality</p>
                        <OutlinedSelect
                            label="Select Criticality"
                            options={criticalityOptions}
                            value={criticalityOptions.find(option => option.value === formData.criticality)}
                            onChange={(selectedOption: SelectOption | null) => 
                                handleInputChange('criticality', selectedOption?.value || '')
                            }
                        />
                    </div>
                    <div>
                        <p className="mb-2">Due Date Frequency</p>
                        <OutlinedSelect
                            label="Select Due Date Frequency"
                            options={dueDateFrequencyOptions}
                            value={dueDateFrequencyOptions.find(option => option.value === formData.due_date_frequency)}
                            onChange={(selectedOption: SelectOption | null) => 
                                handleInputChange('due_date_frequency', selectedOption?.value || '')
                            }
                        />
                    </div>
                </div>

                {/* Date fields - conditionally shown */}
                {showDateFields && (
                    <>
                        {/* 10th Row: First and Second Due Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="mb-2">First Due Date</p>
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
                                />
                            </div>
                        </div>

                        {/* 11th Row: Third and Last Due Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="mb-2">Third Due Date</p>
                                <DatePicker
                                    placeholder="Select third due date"
                                    value={formData.third_date ? new Date(formData.third_date) : null}
                                    onChange={(date: Date | null) => handleInputChange('third_date', date)}
                                />
                            </div>
                            <div>
                                <p className="mb-2">Last Due Date</p>
                                <DatePicker
                                    placeholder="Select last due date"
                                    value={formData.last_date ? new Date(formData.last_date) : null}
                                    onChange={(date: Date | null) => handleInputChange('last_date', date)}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Submit and Cancel buttons */}
                <div className="flex justify-end gap-2">
                   
                    <Button
                        type="button"
                        variant="plain"
                        size="sm"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>

                     <Button
                        type="button"
                        variant="solid"
                        size="sm"
                        onClick={handleSubmit}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ComplianceAddForm