// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { Button } from '@/components/ui';
// import { IoArrowBack } from 'react-icons/io5';
// import OutlinedSelect from '@/components/ui/Outlined';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// import { DatePicker } from '@/components/ui/DatePicker';
// import { useNavigate } from 'react-router-dom';
// import { HiPlusCircle } from 'react-icons/hi';
// import { Notification, toast } from '@/components/ui';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import { AiOutlineLoading3Quarters } from 'react-icons/ai';
// import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
// import { ComplianceFormData, ReferenceData, SelectOption } from '@/@types/compliance';
// import FunctionAutoSuggest from './FunctionAutoSuggest';

// interface ComplianceAddFormProps {
//   initialData?: ComplianceFormData;
//   onSubmit?: (formData: ComplianceFormData) => Promise<void>;
//   isEditMode?: boolean;
// }

// const ComplianceAddForm: React.FC<ComplianceAddFormProps> = ({
//   initialData,
//   onSubmit,
//   isEditMode = false
// }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<ComplianceFormData>(initialData || {
//     country: 'INDIA',
//     function: '',
//     applicable: 'central', // Initialize with 'central'
//     state_id: null,
//     legislation_act: '',
//     compliance_categorization: '',
//     penalty_type: '',
//     compliance_header: '',
//     compliance_description: '',
//     penalty_description: '',
//     compliance_applicability: '',
//     compliance_reference: '',
//     compliance_type: '',
//     compliance_frequency: '',
//     criticality: '',
//     due_date_frequency: '',
//     due_dates: {},
//     is_active: true
//   });

//   const [loading, setLoading] = useState(false);
//   const [showStateField, setShowStateField] = useState(false);
//   const [showDateFields, setShowDateFields] = useState(false);
//   const [dateFieldsState, setDateFieldsState] = useState({
//     isSecondDateEnabled: false,
//     isThirdDateEnabled: false,
//     isLastDateEnabled: false,
//   });

//   // Reference data states
//   const [functions, setFunctions] = useState<ActOption[]>([]);
//   const [legislationActs, setLegislationActs] = useState<ReferenceData[]>([]);
//   const [categories, setCategories] = useState<ReferenceData[]>([]);
//   const [penaltyTypes, setPenaltyTypes] = useState<ReferenceData[]>([]);
//   const [applicabilities, setApplicabilities] = useState<ReferenceData[]>([]);
//   const [complianceTypes, setComplianceTypes] = useState<ReferenceData[]>([]);
//   const [states, setStates] = useState<ReferenceData[]>([]);

//   // Options for select fields
//   const countryOptions: SelectOption[] = [
//     { value: 'INDIA', label: 'India' },
//   ];

//   const applicableOptions: SelectOption[] = [
//     { value: 'central', label: 'Central' },
//     { value: 'state', label: 'State' },
//   ];

//   const frequencyOptions: SelectOption[] = [
//     { value: 'monthly', label: 'Monthly' },
//     { value: 'quarterly', label: 'Quarterly' },
//     { value: 'yearly', label: 'Yearly' },
//     { value: 'half_yearly', label: 'Half Yearly' },
//   ];

//   const criticalityOptions: SelectOption[] = [
//     { value: 'low', label: 'Low' },
//     { value: 'medium', label: 'Medium' },
//     { value: 'high', label: 'High' },
//   ];

//   const dueDateFrequencyOptions: SelectOption[] = [
//     { value: 'monthly', label: 'Monthly' },
//     { value: 'yearly', label: 'Yearly' },
//     { value: 'quarterly', label: 'Quarterly' },
//     { value: 'half_yearly', label: 'Half Yearly' },
//     { value: 'na', label: 'NA' },
//     { value: 'one', label: 'One' },
//   ];

//   // Fetch reference data
//   useEffect(() => {
//     const fetchReferenceData = async () => {
//       try {
//         setLoading(true);
//         const [
//           functionsRes,
//           legislationRes,
//           categoriesRes,
//           penaltyTypesRes,
//           applicabilitiesRes,
//           typesRes,
//           statesRes
//         ] = await Promise.all([
//           httpClient.get(endpoints.compliances.functionList()),
//           httpClient.get(endpoints.compliances.legislationActsList()),
//           httpClient.get(endpoints.compliances.complianceCategorizationsList()),
//           httpClient.get(endpoints.compliances.penaltyTypesList()),
//           httpClient.get(endpoints.compliances.complianceApplicabilityList()),
//           httpClient.get(endpoints.compliances.complianceTypeList()),
//           httpClient.get(endpoints.common.getStatesAll())
//         ]);

