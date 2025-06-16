




// import React, { useState, useEffect, useRef, useCallback } from 'react'
// import { Button } from '@/components/ui'
// import { IoArrowBack } from 'react-icons/io5'
// import OutlinedSelect from '@/components/ui/Outlined'
// import OutlinedInput from '@/components/ui/OutlinedInput'
// import { DatePicker } from '@/components/ui/DatePicker'
// import { useNavigate } from 'react-router-dom'
// import { HiPlusCircle, HiDownload } from 'react-icons/hi'
// import { Notification, toast } from '@/components/ui'
// import httpClient from '@/api/http-client'
// import { endpoints } from '@/api/endpoint'
// import { AiOutlineLoading3Quarters } from 'react-icons/ai'
// import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

// interface SelectOption {
//     value: string
//     label: string
// }

// interface ReferenceData {
//     id: number
//     name: string
// }


// interface ComplianceAddFormProps {
//   initialData?: ComplianceFormData;
//   onSubmit: (formData: ComplianceFormData) => Promise<void>;
//   isEditMode?: boolean;
// }


// const ComplianceAddForm = () => {
//     const navigate = useNavigate()
//     const [formData, setFormData] = useState({
//         country: 'INDIA',
//         function: '',
//         scope: 'central',
//         state_id: null,
//         legislation_act: '',
//         compliance_categorization: '',
//         penalty_type: '',
//         compliance_header: '',
//         compliance_description: '',
//         penalty_description: '',
//         compliance_applicability: '',
//         compliance_reference: '',
//         compliance_type: '',
//         compliance_frequency: '',
//         criticality: '',
//         due_date_frequency: '',
//         first_due_date: '',
//         second_due_date: '',
//         third_due_date: '',
//         last_due_date: '',
//     })

//     const [loading, setLoading] = useState(false)
//     const [showStateField, setShowStateField] = useState(false)
//     const [showDateFields, setShowDateFields] = useState(false)
//     const [dateFieldsState, setDateFieldsState] = useState({
//         isSecondDateEnabled: false,
//         isThirdDateEnabled: false,
//         isLastDateEnabled: false,
//     })

//     // Reference data states
//     const [functions, setFunctions] = useState<ReferenceData[]>([])
//     const [legislationActs, setLegislationActs] = useState<ReferenceData[]>([])
//     const [categories, setCategories] = useState<ReferenceData[]>([])
//     const [penaltyTypes, setPenaltyTypes] = useState<ReferenceData[]>([])
//     const [applicabilities, setApplicabilities] = useState<ReferenceData[]>([])
//     const [complianceTypes, setComplianceTypes] = useState<ReferenceData[]>([])
//     const [states, setStates] = useState<ReferenceData[]>([])

//     // Options for select fields
//     const countryOptions: SelectOption[] = [
//         { value: 'INDIA', label: 'India' },
//     ]

//     const scopeOptions: SelectOption[] = [
//         { value: 'central', label: 'Central' },
//         { value: 'state', label: 'State' },
//     ]

//     const frequencyOptions: SelectOption[] = [
//         { value: 'monthly', label: 'Monthly' },
//         { value: 'quarterly', label: 'Quarterly' },
//         { value: 'yearly', label: 'Yearly' },
//         { value: 'half_yearly', label: 'Half Yearly' },
//     ]

//     const criticalityOptions: SelectOption[] = [
//         { value: 'low', label: 'Low' },
//         { value: 'medium', label: 'Medium' },
//         { value: 'high', label: 'High' },
//     ]

//     const dueDateFrequencyOptions: SelectOption[] = [
//         { value: 'monthly', label: 'Monthly' },
//         { value: 'yearly', label: 'Yearly' },
//         { value: 'quarterly', label: 'Quarterly' },
//         { value: 'half_yearly', label: 'Half Yearly' },
//         { value: 'na', label: 'NA' },
//         { value: 'one', label: 'One' },
//     ]

//     // Fetch reference data
//     useEffect(() => {
//         const fetchReferenceData = async () => {
//             try {
//                 setLoading(true)
//                 const [
//                     functionsRes,
//                     legislationRes,
//                     categoriesRes,
//                     penaltyTypesRes,
//                     applicabilitiesRes,
//                     typesRes,
//                     statesRes
//                 ] = await Promise.all([
//                     httpClient.get(endpoints.compliances.functionList()),
//                     httpClient.get(endpoints.compliances.legislationActsList()),
//                     httpClient.get(endpoints.compliances.complianceCategorizationsList()),
//                     httpClient.get(endpoints.compliances.penaltyTypesList()),
//                     httpClient.get(endpoints.compliances.complianceApplicabilityList()),
//                     httpClient.get(endpoints.compliances.complianceTypeList()),
//                     httpClient.get(endpoints.common.getStatesAll())
//                 ])

//                 setFunctions(functionsRes.data.data || [])
//                 setLegislationActs(legislationRes.data.data || [])
//                 setCategories(categoriesRes.data.data || [])
//                 setPenaltyTypes(penaltyTypesRes.data.data || [])
//                 setApplicabilities(applicabilitiesRes.data.data || [])
//                 setComplianceTypes(typesRes.data.data || [])
//                 setStates(statesRes.data || [])
//             } catch (error) {
//                 console.error('Error fetching reference data:', error)
//                 toast.push(
//                     <Notification title="Error" type="error">
//                         Failed to load reference data
//                     </Notification>
//                 )
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchReferenceData()
//     }, [])