//         setFunctions(functionsRes.data.data || []);
//         setLegislationActs(legislationRes.data.data || []);
//         setCategories(categoriesRes.data.data || []);
//         setPenaltyTypes(penaltyTypesRes.data.data || []);
//         setApplicabilities(applicabilitiesRes.data.data || []);
//         setComplianceTypes(typesRes.data.data || []);
//         setStates(statesRes.data || []);
//       } catch (error) {
//         console.error('Error fetching reference data:', error);
//         toast.push(
//           <Notification title="Error" type="error">
//             Failed to load reference data
//           </Notification>
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReferenceData();
//   }, []);

//   // Handle applicable change to show/hide state field
//   useEffect(() => {
//     setShowStateField(formData.applicable === 'state');
//     if (formData.applicable !== 'state') {
//       setFormData(prev => ({ ...prev, state_id: null }));
//     }
//   }, [formData.applicable]);

//   // Handle due date frequency change
//   useEffect(() => {
//     const frequency = formData.due_date_frequency.toLowerCase();
//     const shouldShowDates = !['na', 'one'].includes(frequency);
//     setShowDateFields(shouldShowDates);

//     if (shouldShowDates) {
//       switch (frequency) {
//         case 'monthly':
//         case 'yearly':
//           setDateFieldsState({
//             isSecondDateEnabled: false,
//             isThirdDateEnabled: false,
//             isLastDateEnabled: false
//           });
//           break;
//         case 'half_yearly':
//           setDateFieldsState({
//             isSecondDateEnabled: false,
//             isThirdDateEnabled: false,
//             isLastDateEnabled: true
//           });
//           break;
//         case 'quarterly':
//           setDateFieldsState({
//             isSecondDateEnabled: true,
//             isThirdDateEnabled: true,
//             isLastDateEnabled: true
//           });
//           break;
//         default:
//           setDateFieldsState({
//             isSecondDateEnabled: false,
//             isThirdDateEnabled: false,
//             isLastDateEnabled: false
//           });
//       }
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         due_dates: {}
//       }));
//     }
//   }, [formData.due_date_frequency]);

// const formatDisplayDate = (dateString: string | null): string => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   const day = date.getDate().toString().padStart(2, '0');
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// };

// const parseInputDate = (dateString: string): string => {
//   if (!dateString) return '';
//   const [day, month, year] = dateString.split('-').map(Number);
//   const date = new Date(year, month - 1, day);
//   return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format for API
// };


//   const handleInputChange = useCallback((field: string, value: any) => {
//     if (field.includes('_due_date')) {
//       const dateValue = value ? value.toISOString().split('T')[0] : '';
//       setFormData(prev => ({
//         ...prev,
//         due_dates: {
//           ...prev.due_dates,
//           [field]: dateValue
//         }
//       }));
//       return;
//     }

//     setFormData(prev => ({ ...prev, [field]: value }));
//   }, []);

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
      
//       const payload = {
//         ...formData,
//         state_id: formData.applicable === 'state' ? Number(formData.state_id) : null,
//         is_active: true
//       };

//       if (isEditMode && onSubmit) {
//         await onSubmit(payload);
//       } else {
//         await httpClient.post(
//           endpoints.compliances.createcompliance(),
//           payload
//         );
//         toast.push(
//           <Notification title="Success" type="success">
//             Compliance {isEditMode ? 'updated' : 'created'} successfully
//           </Notification>
//         );
//         navigate('/auditSetup');
//       }
//     } catch (error: any) {
//       console.error('Error:', error);
//       const errorMessage = error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} compliance`;
//       toast.push(
//         <Notification title="Error" type="error">
//           {errorMessage}
//         </Notification>
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const AutoSuggestField: React.FC<{
//     value: string;
//     options: ReferenceData[];
//     onChange: (value: string) => void;
//     onCreate?: (value: string) => Promise<void>;
//     label: string;
//     placeholder: string;
//     isLoading: boolean;
//   }> = ({
//     value,
//     options,
//     onChange,
//     onCreate,
//     label,
//     placeholder,
//     isLoading
//   }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [filteredOptions, setFilteredOptions] = useState<ReferenceData[]>(options);
//     const [isCreating, setIsCreating] = useState(false);
//     const [inputValue, setInputValue] = useState(value);
//     const wrapperRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//       setInputValue(value);
//     }, [value]);

//     useEffect(() => {
//       if (inputValue) {
//         const filtered = options.filter(option =>
//           option.name.toLowerCase().includes(inputValue.toLowerCase())
//         );
//         setFilteredOptions(filtered);
//       } else {
//         setFilteredOptions(options);
//       }
//     }, [inputValue, options]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const newValue = e.target.value;
//       setInputValue(newValue);
//       onChange(newValue);
//       setIsOpen(true);
//     };

//     const handleCreate = async (newValue: string) => {
//       if (!onCreate || isCreating) return;
      
//       setIsCreating(true);
//       try {
//         await onCreate(newValue);
//         setInputValue(newValue);
//         onChange(newValue);
//         setIsOpen(false);
//       } catch (error) {
//         console.error('Error creating:', error);
//       } finally {
//         setIsCreating(false);
//       }
//     };

//     const handleKeyDown = (e: React.KeyboardEvent) => {
//       if (e.key === 'Enter' && onCreate && inputValue) {
//         e.preventDefault();
//         handleCreate(inputValue);
//       }
//     };

//     return (
//       <div className="relative" ref={wrapperRef}>
//         <p className="mb-2">{label}</p>
//         <div className="relative">
//           <div className="relative">
//             <div className="absolute top-0 left-0 w-full h-full border rounded-md pointer-events-none border-gray-300">
//               <span
//                 className={`absolute px-1 transition-all duration-200 ${
//                   (isOpen || inputValue !== '')
//                     ? '-top-3 left-3 text-xs font-semibold bg-white text-indigo-600'
//                     : 'top-2 left-2 text-sm text-gray-500'
//                 }`}
//               >
//                 {placeholder}
//               </span>
//             </div>
//             <input
//               type="text"
//               value={inputValue}
//               onChange={handleInputChange}
//               onFocus={() => setIsOpen(true)}
//               onKeyDown={handleKeyDown}
//               className="w-full px-3 py-2 bg-transparent border-none focus:outline-none"
//               disabled={isLoading || isCreating}
//             />
//           </div>
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             type="button"
//             className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
//             disabled={isLoading || isCreating}
//           >
//             {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
//           </button>
//         </div>

//         {isOpen && (
//           <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
//             {isLoading ? (
//               <div className="p-2 text-gray-500 flex items-center justify-center">
//                 <AiOutlineLoading3Quarters className="animate-spin mr-2" />
//                 Loading...
//               </div>
//             ) : filteredOptions.length > 0 ? (
//               <ul className="max-h-60 overflow-auto">
//                 {filteredOptions.map((option) => (
//                   <li
//                     key={option.id}
//                     className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                     onClick={() => {
//                       onChange(option.name);
//                       setInputValue(option.name);
//                       setIsOpen(false);
//                     }}
//                   >
//                     {option.name}
//                   </li>
//                 ))}
//               </ul>
//             ) : inputValue && onCreate ? (
//               <div 
//                 className={`p-2 text-gray-600 ${
//                   isCreating 
//                     ? 'cursor-wait bg-gray-50' 
//                     : 'cursor-pointer hover:bg-gray-100'
//                 } flex items-center justify-center`}
//                 onClick={() => !isCreating && handleCreate(inputValue)}
//               >
//                 {isCreating ? (
//                   <>
//                     <AiOutlineLoading3Quarters className="animate-spin mr-2" />
//                     Creating "{inputValue}"...
//                   </>
//                 ) : (
//                   <>Press Enter to create "{inputValue}"</>
//                 )}
//               </div>
//             ) : (
//               <div className="p-2 text-gray-500">No options found</div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const createReferenceData = async (endpoint: string, name: string) => {
//     try {
//       const response = await httpClient.post(endpoint, { name });
//       return response.data;
//     } catch (error) {
//       console.error('Error creating reference data:', error);
//       throw error;
//     }
//   };

//   return (
//     <div className="p-2 bg-white rounded-lg">
//       <div className="flex gap-1 items-center mb-10">
//         <Button
//           size="sm"
//           variant="plain"
//           icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
//           onClick={() => navigate(-1)}
//         />
//         <h3 className="text-2xl font-semibold">
//           {isEditMode ? 'Edit' : 'Add'} Compliance Parameter
//         </h3>
//       </div>

//       <div className="space-y-6">
//         {/* 1st Row: Country and Function */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <p className="mb-2">Country</p>
//             <OutlinedSelect
//               label="Select Country"
//               options={countryOptions}
//               value={countryOptions.find(opt => opt.value === formData.country) || countryOptions[0]}
//               onChange={(option) => handleInputChange('country', option?.value || 'INDIA')}
//             />
//           </div>
//           <div>
//             <FunctionAutoSuggest
//               value={formData.function}
//               options={functions}
//               onChange={(val) => handleInputChange('function', val)}
//               onCreate={(val) => createReferenceData(
//                 endpoints.compliances.createfunctions(),
//                 val
//               )}
//               label="Function"
//               placeholder="Select Function"
//               isLoading={loading}
//             />
//           </div>
//         </div>

//         {/* 2nd Row: Applicable and Legislation */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <p className="mb-2">Central/State</p>
//             <OutlinedSelect
//               label="Select Applicable"
//               options={applicableOptions}
//               value={applicableOptions.find(opt => opt.value === formData.applicable) || applicableOptions[0]}
//               onChange={(option) => handleInputChange('applicable', option?.value || 'central')}
//             />
//           </div>
//           <div>
//             <AutoSuggestField
//               value={formData.legislation_act}
//               options={legislationActs}
//               onChange={(val) => handleInputChange('legislation_act', val)}
//               onCreate={(val) => createReferenceData(
//                 endpoints.compliances.createlegislationActs(),
//                 val
//               )}
//               label="Legislation Act"
//               placeholder="Select Legislation Act"
//               isLoading={loading}
//             />
//           </div>
//         </div>

//         {/* State field - conditionally shown */}
//         {showStateField && (
//           <div>
//             <p className="mb-2">State</p>
//             <OutlinedSelect
//               label="Select State"
//               options={states.map(state => ({
//                 value: String(state.id),
//                 label: state.name
//               }))}
//               value={states.find(state => String(state.id) === String(formData.state_id)) ? {
//                 value: String(formData.state_id),
//                 label: states.find(state => String(state.id) === String(formData.state_id))?.name || ''
//               } : null}
//               onChange={(option) => handleInputChange('state_id', option?.value || null)}
//             />
//           </div>
//         )}

//         {/* 3rd Row: Category and Penalty Type */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <AutoSuggestField
//               value={formData.compliance_categorization}
//               options={categories}
//               onChange={(val) => handleInputChange('compliance_categorization', val)}
//               onCreate={(val) => createReferenceData(
//                 endpoints.compliances.createcomplianceCategorizations(),
//                 val
//               )}
//               label="Compliance Categorization"
//               placeholder="Select Category"
//               isLoading={loading}
//             />
//           </div>
//           <div>
//             <AutoSuggestField
//               value={formData.penalty_type}
//               options={penaltyTypes}
//               onChange={(val) => handleInputChange('penalty_type', val)}
//               onCreate={(val) => createReferenceData(
//                 endpoints.compliances.createpenaltyTypes(),
//                 val
//               )}
//               label="Penalty Type"
//               placeholder="Select Penalty Type"
//               isLoading={loading}
//             />
//           </div>
//         </div>

//         {/* 4th Row: Compliance Header */}
//         <div>
//           <p className="mb-2">Compliance Header</p>
//           <OutlinedInput
//             label="Compliance Header"
//             value={formData.compliance_header}
//             onChange={(value) => handleInputChange('compliance_header', value)}
//           />
//         </div>

//         {/* 5th Row: Compliance Description */}
//         <div>
//           <p className="mb-2">Compliance Description</p>
//           <OutlinedInput
//             label="Compliance Description"
//             value={formData.compliance_description}
//             onChange={(value) => handleInputChange('compliance_description', value)}
//             textarea={true}
//           />
//         </div>

//         {/* 6th Row: Penalty Description */}
//         <div>
//           <p className="mb-2">Penalty Description</p>
//           <OutlinedInput
//             label="Penalty Description"
//             value={formData.penalty_description}
//             onChange={(value) => handleInputChange('penalty_description', value)}
//             textarea={true}
//           />
//         </div>

//         {/* 7th Row: Applicability and Reference */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <AutoSuggestField
//               value={formData.compliance_applicability}
//               options={applicabilities}
//               onChange={(val) => handleInputChange('compliance_applicability', val)}
//               onCreate={(val) => createReferenceData(
//                 endpoints.compliances.createcomplianceApplicability(),
//                 val
//               )}
//               label="Compliance Applicability"
//               placeholder="Select Applicability"
//               isLoading={loading}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Compliance Reference</p>
//             <OutlinedInput
//               label="Compliance Reference"
//               value={formData.compliance_reference}
//               onChange={(value) => handleInputChange('compliance_reference', value)}
//             />
//           </div>
//         </div>

//         {/* 8th Row: Type and Frequency */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <AutoSuggestField
//               value={formData.compliance_type}
//               options={complianceTypes}
//               onChange={(val) => handleInputChange('compliance_type', val)}
//               onCreate={(val) => createReferenceData(
//                 endpoints.compliances.createcomplianceType(),
//                 val
//               )}
//               label="Compliance Type"
//               placeholder="Select Type"
//               isLoading={loading}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Compliance Frequency</p>
//             <OutlinedSelect
//               label="Select Frequency"
//               options={frequencyOptions}
//               value={frequencyOptions.find(opt => opt.value === formData.compliance_frequency) || null}
//               onChange={(option) => handleInputChange('compliance_frequency', option?.value || '')}
//             />
//           </div>
//         </div>

//         {/* 9th Row: Criticality and Due Date Frequency */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <p className="mb-2">Criticality</p>
//             <OutlinedSelect
//               label="Select Criticality"
//               options={criticalityOptions}
//               value={criticalityOptions.find(opt => opt.value === formData.criticality) || null}
//               onChange={(option) => handleInputChange('criticality', option?.value || '')}
//             />
//           </div>
//           <div>
//             <p className="mb-2">Due Date Frequency</p>
//             <OutlinedSelect
//               label="Select Due Date Frequency"
//               options={dueDateFrequencyOptions}
//               value={dueDateFrequencyOptions.find(opt => opt.value === formData.due_date_frequency) || null}
//               onChange={(option) => handleInputChange('due_date_frequency', option?.value || '')}
//             />
//           </div>
//         </div>

//         {/* Date fields - conditionally shown */}
//         {showDateFields && (
//           <>
//             {/* First Due Date */}
//             <div>
//               <p className="mb-2">First Due Date</p>
//               <DatePicker
//                 placeholder="Select first due date"
//                 value={formData.due_dates.first_due_date ? new Date(formData.due_dates.first_due_date) : null}
//                 onChange={(date) => handleInputChange('first_due_date', date)}
//         inputFormat="DD-MM-YYYY"
//       />
//             </div>

//             {/* Second Due Date - conditionally shown */}
//             {dateFieldsState.isSecondDateEnabled && (
//               <div>
//                 <p className="mb-2">Second Due Date</p>
//                 <DatePicker
//                   placeholder="Select second due date"
//                   value={formData.due_dates.second_due_date ? new Date(formData.due_dates.second_due_date) : null}
//                   onChange={(date) => handleInputChange('second_due_date', date)}
//         inputFormat="DD-MM-YYYY"
//       />
//               </div>
//             )}

//             {/* Third Due Date - conditionally shown */}
//             {dateFieldsState.isThirdDateEnabled && (
//               <div>
//                 <p className="mb-2">Third Due Date</p>
//                 <DatePicker
//                   placeholder="Select third due date"
//                   value={formData.due_dates.third_due_date ? new Date(formData.due_dates.third_due_date) : null}
//                   onChange={(date) => handleInputChange('third_due_date', date)}
//         inputFormat="DD-MM-YYYY"
//       />
//               </div>
//             )}

//             {/* Last Due Date - conditionally shown */}
//             {dateFieldsState.isLastDateEnabled && (
//               <div>
//                 <p className="mb-2">Last Due Date</p>
//                 <DatePicker
//                   placeholder="Select last due date"
//                   value={formData.due_dates.last_due_date ? new Date(formData.due_dates.last_due_date) : null}
//                   onChange={(date) => handleInputChange('last_due_date', date)}
//         inputFormat="DD-MM-YYYY"
//       />
//               </div>
//             )}
//           </>
//         )}

//         {/* Submit and Cancel buttons */}
//         <div className="flex justify-end gap-2">
//           <Button
//             type="button"
//             variant="plain"
//             size="sm"
//             onClick={() => navigate(-1)}
//           >
//             Cancel
//           </Button>

//           <Button
//             type="button"
//             variant="solid"
//             size="sm"
//             onClick={handleSubmit}
//             loading={loading}
//             icon={loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : null}
//           >
//             Confirm
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ComplianceAddForm;





import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Button } from '@/components/ui';
import { IoArrowBack } from 'react-icons/io5';
import OutlinedSelect from '@/components/ui/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { DatePicker } from '@/components/ui/DatePicker';
import { useNavigate } from 'react-router-dom';
import { Notification, toast } from '@/components/ui';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import * as Yup from 'yup';