//     // Handle scope change to show/hide state field
//     useEffect(() => {
//         setShowStateField(formData.scope === 'state')
//         if (formData.scope !== 'state') {
//             setFormData(prev => ({ ...prev, state_id: null }))
//         }
//     }, [formData.scope])

//     // Handle due date frequency change
//     useEffect(() => {
//         const frequency = formData.due_date_frequency.toLowerCase()
//         const shouldShowDates = !['na', 'one'].includes(frequency)
//         setShowDateFields(shouldShowDates)

//         if (shouldShowDates) {
//             switch (frequency) {
//                 case 'monthly':
//                 case 'yearly':
//                     setDateFieldsState({
//                         isSecondDateEnabled: false,
//                         isThirdDateEnabled: false,
//                         isLastDateEnabled: false
//                     })
//                     break
//                 case 'half_yearly':
//                     setDateFieldsState({
//                         isSecondDateEnabled: false,
//                         isThirdDateEnabled: false,
//                         isLastDateEnabled: true
//                     })
//                     break
//                 case 'quarterly':
//                     setDateFieldsState({
//                         isSecondDateEnabled: true,
//                         isThirdDateEnabled: true,
//                         isLastDateEnabled: true
//                     })
//                     break
//                 default:
//                     setDateFieldsState({
//                         isSecondDateEnabled: false,
//                         isThirdDateEnabled: false,
//                         isLastDateEnabled: false
//                     })
//             }
//         } else {
//             // Reset date fields when frequency is NA or One
//             setFormData(prev => ({
//                 ...prev,
//                 first_due_date: '',
//                 second_due_date: '',
//                 third_due_date: '',
//                 last_due_date: ''
//             }))
//         }
//     }, [formData.due_date_frequency])

//     const handleInputChange = useCallback((field: string, value: any) => {
//     // Handle date values - convert Date object to ISO string or empty string
//     if (field.includes('_due_date')) {
//         const dateValue = value ? value.toISOString().split('T')[0] : ''
//         setFormData(prev => ({ ...prev, [field]: dateValue }))
//         return
//     }

//     setFormData(prev => ({ ...prev, [field]: value }))
// }, [])

// const handleFunctionChange = useCallback((value: string) => {
//     setFormData(prev => ({ ...prev, function: value }))
// }, [])

// const handleLegislationActChange = useCallback((value: string) => {
//     setFormData(prev => ({ ...prev, legislation_act: value }))
// }, [])

// const handleComplianceCategoryChange = useCallback((value: string) => {
//     setFormData(prev => ({ ...prev, compliance_categorization: value }))
// }, [])

// const handlePenaltyTypeChange = useCallback((value: string) => {
//     setFormData(prev => ({ ...prev, penalty_type: value }))
// }, [])

// const handleComplianceApplicabilityChange = useCallback((value: string) => {
//     setFormData(prev => ({ ...prev, compliance_applicability: value }))
// }, [])

// const handleComplianceTypeChange = useCallback((value: string) => {
//     setFormData(prev => ({ ...prev, compliance_type: value }))
// }, [])



//     const handleSubmit = async () => {
//         try {
//             setLoading(true)
            
//             // Prepare due_dates object based on frequency
//             let dueDates = {}
//             const frequency = formData.due_date_frequency.toLowerCase()
            
//             if (frequency === 'monthly' || frequency === 'yearly') {
//                 dueDates = { first_due_date: formData.first_due_date }
//             } else if (frequency === 'half_yearly') {
//                 dueDates = {
//                     first_due_date: formData.first_due_date,
//                     last_due_date: formData.last_due_date
//                 }
//             } else if (frequency === 'quarterly') {
//                 dueDates = {
//                     first_due_date: formData.first_due_date,
//                     second_due_date: formData.second_due_date,
//                     third_due_date: formData.third_due_date,
//                     last_due_date: formData.last_due_date
//                 }
//             }

//             const payload = {
//                 country: formData.country,
//                 function: formData.function,
//                 applicable: formData.scope,
//                 state_id: formData.scope === 'state' ? Number(formData.state_id) : null,
//                 legislation_act: formData.legislation_act,
//                 compliance_categorization: formData.compliance_categorization,
//                 penalty_type: formData.penalty_type,
//                 compliance_header: formData.compliance_header,
//                 compliance_description: formData.compliance_description,
//                 penalty_description: formData.penalty_description,
//                 compliance_applicability: formData.compliance_applicability,
//                 compliance_reference: formData.compliance_reference,
//                 compliance_type: formData.compliance_type,
//                 compliance_frequency: formData.compliance_frequency,
//                 criticality: formData.criticality,
//                 due_date_frequency: formData.due_date_frequency,
//                 due_dates: dueDates,
//                 is_active: true
//             }

//             const response = await httpClient.post(
//                 endpoints.compliances.createcompliance(),
//                 payload
//             )