// Auto-suggest components
import FunctionAutoSuggest from './FunctionAutoSuggest';
import LegislationActAutoSuggest from './LegislationActAutoSuggest';
import ComplianceCategorizationAutoSuggest from './ComplianceCategorizationAutoSuggest';
import PenaltyTypeAutoSuggest from './PenaltyTypeAutoSuggest';
import ComplianceApplicabilityAutoSuggest from './ComplianceApplicabilityAutoSuggest';
import ComplianceTypeAutoSuggest from './ComplianceTypeAutoSuggest';

interface ComplianceFormData {
  country: string;
  function: string;
  applicable: string;
  state_id: number | null;
  legislation_act: string;
  compliance_categorization: string;
  penalty_type: string;
  compliance_header: string;
  compliance_description: string;
  penalty_description: string;
  compliance_applicability: string;
  compliance_reference: string;
  compliance_type: string;
  compliance_frequency: string;
  criticality: string;
  due_date_frequency: string;
  due_dates: {
    first_due_date?: string;
    second_due_date?: string;
    third_due_date?: string;
    last_due_date?: string;
  };
  is_active: boolean;
}

interface ReferenceData {
  id: number;
  name: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const ComplianceAddForm: React.FC = () => {
  const navigate = useNavigate();
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

  const applicableOptions: SelectOption[] = [
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

  // Validation schema
  const validationSchema = Yup.object().shape({
    country: Yup.string().required('Country is required'),
    function: Yup.string().required('Function is required'),
    applicable: Yup.string().required('Applicable is required'),
    state_id: Yup.number().when('applicable', {
      is: 'state',
      then: (schema) => schema.required('State is required'),
      otherwise: (schema) => schema.nullable()
    }),
    legislation_act: Yup.string().required('Legislation Act is required'),
    compliance_categorization: Yup.string().required('Compliance Categorization is required'),
    penalty_type: Yup.string().required('Penalty Type is required'),
    compliance_header: Yup.string().required('Compliance Header is required'),
    compliance_description: Yup.string().required('Compliance Description is required'),
    penalty_description: Yup.string().required('Penalty Description is required'),
    compliance_applicability: Yup.string().required('Compliance Applicability is required'),
    compliance_reference: Yup.string().required('Compliance Reference is required'),
    compliance_type: Yup.string().required('Compliance Type is required'),
    compliance_frequency: Yup.string().required('Compliance Frequency is required'),
    criticality: Yup.string().required('Criticality is required'),
    due_date_frequency: Yup.string().required('Due Date Frequency is required'),
    due_dates: Yup.object().when('due_date_frequency', {
      is: (val: string) => !['na', 'one'].includes(val?.toLowerCase()),
      then: (schema) => schema.shape({
        first_due_date: Yup.string().required('First due date is required'),
        second_due_date: Yup.string().when('$dateFieldsState.isSecondDateEnabled', {
          is: true,
          then: (schema) => schema.required('Second due date is required')
        }),
        third_due_date: Yup.string().when('$dateFieldsState.isThirdDateEnabled', {
          is: true,
          then: (schema) => schema.required('Third due date is required')
        }),
        last_due_date: Yup.string().when('$dateFieldsState.isLastDateEnabled', {
          is: true,
          then: (schema) => schema.required('Last due date is required')
        })
      })
    })
  });

  const initialValues: ComplianceFormData = {
    country: 'INDIA',
    function: '',
    applicable: 'central',
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
    due_dates: {},
    is_active: true
  };

  const handleSubmit = async (values: ComplianceFormData) => {
    try {
      setLoading(true);
      
      const payload = {
        ...values,
        state_id: values.applicable === 'state' ? Number(values.state_id) : null,
        is_active: true
      };

      await httpClient.post(
        endpoints.compliances.createcompliance(),
        payload
      );
      
      toast.push(
        <Notification title="Success" type="success">
          Compliance created successfully
        </Notification>
      );
      
      navigate('/auditSetup');
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create compliance';
      toast.push(
        <Notification title="Error" type="error">
          {errorMessage}
        </Notification>
      );
    } finally {
      setLoading(false);
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
        <h3 className="text-2xl font-semibold">Add Compliance Parameter</h3>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => {
          // Handle applicable change to show/hide state field
          useEffect(() => {
            setShowStateField(values.applicable === 'state');
            if (values.applicable !== 'state') {
              setFieldValue('state_id', null);
            }
          }, [values.applicable]);

          // Handle due date frequency change
          useEffect(() => {
            const frequency = values.due_date_frequency.toLowerCase();
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
              setFieldValue('due_dates', {});
            }
          }, [values.due_date_frequency]);

          return (
            <Form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* 1st Row: Country and Function */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2">Country</p>
                    <OutlinedSelect
                      label="Select Country"
                      options={countryOptions}
                      value={countryOptions.find(opt => opt.value === values.country) || countryOptions[0]}
                      onChange={(option) => setFieldValue('country', option?.value || 'INDIA')}
                    />
                    {touched.country && errors.country && (
                      <div className="text-red-500 text-sm">{errors.country}</div>
                    )}
                  </div>
                  <div>
                    <FunctionAutoSuggest
                      value={values.function}
                      onChange={(value) => setFieldValue('function', value)}
                      onFunctionSelect={(id) => {}}
                      disabled={loading}
                    />
                    {touched.function && errors.function && (
                      <div className="text-red-500 text-sm">{errors.function}</div>
                    )}
                  </div>
                </div>

                {/* 2nd Row: Applicable and Legislation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2">Central/State</p>
                    <OutlinedSelect
                      label="Select Applicable"
                      options={applicableOptions}
                      value={applicableOptions.find(opt => opt.value === values.applicable) || applicableOptions[0]}
                      onChange={(option) => setFieldValue('applicable', option?.value || 'central')}
                    />
                    {touched.applicable && errors.applicable && (
                      <div className="text-red-500 text-sm">{errors.applicable}</div>
                    )}
                  </div>
                  <div>
                    <LegislationActAutoSuggest
                      value={values.legislation_act}
                      onChange={(value) => setFieldValue('legislation_act', value)}
                      onActSelect={(id) => {}}
                      disabled={loading}
                    />
                    {touched.legislation_act && errors.legislation_act && (
                      <div className="text-red-500 text-sm">{errors.legislation_act}</div>
                    )}
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
                      value={states.find(state => String(state.id) === String(values.state_id)) ? {
                        value: String(values.state_id),
                        label: states.find(state => String(state.id) === String(values.state_id))?.name || ''
                      } : null}
                      onChange={(option) => setFieldValue('state_id', option?.value ? Number(option.value) : null)}
                    />
                    {touched.state_id && errors.state_id && (
                      <div className="text-red-500 text-sm">{errors.state_id}</div>
                    )}
                  </div>
                )}

                {/* 3rd Row: Category and Penalty Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ComplianceCategorizationAutoSuggest
                      value={values.compliance_categorization}
                      onChange={(value) => setFieldValue('compliance_categorization', value)}
                      onCategorizationSelect={(id) => {}}
                      disabled={loading}
                    />
                    {touched.compliance_categorization && errors.compliance_categorization && (
                      <div className="text-red-500 text-sm">{errors.compliance_categorization}</div>
                    )}
                  </div>
                  <div>
                    <PenaltyTypeAutoSuggest
                      value={values.penalty_type}
                      onChange={(value) => setFieldValue('penalty_type', value)}
                      onPenaltySelect={(id) => {}}
                      disabled={loading}
                    />
                    {touched.penalty_type && errors.penalty_type && (
                      <div className="text-red-500 text-sm">{errors.penalty_type}</div>
                    )}
                  </div>
                </div>

                {/* 4th Row: Compliance Header */}
                <div>
                  <p className="mb-2">Compliance Header</p>
                  <OutlinedInput
                    label="Compliance Header"
                    value={values.compliance_header}
                    onChange={(value) => setFieldValue('compliance_header', value)}
                  />
                  {touched.compliance_header && errors.compliance_header && (
                    <div className="text-red-500 text-sm">{errors.compliance_header}</div>
                  )}
                </div>

                {/* 5th Row: Compliance Description */}
                <div>
                  <p className="mb-2">Compliance Description</p>
                  <OutlinedInput
                    label="Compliance Description"
                    value={values.compliance_description}
                    onChange={(value) => setFieldValue('compliance_description', value)}
                    textarea={true}
                  />
                  {touched.compliance_description && errors.compliance_description && (
                    <div className="text-red-500 text-sm">{errors.compliance_description}</div>
                  )}
                </div>

                {/* 6th Row: Penalty Description */}
                <div>
                  <p className="mb-2">Penalty Description</p>
                  <OutlinedInput
                    label="Penalty Description"
                    value={values.penalty_description}
                    onChange={(value) => setFieldValue('penalty_description', value)}
                    textarea={true}
                  />
                  {touched.penalty_description && errors.penalty_description && (
                    <div className="text-red-500 text-sm">{errors.penalty_description}</div>
                  )}
                </div>

                {/* 7th Row: Applicability and Reference */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ComplianceApplicabilityAutoSuggest
                      value={values.compliance_applicability}
                      onChange={(value) => setFieldValue('compliance_applicability', value)}
                      onApplicabilitySelect={(id) => {}}
                      disabled={loading}
                    />
                    {touched.compliance_applicability && errors.compliance_applicability && (
                      <div className="text-red-500 text-sm">{errors.compliance_applicability}</div>
                    )}
                  </div>
                  <div>
                    <p className="mb-2">Compliance Reference</p>
                    <OutlinedInput
                      label="Compliance Reference"
                      value={values.compliance_reference}
                      onChange={(value) => setFieldValue('compliance_reference', value)}
                    />
                    {touched.compliance_reference && errors.compliance_reference && (
                      <div className="text-red-500 text-sm">{errors.compliance_reference}</div>
                    )}
                  </div>
                </div>

                {/* 8th Row: Type and Frequency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ComplianceTypeAutoSuggest
                      value={values.compliance_type}
                      onChange={(value) => setFieldValue('compliance_type', value)}
                      onTypeSelect={(id) => {}}
                      disabled={loading}
                    />
                    {touched.compliance_type && errors.compliance_type && (
                      <div className="text-red-500 text-sm">{errors.compliance_type}</div>
                    )}
                  </div>
                  <div>
                    <p className="mb-2">Compliance Frequency</p>
                    <OutlinedSelect
                      label="Select Frequency"
                      options={frequencyOptions}
                      value={frequencyOptions.find(opt => opt.value === values.compliance_frequency) || null}
                      onChange={(option) => setFieldValue('compliance_frequency', option?.value || '')}
                    />
                    {touched.compliance_frequency && errors.compliance_frequency && (
                      <div className="text-red-500 text-sm">{errors.compliance_frequency}</div>
                    )}
                  </div>
                </div>

                {/* 9th Row: Criticality and Due Date Frequency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2">Criticality</p>
                    <OutlinedSelect
                      label="Select Criticality"
                      options={criticalityOptions}
                      value={criticalityOptions.find(opt => opt.value === values.criticality) || null}
                      onChange={(option) => setFieldValue('criticality', option?.value || '')}
                    />
                    {touched.criticality && errors.criticality && (
                      <div className="text-red-500 text-sm">{errors.criticality}</div>
                    )}
                  </div>
                  <div>
                    <p className="mb-2">Due Date Frequency</p>
                    <OutlinedSelect
                      label="Select Due Date Frequency"
                      options={dueDateFrequencyOptions}
                      value={dueDateFrequencyOptions.find(opt => opt.value === values.due_date_frequency) || null}
                      onChange={(option) => setFieldValue('due_date_frequency', option?.value || '')}
                    />
                    {touched.due_date_frequency && errors.due_date_frequency && (
                      <div className="text-red-500 text-sm">{errors.due_date_frequency}</div>
                    )}
                  </div>
                </div>

                {/* Date fields - conditionally shown */}
                {showDateFields && (
                  <div className='grid grid-cols-2 gap-4'>
                    {/* First Due Date */}
                    <div>
                      <p className="mb-2">First Due Date</p>
                      <DatePicker
                        placeholder="Select first due date"
                        value={values.due_dates.first_due_date ? new Date(values.due_dates.first_due_date) : null}
                        onChange={(date) => setFieldValue('due_dates.first_due_date', date?.toISOString().split('T')[0] || '')}
                        inputFormat="DD-MM-YYYY"
                      />
                      {touched.due_dates?.first_due_date && errors.due_dates?.first_due_date && (
                        <div className="text-red-500 text-sm">{errors.due_dates.first_due_date}</div>
                      )}
                    </div>

                    {/* Second Due Date - conditionally shown */}
                    {dateFieldsState.isSecondDateEnabled && (
                      <div>
                        <p className="mb-2">Second Due Date</p>
                        <DatePicker
                          placeholder="Select second due date"
                          value={values.due_dates.second_due_date ? new Date(values.due_dates.second_due_date) : null}
                          onChange={(date) => setFieldValue('due_dates.second_due_date', date?.toISOString().split('T')[0] || '')}
                          inputFormat="DD-MM-YYYY"
                        />
                        {touched.due_dates?.second_due_date && errors.due_dates?.second_due_date && (
                          <div className="text-red-500 text-sm">{errors.due_dates.second_due_date}</div>
                        )}
                      </div>
                    )}

                    {/* Third Due Date - conditionally shown */}
                    {dateFieldsState.isThirdDateEnabled && (
                      <div>
                        <p className="mb-2">Third Due Date</p>
                        <DatePicker
                          placeholder="Select third due date"
                          value={values.due_dates.third_due_date ? new Date(values.due_dates.third_due_date) : null}
                          onChange={(date) => setFieldValue('due_dates.third_due_date', date?.toISOString().split('T')[0] || '')}
                          inputFormat="DD-MM-YYYY"
                        />
                        {touched.due_dates?.third_due_date && errors.due_dates?.third_due_date && (
                          <div className="text-red-500 text-sm">{errors.due_dates.third_due_date}</div>
                        )}
                      </div>
                    )}

                    {/* Last Due Date - conditionally shown */}
                    {dateFieldsState.isLastDateEnabled && (
                      <div>
                        <p className="mb-2">Last Due Date</p>
                        <DatePicker
                          placeholder="Select last due date"
                          value={values.due_dates.last_due_date ? new Date(values.due_dates.last_due_date) : null}
                          onChange={(date) => setFieldValue('due_dates.last_due_date', date?.toISOString().split('T')[0] || '')}
                          inputFormat="DD-MM-YYYY"
                        />
                        {touched.due_dates?.last_due_date && errors.due_dates?.last_due_date && (
                          <div className="text-red-500 text-sm">{errors.due_dates.last_due_date}</div>
                        )}
                      </div>
                    )}
                  </div>
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
                    type="submit"
                    variant="solid"
                    size="sm"
                    loading={loading}
                    icon={loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : null}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ComplianceAddForm;