//             toast.push(
//                 <Notification title="Success" type="success">
//                     Compliance created successfully
//                 </Notification>
//             )
//             navigate('/auditSetup')
//         } catch (error: any) {
//             console.error('Error creating compliance:', error)
//             const errorMessage = error.response?.data?.message || 'Failed to create compliance'
//             toast.push(
//                 <Notification title="Error" type="error">
//                     {errorMessage}
//                 </Notification>
//             )
//         } finally {
//             setLoading(false)
//         }
//     }

// // Complete Fixed AutoSuggest component
// const AutoSuggestField = ({
//   value,
//   options,
//   onChange,
//   onCreate,
//   label,
//   placeholder,
//   isLoading
// }: {
//   value: string
//   options: ReferenceData[]
//   onChange: (value: string) => void
//   onCreate?: (value: string) => Promise<void>
//   label: string
//   placeholder: string
//   isLoading: boolean
// }) => {
//   const [isOpen, setIsOpen] = useState(false)
//   const [filteredOptions, setFilteredOptions] = useState<ReferenceData[]>(options)
//   const [isCreating, setIsCreating] = useState(false)
//   const [inputValue, setInputValue] = useState(value)
//   const wrapperRef = useRef<HTMLDivElement>(null)

//   // Update input value when prop changes
//   useEffect(() => {
//     setInputValue(value)
//   }, [value])

//   // Filter options based on input value
//   useEffect(() => {
//     if (inputValue) {
//       const filtered = options.filter(option =>
//         option.name.toLowerCase().includes(inputValue.toLowerCase())
//       )
//       setFilteredOptions(filtered)
//     } else {
//       setFilteredOptions(options)
//     }
//   }, [inputValue, options])

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = e.target.value
//     setInputValue(newValue)
//     onChange(newValue)
//     setIsOpen(true)
//   }


//     const handleCreate = async (newValue: string) => {
//         if (!onCreate || isCreating) return
        
//         setIsCreating(true)
//         try {
//             await onCreate(newValue)
//             setIsOpen(false)
//         } catch (error) {
//             console.error('Error creating:', error)
//         } finally {
//             setIsCreating(false)
//         }
//     }

//     const handleKeyDown = (event: React.KeyboardEvent) => {
//         if (event.key === 'Enter' && onCreate && value) {
//             event.preventDefault()
//             handleCreate(value)
//         }
//     }

//     return (
//         <div className="relative" ref={wrapperRef}>
//             <p className="mb-2">{label}</p>
//             <div className="relative">
//                 {/* Use the same OutlinedInput structure as your working version */}
//                 <div className="relative">
//                     <div className="absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none border-gray-300">
//                         <span
//                             className={`absolute px-1 transition-all duration-200 ${
//                                 (isOpen || value !== '')
//                                     ? '-top-3 left-3 text-xs font-semibold bg-white text-indigo-600'
//                                     : 'top-2 left-2 text-sm text-gray-500'
//                             }`}
//                         >
//                             {placeholder}
//                         </span>
//                     </div>
//                     <input
//     type="text"
//     value={inputValue}
//     onChange={handleInputChange}
//     onFocus={() => setIsOpen(true)}
//     onKeyDown={handleKeyDown}
//     className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
//     disabled={isLoading || isCreating}
//   />
//                 </div>
//                 <button
//                     onClick={() => setIsOpen(!isOpen)}
//                     type="button"
//                     className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
//                     disabled={isLoading || isCreating}
//                 >
//                     {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
//                 </button>
//             </div>

//             {isOpen && (
//                 <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
//                     {isLoading ? (
//                         <div className="p-2 text-gray-500 flex items-center justify-center">
//                             <AiOutlineLoading3Quarters className="animate-spin mr-2" />
//                             Loading...
//                         </div>
//                     ) : filteredOptions.length > 0 ? (
//                         <ul className="max-h-60 overflow-auto">
//                             {filteredOptions.map((option) => (
//                                 <li
//                                     key={option.id}
//                                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                                     onClick={() => {
//                                         onChange(option.name)
//                                         setIsOpen(false)
//                                     }}
//                                 >
//                                     {option.name}
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : value && onCreate ? (
//                         <div 
//                             className={`p-2 text-gray-600 ${
//                                 isCreating 
//                                     ? 'cursor-wait bg-gray-50' 
//                                     : 'cursor-pointer hover:bg-gray-100'
//                             } flex items-center justify-center`}
//                             onClick={() => !isCreating && handleCreate(value)}
//                         >
//                             {isCreating ? (
//                                 <>
//                                     <AiOutlineLoading3Quarters className="animate-spin mr-2" />
//                                     Creating "{value}"...
//                                 </>
//                             ) : (
//                                 <>Press Enter to create "{value}"</>
//                             )}
//                         </div>
//                     ) : (
//                         <div className="p-2 text-gray-500">No options found</div>
//                     )}
//                 </div>
//             )}
//         </div>
//     )
// }

//     const createReferenceData = async (endpoint: string, name: string) => {
//         try {
//             const response = await httpClient.post(endpoint, { name })
//             return response.data
//         } catch (error) {
//             console.error('Error creating reference data:', error)
//             throw error
//         }
//     }

//     return (
//         <div className="p-2 bg-white rounded-lg">
//             <div className="flex gap-1 items-center mb-10">
//                 <Button
//                     size="sm"
//                     variant="plain"
//                     icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
//                     onClick={() => navigate(-1)}
//                 />
//                 <h3 className="text-2xl font-semibold">Add Compliance Parameter</h3>
//             </div>

//             <div className="space-y-6">
//                 {/* 1st Row: Country and Function */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <p className="mb-2">Country</p>
//                         <OutlinedSelect
//                             label="Select Country"
//                             options={countryOptions}
//                             value={countryOptions.find(opt => opt.value === formData.country) || countryOptions[0]}
//                             onChange={(option) => handleInputChange('country', option?.value || 'INDIA')}
//                         />
//                     </div>
//                     <div>
//                         <AutoSuggestField
//                             value={formData.function}
//                             options={functions}
//                             onChange={(val) => handleInputChange('function', val)}
//                             onCreate={(val) => createReferenceData(
//                                 endpoints.compliances.createfunctions(),
//                                 val
//                             )}
//                             label="Function"
//                             placeholder="Select Function"
//                             isLoading={loading}
//                         />
//                     </div>
//                 </div>

//                 {/* 2nd Row: Scope and Legislation */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <p className="mb-2">Central/State</p>
//                         <OutlinedSelect
//                             label="Select Scope"
//                             options={scopeOptions}
//                             value={scopeOptions.find(opt => opt.value === formData.scope) || scopeOptions[0]}
//                             onChange={(option) => handleInputChange('scope', option?.value || 'central')}
//                         />
//                     </div>
//                     <div>
//                         <AutoSuggestField
//                             value={formData.legislation_act}
//                             options={legislationActs}
//                             onChange={handleLegislationActChange} 
//                             onCreate={(val) => createReferenceData(
//                                 endpoints.compliances.createlegislationActs(),
//                                 val
//                             )}
//                             label="Legislation Act"
//                             placeholder="Select Legislation Act"
//                             isLoading={loading}
//                         />
//                     </div>
//                 </div>

//                 {/* State field - conditionally shown */}
//                 {showStateField && (
//                     <div>
//                         <p className="mb-2">State</p>
//                         <OutlinedSelect
//                             label="Select State"
//                             options={states.map(state => ({
//                                 value: String(state.id),
//                                 label: state.name
//                             }))}
//                             value={states.find(state => String(state.id) === String(formData.state_id)) ? {
//                                 value: String(formData.state_id),
//                                 label: states.find(state => String(state.id) === String(formData.state_id))?.name || ''
//                             } : null}
//                             onChange={(option) => handleInputChange('state_id', option?.value || null)}
//                         />
//                     </div>
//                 )}

//                 {/* 3rd Row: Category and Penalty Type */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <AutoSuggestField
//                             value={formData.compliance_categorization}
//                             options={categories}
//                             onChange={handleComplianceCategoryChange} 
//                             onCreate={(val) => createReferenceData(
//                                 endpoints.compliances.createcomplianceCategorizations(),
//                                 val
//                             )}
//                             label="Compliance Categorization"
//                             placeholder="Select Category"
//                             isLoading={loading}
//                         />
//                     </div>
//                     <div>
//                         <AutoSuggestField
//                             value={formData.penalty_type}
//                             options={penaltyTypes}
//                            onChange={handlePenaltyTypeChange} 
//                             onCreate={(val) => createReferenceData(
//                                 endpoints.compliances.createpenaltyTypes(),
//                                 val
//                             )}
//                             label="Penalty Type"
//                             placeholder="Select Penalty Type"
//                             isLoading={loading}
//                         />
//                     </div>
//                 </div>

//                 {/* 4th Row: Compliance Header */}
//                 <div>
//                     <p className="mb-2">Compliance Header</p>
//                     <OutlinedInput
//                         label="Compliance Header"
//                         value={formData.compliance_header}
//                         onChange={(value: string) =>
//                             handleInputChange('compliance_header', value)
//                         }
//                     />
//                 </div>

//                 {/* 5th Row: Compliance Description */}
//                 <div>
//                     <p className="mb-2">Compliance Description</p>
//                     <OutlinedInput
//                         label="Compliance Description"
//                         value={formData.compliance_description}
//                         onChange={(value: string) =>
//                             handleInputChange('compliance_description', value)
//                         }
//                         textarea={true}
//                     />
//                 </div>

//                 {/* 6th Row: Penalty Description */}
//                 <div>
//                     <p className="mb-2">Penalty Description</p>
//                     <OutlinedInput
//                         label="Penalty Description"
//                         value={formData.penalty_description}
//                         onChange={(value: string) =>
//                             handleInputChange('penalty_description', value)
//                         }
//                         textarea={true}
//                     />
//                 </div>

//                 {/* 7th Row: Applicability and Reference */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <AutoSuggestField
//                             value={formData.compliance_applicability}
//                             options={applicabilities}
//                             onChange={handleComplianceApplicabilityChange} 
//                             onCreate={(val) => createReferenceData(
//                                 endpoints.compliances.createcomplianceApplicability(),
//                                 val
//                             )}
//                             label="Compliance Applicability"
//                             placeholder="Select Applicability"
//                             isLoading={loading}
//                         />
//                     </div>
//                     <div>
//                         <p className="mb-2">Compliance Reference</p>
//                         <OutlinedInput
//                             label="Compliance Reference"
//                             value={formData.compliance_reference}
//                             onChange={(value: string) =>
//                                 handleInputChange('compliance_reference', value)
//                             }
//                         />
//                     </div>
//                 </div>

//                 {/* 8th Row: Type and Frequency */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <AutoSuggestField
//                             value={formData.compliance_type}
//                             options={complianceTypes}
//                             onChange={handleComplianceTypeChange} 
//                             onCreate={(val) => createReferenceData(
//                                 endpoints.compliances.createcomplianceType(),
//                                 val
//                             )}
//                             label="Compliance Type"
//                             placeholder="Select Type"
//                             isLoading={loading}
//                         />
//                     </div>
//                     <div>
//                         <p className="mb-2">Compliance Frequency</p>
//                         <OutlinedSelect
//                             label="Select Frequency"
//                             options={frequencyOptions}
//                             value={frequencyOptions.find(opt => opt.value === formData.compliance_frequency) || null}
//                             onChange={(option) => handleInputChange('compliance_frequency', option?.value || '')}
//                         />
//                     </div>
//                 </div>

//                 {/* 9th Row: Criticality and Due Date Frequency */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                         <p className="mb-2">Criticality</p>
//                         <OutlinedSelect
//                             label="Select Criticality"
//                             options={criticalityOptions}
//                             value={criticalityOptions.find(opt => opt.value === formData.criticality) || null}
//                             onChange={(option) => handleInputChange('criticality', option?.value || '')}
//                         />
//                     </div>
//                     <div>
//                         <p className="mb-2">Due Date Frequency</p>
//                         <OutlinedSelect
//                             label="Select Due Date Frequency"
//                             options={dueDateFrequencyOptions}
//                             value={dueDateFrequencyOptions.find(opt => opt.value === formData.due_date_frequency) || null}
//                             onChange={(option) => handleInputChange('due_date_frequency', option?.value || '')}
//                         />
//                     </div>
//                 </div>

//                 {/* Date fields - conditionally shown */}
//                 {showDateFields && (
//                     <>
//                         {/* First Due Date */}
//                         <div>
//                             <p className="mb-2">First Due Date</p>
//                             <DatePicker
//                                 placeholder="Select first due date"
//                                 value={formData.first_due_date ? new Date(formData.first_due_date) : null}
//                                 onChange={(date) => handleInputChange('first_due_date', date)}
//                             />
//                         </div>

//                         {/* Second Due Date - conditionally shown */}
//                         {dateFieldsState.isSecondDateEnabled && (
//                             <div>
//                                 <p className="mb-2">Second Due Date</p>
//                                 <DatePicker
//                                     placeholder="Select second due date"
//                                     value={formData.second_due_date ? new Date(formData.second_due_date) : null}
//                                     onChange={(date) => handleInputChange('second_due_date', date)}
//                                 />
//                             </div>
//                         )}

//                         {/* Third Due Date - conditionally shown */}
//                         {dateFieldsState.isThirdDateEnabled && (
//                             <div>
//                                 <p className="mb-2">Third Due Date</p>
//                                 <DatePicker
//                                     placeholder="Select third due date"
//                                     value={formData.third_due_date ? new Date(formData.third_due_date) : null}
//                                     onChange={(date) => handleInputChange('third_due_date', date)}
//                                 />
//                             </div>
//                         )}

//                         {/* Last Due Date - conditionally shown */}
//                         {dateFieldsState.isLastDateEnabled && (
//                             <div>
//                                 <p className="mb-2">Last Due Date</p>
//                                 <DatePicker
//                                     placeholder="Select last due date"
//                                     value={formData.last_due_date ? new Date(formData.last_due_date) : null}
//                                     onChange={(date) => handleInputChange('last_due_date', date)}
//                                 />
//                             </div>
//                         )}
//                     </>
//                 )}

//                 {/* Submit and Cancel buttons */}
//                 <div className="flex justify-end gap-2">
//                     <Button
//                         type="button"
//                         variant="plain"
//                         size="sm"
//                         onClick={() => navigate(-1)}
//                     >
//                         Cancel
//                     </Button>

//                     <Button
//                         type="button"
//                         variant="solid"
//                         size="sm"
//                         onClick={handleSubmit}
//                         loading={loading}
//                         icon={loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : null}
//                     >
//                         Confirm
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ComplianceAddForm





























import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui';
import { IoArrowBack } from 'react-icons/io5';
import OutlinedSelect from '@/components/ui/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { DatePicker } from '@/components/ui/DatePicker';
import { useNavigate } from 'react-router-dom';
import { HiPlusCircle } from 'react-icons/hi';
import { Notification, toast } from '@/components/ui';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { ComplianceFormData, ReferenceData, SelectOption } from '@/@types/compliance';

interface ComplianceAddFormProps {
  initialData?: ComplianceFormData;
  onSubmit?: (formData: ComplianceFormData) => Promise<void>;
  isEditMode?: boolean;
}

const ComplianceAddForm: React.FC<ComplianceAddFormProps> = ({
  initialData,
  onSubmit,
  isEditMode = false
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ComplianceFormData>(initialData || {
    country: 'INDIA',
    function: '',
    scope: 'central',
    state_id: null,
    legislation_act: '',
    compliance_categorization: '',
    penalty_type: '',
    compliance_header: '',
    compliance_description: '',
    penalty_description: '',
    compliance_applicability: '',
    compliance_reference: '',
    compliance_type: '',
    compliance_frequency: '',
    criticality: '',
    due_date_frequency: '',
    due_dates: {}
  });

  const [loading, setLoading] = useState(false);
  const [showStateField, setShowStateField] = useState(false);
  const [showDateFields, setShowDateFields] = useState(false);
  const [dateFieldsState, setDateFieldsState] = useState({
    isSecondDateEnabled: false,
    isThirdDateEnabled: false,
    isLastDateEnabled: false,
  });

  // Reference data states
  const [functions, setFunctions] = useState<ReferenceData[]>([]);
  const [legislationActs, setLegislationActs] = useState<ReferenceData[]>([]);
  const [categories, setCategories] = useState<ReferenceData[]>([]);
  const [penaltyTypes, setPenaltyTypes] = useState<ReferenceData[]>([]);
  const [applicabilities, setApplicabilities] = useState<ReferenceData[]>([]);
  const [complianceTypes, setComplianceTypes] = useState<ReferenceData[]>([]);
  const [states, setStates] = useState<ReferenceData[]>([]);

  // Options for select fields
  const countryOptions: SelectOption[] = [
    { value: 'INDIA', label: 'India' },
  ];

  const scopeOptions: SelectOption[] = [
    { value: 'central', label: 'Central' },
    { value: 'state', label: 'State' },
  ];

  const frequencyOptions: SelectOption[] = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'half_yearly', label: 'Half Yearly' },
  ];

  const criticalityOptions: SelectOption[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const dueDateFrequencyOptions: SelectOption[] = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'half_yearly', label: 'Half Yearly' },
    { value: 'na', label: 'NA' },
    { value: 'one', label: 'One' },
  ];

  // Fetch reference data
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        setLoading(true);
        const [
          functionsRes,
          legislationRes,
          categoriesRes,
          penaltyTypesRes,
          applicabilitiesRes,
          typesRes,
          statesRes
        ] = await Promise.all([
          httpClient.get(endpoints.compliances.functionList()),
          httpClient.get(endpoints.compliances.legislationActsList()),
          httpClient.get(endpoints.compliances.complianceCategorizationsList()),
          httpClient.get(endpoints.compliances.penaltyTypesList()),
          httpClient.get(endpoints.compliances.complianceApplicabilityList()),
          httpClient.get(endpoints.compliances.complianceTypeList()),
          httpClient.get(endpoints.common.getStatesAll())
        ]);

        setFunctions(functionsRes.data.data || []);
        setLegislationActs(legislationRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
        setPenaltyTypes(penaltyTypesRes.data.data || []);
        setApplicabilities(applicabilitiesRes.data.data || []);
        setComplianceTypes(typesRes.data.data || []);
        setStates(statesRes.data || []);
      } catch (error) {
        console.error('Error fetching reference data:', error);
        toast.push(
          <Notification title="Error" type="error">
            Failed to load reference data
          </Notification>
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReferenceData();
  }, []);

  // Handle scope change to show/hide state field
  useEffect(() => {
    setShowStateField(formData.scope === 'state');
    if (formData.scope !== 'state') {
      setFormData(prev => ({ ...prev, state_id: null }));
    }
  }, [formData.scope]);

  // Handle due date frequency change
  useEffect(() => {
    const frequency = formData.due_date_frequency.toLowerCase();
    const shouldShowDates = !['na', 'one'].includes(frequency);
    setShowDateFields(shouldShowDates);

    if (shouldShowDates) {
      switch (frequency) {
        case 'monthly':
        case 'yearly':
          setDateFieldsState({
            isSecondDateEnabled: false,
            isThirdDateEnabled: false,
            isLastDateEnabled: false
          });
          break;
        case 'half_yearly':
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
        default:
          setDateFieldsState({
            isSecondDateEnabled: false,
            isThirdDateEnabled: false,
            isLastDateEnabled: false
          });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        due_dates: {}
      }));
    }
  }, [formData.due_date_frequency]);

  const handleInputChange = useCallback((field: string, value: any) => {
    if (field.includes('_due_date')) {
      const dateValue = value ? value.toISOString().split('T')[0] : '';
      setFormData(prev => ({
        ...prev,
        due_dates: {
          ...prev.due_dates,
          [field]: dateValue
        }
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        applicable: formData.scope,
        state_id: formData.scope === 'state' ? Number(formData.state_id) : null,
        is_active: true
      };

      if (isEditMode && onSubmit) {
        await onSubmit(payload);
      } else {
        await httpClient.post(
          endpoints.compliances.createcompliance(),
          payload
        );
        toast.push(
          <Notification title="Success" type="success">
            Compliance {isEditMode ? 'updated' : 'created'} successfully
          </Notification>
        );
        navigate('/auditSetup');
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} compliance`;
      toast.push(
        <Notification title="Error" type="error">
          {errorMessage}
        </Notification>
      );
    } finally {
      setLoading(false);
    }
  };

  const AutoSuggestField: React.FC<{
    value: string;
    options: ReferenceData[];
    onChange: (value: string) => void;
    onCreate?: (value: string) => Promise<void>;
    label: string;
    placeholder: string;
    isLoading: boolean;
  }> = ({
    value,
    options,
    onChange,
    onCreate,
    label,
    placeholder,
    isLoading
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState<ReferenceData[]>(options);
    const [isCreating, setIsCreating] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    useEffect(() => {
      if (inputValue) {
        const filtered = options.filter(option =>
          option.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredOptions(filtered);
      } else {
        setFilteredOptions(options);
      }
    }, [inputValue, options]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange(newValue);
      setIsOpen(true);
    };

    const handleCreate = async (newValue: string) => {
      if (!onCreate || isCreating) return;
      
      setIsCreating(true);
      try {
        await onCreate(newValue);
        setInputValue(newValue);
        onChange(newValue);
        setIsOpen(false);
      } catch (error) {
        console.error('Error creating:', error);
      } finally {
        setIsCreating(false);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && onCreate && inputValue) {
        e.preventDefault();
        handleCreate(inputValue);
      }
    };

    return (
      <div className="relative" ref={wrapperRef}>
        <p className="mb-2">{label}</p>
        <div className="relative">
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none border-gray-300">
              <span
                className={`absolute px-1 transition-all duration-200 ${
                  (isOpen || inputValue !== '')
                    ? '-top-3 left-3 text-xs font-semibold bg-white text-indigo-600'
                    : 'top-2 left-2 text-sm text-gray-500'
                }`}
              >
                {placeholder}
              </span>
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
              disabled={isLoading || isCreating}
            />
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
            disabled={isLoading || isCreating}
          >
            {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            {isLoading ? (
              <div className="p-2 text-gray-500 flex items-center justify-center">
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                Loading...
              </div>
            ) : filteredOptions.length > 0 ? (
              <ul className="max-h-60 overflow-auto">
                {filteredOptions.map((option) => (
                  <li
                    key={option.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      onChange(option.name);
                      setInputValue(option.name);
                      setIsOpen(false);
                    }}
                  >
                    {option.name}
                  </li>
                ))}
              </ul>
            ) : inputValue && onCreate ? (
              <div 
                className={`p-2 text-gray-600 ${
                  isCreating 
                    ? 'cursor-wait bg-gray-50' 
                    : 'cursor-pointer hover:bg-gray-100'
                } flex items-center justify-center`}
                onClick={() => !isCreating && handleCreate(inputValue)}
              >
                {isCreating ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                    Creating "{inputValue}"...
                  </>
                ) : (
                  <>Press Enter to create "{inputValue}"</>
                )}
              </div>
            ) : (
              <div className="p-2 text-gray-500">No options found</div>
            )}
          </div>
        )}
      </div>
    );
  };

  const createReferenceData = async (endpoint: string, name: string) => {
    try {
      const response = await httpClient.post(endpoint, { name });
      return response.data;
    } catch (error) {
      console.error('Error creating reference data:', error);
      throw error;
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
        />
        <h3 className="text-2xl font-semibold">
          {isEditMode ? 'Edit' : 'Add'} Compliance Parameter
        </h3>
      </div>

      <div className="space-y-6">
        {/* 1st Row: Country and Function */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2">Country</p>
            <OutlinedSelect
              label="Select Country"
              options={countryOptions}
              value={countryOptions.find(opt => opt.value === formData.country) || countryOptions[0]}
              onChange={(option) => handleInputChange('country', option?.value || 'INDIA')}
            />
          </div>
          <div>
            <AutoSuggestField
              value={formData.function}
              options={functions}
              onChange={(val) => handleInputChange('function', val)}
              onCreate={(val) => createReferenceData(
                endpoints.compliances.createfunctions(),
                val
              )}
              label="Function"
              placeholder="Select Function"
              isLoading={loading}
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
              value={scopeOptions.find(opt => opt.value === formData.scope) || scopeOptions[0]}
              onChange={(option) => handleInputChange('scope', option?.value || 'central')}
            />
          </div>
          <div>
            <AutoSuggestField
              value={formData.legislation_act}
              options={legislationActs}
              onChange={(val) => handleInputChange('legislation_act', val)}
              onCreate={(val) => createReferenceData(
                endpoints.compliances.createlegislationActs(),
                val
              )}
              label="Legislation Act"
              placeholder="Select Legislation Act"
              isLoading={loading}
            />
          </div>
        </div>

        {/* State field - conditionally shown */}
        {showStateField && (
          <div>
            <p className="mb-2">State</p>
            <OutlinedSelect
              label="Select State"
              options={states.map(state => ({
                value: String(state.id),
                label: state.name
              }))}
              value={states.find(state => String(state.id) === String(formData.state_id)) ? {
                value: String(formData.state_id),
                label: states.find(state => String(state.id) === String(formData.state_id))?.name || ''
              } : null}
              onChange={(option) => handleInputChange('state_id', option?.value || null)}
            />
          </div>
        )}

        {/* 3rd Row: Category and Penalty Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <AutoSuggestField
              value={formData.compliance_categorization}
              options={categories}
              onChange={(val) => handleInputChange('compliance_categorization', val)}
              onCreate={(val) => createReferenceData(
                endpoints.compliances.createcomplianceCategorizations(),
                val
              )}
              label="Compliance Categorization"
              placeholder="Select Category"
              isLoading={loading}
            />
          </div>
          <div>
            <AutoSuggestField
              value={formData.penalty_type}
              options={penaltyTypes}
              onChange={(val) => handleInputChange('penalty_type', val)}
              onCreate={(val) => createReferenceData(
                endpoints.compliances.createpenaltyTypes(),
                val
              )}
              label="Penalty Type"
              placeholder="Select Penalty Type"
              isLoading={loading}
            />
          </div>
        </div>

        {/* 4th Row: Compliance Header */}
        <div>
          <p className="mb-2">Compliance Header</p>
          <OutlinedInput
  label="Compliance Header"
  value={formData.compliance_header}
  onChange={(value) => handleInputChange('compliance_header', value)}
/>
        </div>

        {/* 5th Row: Compliance Description */}
        <div>
          <p className="mb-2">Compliance Description</p>
          <OutlinedInput
  label="Compliance Description"
  value={formData.compliance_description}
  onChange={(value) => handleInputChange('compliance_description', value)}
  textarea={true}
/>
        </div>

        {/* 6th Row: Penalty Description */}
        <div>
          <p className="mb-2">Penalty Description</p>
          <OutlinedInput
  label="Penalty Description"
  value={formData.penalty_description}
  onChange={(value) => handleInputChange('penalty_description', value)}
  textarea={true}
/>
        </div>

        {/* 7th Row: Applicability and Reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <AutoSuggestField
              value={formData.compliance_applicability}
              options={applicabilities}
              onChange={(val) => handleInputChange('compliance_applicability', val)}
              onCreate={(val) => createReferenceData(
                endpoints.compliances.createcomplianceApplicability(),
                val
              )}
              label="Compliance Applicability"
              placeholder="Select Applicability"
              isLoading={loading}
            />
          </div>
          <div>
            <p className="mb-2">Compliance Reference</p>
           <OutlinedInput
  label="Compliance Reference"
  value={formData.compliance_reference}
  onChange={(value) => handleInputChange('compliance_reference', value)}
/>
          </div>
        </div>

        {/* 8th Row: Type and Frequency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <AutoSuggestField
              value={formData.compliance_type}
              options={complianceTypes}
              onChange={(val) => handleInputChange('compliance_type', val)}
              onCreate={(val) => createReferenceData(
                endpoints.compliances.createcomplianceType(),
                val
              )}
              label="Compliance Type"
              placeholder="Select Type"
              isLoading={loading}
            />
          </div>
          <div>
            <p className="mb-2">Compliance Frequency</p>
            <OutlinedSelect
              label="Select Frequency"
              options={frequencyOptions}
              value={frequencyOptions.find(opt => opt.value === formData.compliance_frequency) || null}
              onChange={(option) => handleInputChange('compliance_frequency', option?.value || '')}
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
              value={criticalityOptions.find(opt => opt.value === formData.criticality) || null}
              onChange={(option) => handleInputChange('criticality', option?.value || '')}
            />
          </div>
          <div>
            <p className="mb-2">Due Date Frequency</p>
            <OutlinedSelect
              label="Select Due Date Frequency"
              options={dueDateFrequencyOptions}
              value={dueDateFrequencyOptions.find(opt => opt.value === formData.due_date_frequency) || null}
              onChange={(option) => handleInputChange('due_date_frequency', option?.value || '')}
            />
          </div>
        </div>

        {/* Date fields - conditionally shown */}
        {showDateFields && (
          <>
            {/* First Due Date */}
            <div>
              <p className="mb-2">First Due Date</p>
              <DatePicker
                placeholder="Select first due date"
                value={formData.due_dates.first_due_date ? new Date(formData.due_dates.first_due_date) : null}
                onChange={(date) => handleInputChange('first_due_date', date)}
              />
            </div>

            {/* Second Due Date - conditionally shown */}
            {dateFieldsState.isSecondDateEnabled && (
              <div>
                <p className="mb-2">Second Due Date</p>
                <DatePicker
                  placeholder="Select second due date"
                  value={formData.due_dates.second_due_date ? new Date(formData.due_dates.second_due_date) : null}
                  onChange={(date) => handleInputChange('second_due_date', date)}
                />
              </div>
            )}

            {/* Third Due Date - conditionally shown */}
            {dateFieldsState.isThirdDateEnabled && (
              <div>
                <p className="mb-2">Third Due Date</p>
                <DatePicker
                  placeholder="Select third due date"
                  value={formData.due_dates.third_due_date ? new Date(formData.due_dates.third_due_date) : null}
                  onChange={(date) => handleInputChange('third_due_date', date)}
                />
              </div>
            )}

            {/* Last Due Date - conditionally shown */}
            {dateFieldsState.isLastDateEnabled && (
              <div>
                <p className="mb-2">Last Due Date</p>
                <DatePicker
                  placeholder="Select last due date"
                  value={formData.due_dates.last_due_date ? new Date(formData.due_dates.last_due_date) : null}
                  onChange={(date) => handleInputChange('last_due_date', date)}
                />
              </div>
            )}
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
            loading={loading}
            icon={loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : null}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceAddForm;