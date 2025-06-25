// import { Formik, Form } from 'formik';
// import React, { useState, useEffect } from 'react';
// import { IoArrowBack } from 'react-icons/io5';
// import { useNavigate } from 'react-router-dom';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// import DatePicker from '@/components/ui/DatePicker/DatePicker';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import * as Yup from 'yup';
// import { Button, toast, Notification } from '@/components/ui';
// import ActNameAutoSuggest from './ActNameAutoSuggest';

// interface Act {
//   id: number;
//   act_name: string;
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
// }

// interface ActOption {
//   value: string;  // act_name
//   label: string;  // act_name
//   originalId: number; // id
// }

// interface DueDates {
//   first_due_date: Date | null;
//   second_due_date: Date | null;
//   third_due_date: Date | null;
//   last_due_date: Date | null;
//   bi_annual_due_date: Date | null;
// }

// interface FormValues {
//   act_name: string;
//   return_name: string;
//   state_id: string;
//   return_applicability: string;
//   return_applicable_at: string;
//   frequency: string;
//   applicable: string;
//   due_dates: DueDates;
// }



// const ReturnSetupAddForm = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [stateOptions, setStateOptions] = useState([
//     { value: "central", label: "Central" }
//   ]);
//   const [stateLoading, setStateLoading] = useState(true);
//   const [actOptions, setActOptions] = useState<ActOption[]>([]);
//   const [enabledDateFields, setEnabledDateFields] = useState({
//     first_due_date: false,
//     second_due_date: false,
//     third_due_date: false,
//     last_due_date: false,
//     bi_annual_due_date: false
//   });


//   const applicableOptions = [
//   { value: "CENTRAL", label: "Central" },
//   { value: "ALL_STATES", label: "All States" },
//   { value: "STATE", label: "State" },
// ];

//   // Data for dropdowns
//   const frequencyOptions = [
//     { value: "monthly", label: "Monthly" },
//     { value: "quarterly", label: "Quarterly" },
//     { value: "half_yearly", label: "Half Yearly" },
//     { value: "yearly", label: "Yearly" },
//     { value: "bi_annual", label: "Biennial" },
//   ];

//   const applicabilityOptions = [
//     { value: "yes", label: "Yes" },
//     { value: "no", label: "No" },
//   ];

//   const applicableAtOptions = [
//     { value: "branch", label: "Branch" },
//     { value: "state", label: "State" },
//     { value: "central", label: "Central" },
//   ];

//   const handleFrequencyChange = (frequency: string) => {
//     const newEnabledFields = {
//       first_due_date: false,
//       second_due_date: false,
//       third_due_date: false,
//       last_due_date: false,
//       bi_annual_due_date: false
//     };

//     switch (frequency) {
//       case 'monthly':
//       case 'yearly':
//         newEnabledFields.first_due_date = true;
//         break;
//       case 'half_yearly':
//         newEnabledFields.first_due_date = true;
//         newEnabledFields.last_due_date = true;
//         break;
//       case 'quarterly':
//         newEnabledFields.first_due_date = true;
//         newEnabledFields.second_due_date = true;
//         newEnabledFields.third_due_date = true;
//         newEnabledFields.last_due_date = true;
//         break;
//       case 'bi_annual':
//         newEnabledFields.bi_annual_due_date = true;
//         break;
//       default:
//         newEnabledFields.first_due_date = true;
//     }

//     setEnabledDateFields(newEnabledFields);
//   };

//   // Fetch states and act names from API
//   useEffect(() => {
//     const fetchData = async () => {
//       setStateLoading(true);
//       try {
//         // Fetch states
//         const statesResponse = await httpClient.get(endpoints.common.getStatesAll());
//         if (statesResponse.data && Array.isArray(statesResponse.data)) {
//           const stateData = statesResponse.data.map(state => ({
//             value: state.id.toString(),
//             label: state.name
//           }));
//           stateData.sort((a, b) => a.label.localeCompare(b.label));
//           setStateOptions([
//             { value: "central", label: "Central" },
//             ...stateData
//           ]);
//         }

//         // Fetch act names
//         const actsResponse = await httpClient.get<{ data: Act[] }>(endpoints.return.returnList());
//         if (actsResponse.data?.data) {
//           setActOptions(actsResponse.data.data.map(act => ({
//             value: act.act_name,
//             label: act.act_name,
//             originalId: act.id
//           })));
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setStateOptions([{ value: "central", label: "Central" }]);
//       } finally {
//         setStateLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   const formatDueDates = (frequency: string, dueDates: DueDates) => {
//     const formatDate = (date: Date | null) => date ? new Date(date).toISOString().split('T')[0] : null;
    
//     const formattedDates: Record<string, string | null> = {};
    
//     if (frequency === 'monthly' || frequency === 'yearly') {
//       formattedDates.first_due_date = formatDate(dueDates.first_due_date);
//     } else if (frequency === 'half_yearly') {
//       formattedDates.first_due_date = formatDate(dueDates.first_due_date);
//       formattedDates.last_due_date = formatDate(dueDates.last_due_date);
//     } else if (frequency === 'quarterly') {
//       formattedDates.first_due_date = formatDate(dueDates.first_due_date);
//       formattedDates.second_due_date = formatDate(dueDates.second_due_date);
//       formattedDates.third_due_date = formatDate(dueDates.third_due_date);
//       formattedDates.last_due_date = formatDate(dueDates.last_due_date);
//     } else if (frequency === 'bi_annual') {
//       formattedDates.bi_annual_due_date = formatDate(dueDates.bi_annual_due_date);
//     }
    
//     return formattedDates;
//   };

//   const validationSchema = Yup.object().shape({
//     act_name: Yup.string().required('Act Name is required'),
//     return_name: Yup.string().required('Return Name is required'),
//     state_id: Yup.string().when('applicable', {
//     is: 'STATE',
//     then: (schema) => schema.required('State is required'),
//     otherwise: (schema) => schema.notRequired()
//   }),
//     return_applicability: Yup.string().required('Return Applicability is required'),
//     applicable: Yup.string().required('Applicable is required'),
//     return_applicable_at: Yup.string().required('Return Applicable At is required'),
//     frequency: Yup.string().required('Frequency is required'),
//     due_dates: Yup.object().shape({
//       first_due_date: Yup.date()
//         .nullable()
//         .when('$enabledDateFields.first_due_date', {
//           is: true,
//           then: (schema) => schema.required('First due date is required')
//         }),
//       second_due_date: Yup.date()
//         .nullable()
//         .when('$enabledDateFields.second_due_date', {
//           is: true,
//           then: (schema) => schema.required('Second due date is required')
//         }),
//       third_due_date: Yup.date()
//         .nullable()
//         .when('$enabledDateFields.third_due_date', {
//           is: true,
//           then: (schema) => schema.required('Third due date is required')
//         }),
//       last_due_date: Yup.date()
//         .nullable()
//         .when('$enabledDateFields.last_due_date', {
//           is: true,
//           then: (schema) => schema.required('Last due date is required')
//         }),
//       bi_annual_due_date: Yup.date()
//         .nullable()
//         .when('$enabledDateFields.bi_annual_due_date', {
//           is: true,
//           then: (schema) => schema.required('Bi-annual due date is required')
//         })
//     })
//   });

//  const initialValues: FormValues = {
//   act_name: '',
//   return_name: '',
//   state_id: '',
//   return_applicability: 'yes',
//   return_applicable_at: '',
//   frequency: '',
//   applicable: '', // Default to central
//   due_dates: {
//     first_due_date: null,
//     second_due_date: null,
//     third_due_date: null,
//     last_due_date: null,
//     bi_annual_due_date: null
//   }
// };

//   const handleSubmit = async (values: FormValues, { resetForm }: { resetForm: () => void }) => {
//     setLoading(true);

//     try {
//       const payload = {
//         act_name: values.act_name,
//       return_name: values.return_name,
//       state_id: values.applicable === 'state' ? Number(values.state_id) : null,
//       applicable: values.applicable,
//       return_applicable: values.return_applicability === "yes",
//       return_applicable_at: values.return_applicable_at,
//       frequency: values.frequency,
//       due_dates: formatDueDates(values.frequency, values.due_dates)
//       };

//       const response = await httpClient.post(endpoints.return.create(), payload);
      
//       if (response.data) {
//         toast.push(
//           <Notification title="Success" type="success">
//             Return setup created successfully!
//           </Notification>
//         );
//         resetForm();
//         setTimeout(() => navigate('/return-setup'));
//       }
//     } catch (error) {
//       console.error('Error creating return setup:', error);
//       let errorMessage = 'Failed to create return setup. Please try again.';
      
//       if (error instanceof Error && error.message) {
//         errorMessage = error.message;
//       }
      
//       toast.push(
//         <Notification title="Error" type="error">
//           {errorMessage}
//         </Notification>
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

// return (
//   <div className='bg-white p-2 rounded-lg'>
//     <div className="flex gap-2 items-center mb-6">
//       <Button
//         size="sm"
//         variant="plain"
//         icon={<IoArrowBack className="text-gray-500 hover:text-gray-700" />}
//         onClick={() => navigate(-1)}
//       />
//       <h3 className="text-2xl font-semibold">Add Return Setup</h3>
//     </div>

//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={handleSubmit}
//       validateOnChange={true}
//       validateOnBlur={true}
//       validateOnMount={false}
//     >
//       {({ values, errors, touched, setFieldValue }) => (
//         <Form>
//           <div className="space-y-6">
//             {/* First row - Act Name and Applicable */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="space-y-2">
//   <ActNameAutoSuggest
//     value={values.act_name}
//     onChange={(value) => setFieldValue('act_name', value)}
//     onActSelect={(id) => {
//       // You can store the act ID if needed
//       // setFieldValue('act_id', id);
//     }}
//     isDisabled={loading}
//   />
//   {touched.act_name && errors.act_name && (
//     <div className="text-red-500 text-sm">{errors.act_name}</div>
//   )}
// </div>
              
//               <div className="space-y-2">
//                 <label htmlFor="applicable">Applicable<span className="text-red-500">*</span></label>
//                 <OutlinedSelect 
//                   label="Select Applicable"
//                   options={applicableOptions}
//                   value={applicableOptions.find(opt => opt.value === values.applicable) || null}
//                   onChange={(selected) => {
//                     const value = selected?.value || '';
//                     setFieldValue('applicable', value);
//                     if (value !== 'STATE') {
//                       setFieldValue('state_id', '');
//                     }
//                   }}
//                   error={touched.applicable && !!errors.applicable}
//                 />
//                 {touched.applicable && errors.applicable && (
//                   <div className="text-red-500 text-sm">{errors.applicable}</div>
//                 )}
//               </div>
//             </div>

//             {/* Second row - Return Name and (State if applicable) */}
// {/* Second row - Return Name and Return Applicability */}
// <div className="grid grid-cols-2 gap-6">
//   <div className="space-y-2">
//     <label htmlFor="return_name">Return Name <span className="text-red-500">*</span></label>
//     <OutlinedInput
//       label="Enter Return Name"
//       value={values.return_name}
//       onChange={(value) => setFieldValue('return_name', value)}
//       error={touched.return_name && !!errors.return_name}
//     />
//     {touched.return_name && errors.return_name && (
//       <div className="text-red-500 text-sm">{errors.return_name}</div>
//     )}
//   </div>

//   <div className="space-y-2">
//     <label htmlFor="return_applicability">Return Applicability<span className="text-red-500">*</span></label>
//     <OutlinedSelect 
//       label="Select Return Applicability"
//       options={applicabilityOptions}
//       value={applicabilityOptions.find(opt => opt.value === values.return_applicability) || null}
//       onChange={(selected) => setFieldValue('return_applicability', selected?.value || '')}
//       error={touched.return_applicability && !!errors.return_applicability}
//     />
//     {touched.return_applicability && errors.return_applicability && (
//       <div className="text-red-500 text-sm">{errors.return_applicability}</div>
//     )}
//   </div>
// </div>

// {/* Third row - State (if applicable) and Return Applicable At */}
// <div className="grid grid-cols-2 gap-6">
//   {values.applicable === 'STATE' ? (
//     <div className="space-y-2">
//       <label htmlFor="state_id">State <span className="text-red-500">*</span></label>
//       <OutlinedSelect 
//         label="Select State"
//         options={stateOptions}
//         value={stateOptions.find(opt => opt.value === values.state_id) || null}
//         onChange={(selected) => setFieldValue('state_id', selected?.value || '')}
//         error={touched.state_id && !!errors.state_id}
//         loading={stateLoading}
//       />
//       {touched.state_id && errors.state_id && (
//         <div className="text-red-500 text-sm">{errors.state_id}</div>
//       )}
//     </div>
//   ) : (
//     <></>
//   )}

//   <div className="space-y-2">
//     <label htmlFor="return_applicable_at">Return Applicability level<span className="text-red-500">*</span></label>
//     <OutlinedSelect 
//       label="Select Return Applicability level"
//       options={applicableAtOptions}
//       value={applicableAtOptions.find(opt => opt.value === values.return_applicable_at) || null}
//       onChange={(selected) => setFieldValue('return_applicable_at', selected?.value || '')}
//       error={touched.return_applicable_at && !!errors.return_applicable_at}
//     />
//     {touched.return_applicable_at && errors.return_applicable_at && (
//       <div className="text-red-500 text-sm">{errors.return_applicable_at}</div>
//     )}
//   </div>
// </div>

//             <div className="space-y-2">
//               <label htmlFor="frequency">Frequency<span className="text-red-500">*</span></label>
//               <OutlinedSelect 
//                 label="Select Frequency"
//                 options={frequencyOptions}
//                 value={frequencyOptions.find(opt => opt.value === values.frequency) || null}
//                 onChange={(selected) => {
//                   const value = selected?.value || '';
//                   setFieldValue('frequency', value);
//                   handleFrequencyChange(value);
//                   setFieldValue('due_dates', {
//                     first_due_date: null,
//                     second_due_date: null,
//                     third_due_date: null,
//                     last_due_date: null,
//                     bi_annual_due_date: null
//                   });
//                 }}
//                 error={touched.frequency && !!errors.frequency}
//               />
//               {touched.frequency && errors.frequency && (
//                 <div className="text-red-500 text-sm">{errors.frequency}</div>
//               )}
//             </div>

//             {/* Date Fields Section */}
//             <div className="grid grid-cols-2 gap-6">
//               {/* First Due Date */}
//               <div className="space-y-2">
//                 <label>First Due Date {enabledDateFields.first_due_date && <span className="text-red-500">*</span>}</label>
//                 <DatePicker 
//                   placeholder="Select First Due Date"
//                   value={values.due_dates.first_due_date}
//                   onChange={(date) => setFieldValue('due_dates.first_due_date', date)}
//                   disabled={!enabledDateFields.first_due_date}
//                   inputFormat="DD-MM-YYYY" 
//                 />
//                 {enabledDateFields.first_due_date && touched.due_dates?.first_due_date && errors.due_dates?.first_due_date && (
//                   <div className="text-red-500 text-sm">{errors.due_dates.first_due_date}</div>
//                 )}
//               </div>

//               {/* Second Due Date */}
//               <div className="space-y-2">
//                 <label>Second Due Date {enabledDateFields.second_due_date && <span className="text-red-500">*</span>}</label>
//                 <DatePicker 
//                   placeholder="Select Second Due Date"
//                   value={values.due_dates.second_due_date}
//                   onChange={(date) => setFieldValue('due_dates.second_due_date', date)}
//                   disabled={!enabledDateFields.second_due_date}
//                   inputFormat="DD-MM-YYYY"
//                 />
//                 {enabledDateFields.second_due_date && touched.due_dates?.second_due_date && errors.due_dates?.second_due_date && (
//                   <div className="text-red-500 text-sm">{errors.due_dates.second_due_date}</div>
//                 )}
//               </div>

//               {/* Third Due Date */}
//               <div className="space-y-2">
//                 <label>Third Due Date {enabledDateFields.third_due_date && <span className="text-red-500">*</span>}</label>
//                 <DatePicker 
//                   placeholder="Select Third Due Date"
//                   value={values.due_dates.third_due_date}
//                   onChange={(date) => setFieldValue('due_dates.third_due_date', date)}
//                   disabled={!enabledDateFields.third_due_date}
//                   inputFormat="DD-MM-YYYY"
//                 />
//                 {enabledDateFields.third_due_date && touched.due_dates?.third_due_date && errors.due_dates?.third_due_date && (
//                   <div className="text-red-500 text-sm">{errors.due_dates.third_due_date}</div>
//                 )}
//               </div>

//               {/* Last Due Date */}
//               <div className="space-y-2">
//                 <label>Last Due Date {enabledDateFields.last_due_date && <span className="text-red-500">*</span>}</label>
//                 <DatePicker 
//                   placeholder="Select Last Due Date"
//                   value={values.due_dates.last_due_date}
//                   onChange={(date) => setFieldValue('due_dates.last_due_date', date)}
//                   disabled={!enabledDateFields.last_due_date}
//                   inputFormat="DD-MM-YYYY"
//                 />
//                 {enabledDateFields.last_due_date && touched.due_dates?.last_due_date && errors.due_dates?.last_due_date && (
//                   <div className="text-red-500 text-sm">{errors.due_dates.last_due_date}</div>
//                 )}
//               </div>

//               {/* Bi Annual Due Date */}
//               <div className="space-y-2">
//                 <label>Bi Annual Due Date {enabledDateFields.bi_annual_due_date && <span className="text-red-500">*</span>}</label>
//                 <DatePicker 
//                   placeholder="Select Bi Annual Due Date"
//                   value={values.due_dates.bi_annual_due_date}
//                   onChange={(date) => setFieldValue('due_dates.bi_annual_due_date', date)}
//                   disabled={!enabledDateFields.bi_annual_due_date}
//                   inputFormat="DD-MM-YYYY"
//                 />
//                 {enabledDateFields.bi_annual_due_date && touched.due_dates?.bi_annual_due_date && errors.due_dates?.bi_annual_due_date && (
//                   <div className="text-red-500 text-sm">{errors.due_dates.bi_annual_due_date}</div>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 pt-8">
//               <Button
//                 type="button"
//                 variant="plain"
//                 onClick={() => navigate(-1)}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 type="submit" 
//                 variant='solid'
//                 loading={loading}
//               >
//                 Confirm
//               </Button>
//             </div>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   </div>
// );
// };

// export default ReturnSetupAddForm;











import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import DatePicker from '@/components/ui/DatePicker/DatePicker';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import * as Yup from 'yup';
import { Button, toast, Notification } from '@/components/ui';
import ActNameAutoSuggest from './ActNameAutoSuggest';

interface Act {
  id: number;
  act_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ActOption {
  value: string;
  label: string;
  originalId: number;
}

interface DueDates {
  first_due_date: Date | null;
  second_due_date: Date | null;
  third_due_date: Date | null;
  last_due_date: Date | null;
  bi_annual_due_date: Date | null;
}

interface FormValues {
  act_name: string;
  return_name: string;
  state_id: string;
  return_applicability: string;
  return_applicable_at: string;
  frequency: string;
  applicable: string;
  due_dates: DueDates;
}

const ReturnSetupAddForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stateOptions, setStateOptions] = useState([
    { value: "central", label: "Central" }
  ]);
  const [stateLoading, setStateLoading] = useState(true);
  const [actOptions, setActOptions] = useState<ActOption[]>([]);
  const [enabledDateFields, setEnabledDateFields] = useState({
    first_due_date: false,
    second_due_date: false,
    third_due_date: false,
    last_due_date: false,
    bi_annual_due_date: false
  });

  const applicableOptions = [
    { value: "CENTRAL", label: "Central" },
    { value: "ALL_STATES", label: "All States" },
    { value: "STATE", label: "State" },
  ];

  const frequencyOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "half_yearly", label: "Half Yearly" },
    { value: "yearly", label: "Yearly" },
    { value: "bi_annual", label: "Biennial" },
  ];

  const applicabilityOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const applicableAtOptions = [
    { value: "branch", label: "Branch" },
    { value: "state", label: "State" },
    { value: "central", label: "Central" },
  ];

  const handleFrequencyChange = (frequency: string) => {
    const newEnabledFields = {
      first_due_date: false,
      second_due_date: false,
      third_due_date: false,
      last_due_date: false,
      bi_annual_due_date: false
    };

    switch (frequency) {
      case 'monthly':
      case 'yearly':
        newEnabledFields.first_due_date = true;
        break;
      case 'half_yearly':
        newEnabledFields.first_due_date = true;
        newEnabledFields.last_due_date = true;
        break;
      case 'quarterly':
        newEnabledFields.first_due_date = true;
        newEnabledFields.second_due_date = true;
        newEnabledFields.third_due_date = true;
        newEnabledFields.last_due_date = true;
        break;
      case 'bi_annual':
        newEnabledFields.bi_annual_due_date = true;
        break;
      default:
        newEnabledFields.first_due_date = true;
    }

    setEnabledDateFields(newEnabledFields);
  };

  useEffect(() => {
    const fetchData = async () => {
      setStateLoading(true);
      try {
        const statesResponse = await httpClient.get(endpoints.common.getStatesAll());
        if (statesResponse.data && Array.isArray(statesResponse.data)) {
          const stateData = statesResponse.data.map(state => ({
            value: state.id.toString(),
            label: state.name
          }));
          stateData.sort((a, b) => a.label.localeCompare(b.label));
          setStateOptions([
            { value: "central", label: "Central" },
            ...stateData
          ]);
        }

        const actsResponse = await httpClient.get<{ data: Act[] }>(endpoints.return.returnList());
        if (actsResponse.data?.data) {
          setActOptions(actsResponse.data.data.map(act => ({
            value: act.act_name,
            label: act.act_name,
            originalId: act.id
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.push(
          <Notification title="Error" type="error">
            Failed to load initial data
          </Notification>
        );
        setStateOptions([{ value: "central", label: "Central" }]);
      } finally {
        setStateLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatDueDates = (frequency: string, dueDates: DueDates) => {
    const formatDate = (date: Date | null) => date ? new Date(date).toISOString().split('T')[0] : null;
    
    const formattedDates: Record<string, string | null> = {};
    
    if (frequency === 'monthly' || frequency === 'yearly') {
      formattedDates.first_due_date = formatDate(dueDates.first_due_date);
    } else if (frequency === 'half_yearly') {
      formattedDates.first_due_date = formatDate(dueDates.first_due_date);
      formattedDates.last_due_date = formatDate(dueDates.last_due_date);
    } else if (frequency === 'quarterly') {
      formattedDates.first_due_date = formatDate(dueDates.first_due_date);
      formattedDates.second_due_date = formatDate(dueDates.second_due_date);
      formattedDates.third_due_date = formatDate(dueDates.third_due_date);
      formattedDates.last_due_date = formatDate(dueDates.last_due_date);
    } else if (frequency === 'bi_annual') {
      formattedDates.bi_annual_due_date = formatDate(dueDates.bi_annual_due_date);
    }
    
    return formattedDates;
  };

  const validationSchema = Yup.object().shape({
    act_name: Yup.string().required('Act Name is required'),
    return_name: Yup.string().required('Return Name is required'),
    state_id: Yup.string().when('applicable', {
      is: 'STATE',
      then: (schema) => schema.required('State is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    return_applicability: Yup.string()
      .required('Return Applicability is required')
      .oneOf(['yes', 'no'], 'Invalid selection'),
    applicable: Yup.string()
      .required('Applicable is required')
      .oneOf(['CENTRAL', 'ALL_STATES', 'STATE'], 'Invalid selection'),
    return_applicable_at: Yup.string().when('return_applicability', {
      is: 'yes',
      then: (schema) => schema
        .required('Return Applicable At is required')
        .oneOf(['branch', 'state', 'central'], 'Invalid selection'),
      otherwise: (schema) => schema.notRequired()
    }),
    frequency: Yup.string().when('return_applicability', {
      is: 'yes',
      then: (schema) => schema
        .required('Frequency is required')
        .oneOf(['monthly', 'quarterly', 'half_yearly', 'yearly', 'bi_annual'], 'Invalid selection'),
      otherwise: (schema) => schema.notRequired()
    }),
    due_dates: Yup.object().when('return_applicability', {
      is: 'yes',
      then: (schema) => schema.shape({
        first_due_date: Yup.date()
          .nullable()
          .when('$enabledDateFields.first_due_date', {
            is: true,
            then: (schema) => schema.required('First due date is required')
          }),
        second_due_date: Yup.date()
          .nullable()
          .when('$enabledDateFields.second_due_date', {
            is: true,
            then: (schema) => schema.required('Second due date is required')
          }),
        third_due_date: Yup.date()
          .nullable()
          .when('$enabledDateFields.third_due_date', {
            is: true,
            then: (schema) => schema.required('Third due date is required')
          }),
        last_due_date: Yup.date()
          .nullable()
          .when('$enabledDateFields.last_due_date', {
            is: true,
            then: (schema) => schema.required('Last due date is required')
          }),
        bi_annual_due_date: Yup.date()
          .nullable()
          .when('$enabledDateFields.bi_annual_due_date', {
            is: true,
            then: (schema) => schema.required('Bi-annual due date is required')
          })
      }),
      otherwise: (schema) => schema.notRequired()
    })
  });

  // Fixed initial values - removed default values that were showing up on form load
  const initialValues: FormValues = {
    act_name: '',
    return_name: '',
    state_id: '',
    return_applicability: '', // Changed from 'yes' to empty
    return_applicable_at: '', // Changed from 'state' to empty
    frequency: '', // Changed from 'monthly' to empty
    applicable: '', // Changed from 'STATE' to empty
    due_dates: {
      first_due_date: null,
      second_due_date: null,
      third_due_date: null,
      last_due_date: null,
      bi_annual_due_date: null
    }
  };

  const handleSubmit = async (values: FormValues, { resetForm }: { resetForm: () => void }) => {
    setLoading(true);
    
    try {
      const payload = {
        act_name: values.act_name,
        return_name: values.return_name,
      state_id: values.applicable === 'STATE' ? parseInt(values.state_id) : null,
        applicable: values.applicable,
        return_applicable: values.return_applicability === "yes",
        return_applicable_at: values.return_applicability === "yes" ? values.return_applicable_at : null,
        frequency: values.return_applicability === "yes" ? values.frequency : null,
        due_dates: values.return_applicability === "yes" ? formatDueDates(values.frequency, values.due_dates) : null
      };

      console.log('Submitting payload:', payload);

      const response = await httpClient.post(endpoints.return.create(), payload);
      
      if (response.data) {
        toast.push(
          <Notification title="Success" type="success">
            Return setup created successfully!
          </Notification>,
          { placement: 'top-center' }
        );
        resetForm();
        navigate('/return-setup');
      }
    } catch (error: any) {
      console.error('Error creating return setup:', error);
      let errorMessage = 'Failed to create return setup. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.push(
        <Notification title="Error" type="error">
          {errorMessage}
        </Notification>,
        { placement: 'top-center' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white p-2 rounded-lg'>
      <div className="flex gap-2 items-center mb-6">
        <Button
          size="sm"
          variant="plain"
          icon={<IoArrowBack className="text-gray-500 hover:text-gray-700" />}
          onClick={() => navigate(-1)}
        />
        <h3 className="text-2xl font-semibold">Add Return Setup</h3>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* First row - Act Name and Return Name */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  {/* <label htmlFor="act_name">Act Name <span className="text-red-500">*</span></label> */}
                  <ActNameAutoSuggest
                    value={values.act_name}
                    onChange={(value) => setFieldValue('act_name', value)}
                    onActSelect={(id) => {}}
                    options={actOptions}
                  />
                  {touched.act_name && errors.act_name && (
                    <div className="text-red-500 text-sm">{errors.act_name}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="return_name">Return Name <span className="text-red-500">*</span></label>
                  <OutlinedInput
                    value={values.return_name}
                    onChange={(value) => setFieldValue('return_name', value)}
                    isDisabled={!values.act_name}
                    label="Enter Return Name"
                  />
                  {touched.return_name && errors.return_name && (
                    <div className="text-red-500 text-sm">{errors.return_name}</div>
                  )}
                </div>
              </div>

              {/* Second row - Applicable and State (conditional) */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="applicable">Applicable<span className="text-red-500">*</span></label>
                  <OutlinedSelect 
                    options={applicableOptions}
                    value={applicableOptions.find(opt => opt.value === values.applicable) || null}
                    onChange={(selected) => {
                      const value = selected?.value || '';
                      setFieldValue('applicable', value);
                      if (value !== 'STATE') {
                        setFieldValue('state_id', '');
                      }
                    }}
                    disabled={!values.return_name}
                    label="Select Applicable"
                  />
                  {touched.applicable && errors.applicable && (
                    <div className="text-red-500 text-sm">{errors.applicable}</div>
                  )}
                </div>

                {values.applicable === 'STATE' && (
                  <div className="space-y-2">
                    <label htmlFor="state_id">State <span className="text-red-500">*</span></label>
                    <OutlinedSelect 
                      options={stateOptions}
                      value={stateOptions.find(opt => opt.value === values.state_id) || null}
                      onChange={(selected) => setFieldValue('state_id', selected?.value || '')}
                      disabled={!values.return_name}
                      label="Select State"
                    />
                    {touched.state_id && errors.state_id && (
                      <div className="text-red-500 text-sm">{errors.state_id}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Third row - Return Applicability and Applicable At (conditional) */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="return_applicability">Return Applicability<span className="text-red-500">*</span></label>
                  <OutlinedSelect 
                    options={applicabilityOptions}
                    value={applicabilityOptions.find(opt => opt.value === values.return_applicability) || null}
                    onChange={(selected) => {
                      const value = selected?.value || '';
                      setFieldValue('return_applicability', value);
                      if (value === 'no') {
                        setFieldValue('frequency', '');
                        setFieldValue('return_applicable_at', '');
                        setFieldValue('due_dates', {
                          first_due_date: null,
                          second_due_date: null,
                          third_due_date: null,
                          last_due_date: null,
                          bi_annual_due_date: null
                        });
                      }
                    }}
                    disabled={!values.applicable}
                    label="Select Return Applicability"
                  />
                  {touched.return_applicability && errors.return_applicability && (
                    <div className="text-red-500 text-sm">{errors.return_applicability}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="return_applicable_at">Return Applicability level<span className="text-red-500">*</span></label>
                  <OutlinedSelect 
                    options={applicableAtOptions}
                    value={applicableAtOptions.find(opt => opt.value === values.return_applicable_at) || null}
                    onChange={(selected) => setFieldValue('return_applicable_at', selected?.value || '')}
                    disabled={!values.return_applicability}
                    label="Select Return Applicability level"
                  />
                  {touched.return_applicable_at && errors.return_applicable_at && (
                    <div className="text-red-500 text-sm">{errors.return_applicable_at}</div>
                  )}
                </div>
              </div>

              {/* Fourth row - Frequency (conditional) */}
              {values.return_applicability === 'yes' && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="frequency">Frequency<span className="text-red-500">*</span></label>
                    <OutlinedSelect 
                      options={frequencyOptions}
                      value={frequencyOptions.find(opt => opt.value === values.frequency) || null}
                      onChange={(selected) => {
                        const value = selected?.value || '';
                        setFieldValue('frequency', value);
                        handleFrequencyChange(value);
                        setFieldValue('due_dates', {
                          first_due_date: null,
                          second_due_date: null,
                          third_due_date: null,
                          last_due_date: null,
                          bi_annual_due_date: null
                        });
                      }}
                      disabled={!values.return_applicable_at}
                      label="Select Frequency"
                    />
                    {touched.frequency && errors.frequency && (
                      <div className="text-red-500 text-sm">{errors.frequency}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Date Fields (conditional) */}
              {values.return_applicability === 'yes' && values.frequency && (
                <div className="grid grid-cols-2 gap-6">
                  {/* First Due Date */}
                  {enabledDateFields.first_due_date && (
                    <div className="space-y-2">
                      <label>First Due Date <span className="text-red-500">*</span></label>
                      <DatePicker 
                        value={values.due_dates.first_due_date}
                        onChange={(date) => setFieldValue('due_dates.first_due_date', date)}
                        disabled={!values.frequency}
                        placeholder="Select First Due Date"
                        inputFormat="DD-MM-YYYY"
                      />
                      {touched.due_dates?.first_due_date && errors.due_dates?.first_due_date && (
                        <div className="text-red-500 text-sm">{errors.due_dates.first_due_date}</div>
                      )}
                    </div>
                  )}

                  {/* Second Due Date */}
                  {enabledDateFields.second_due_date && (
                    <div className="space-y-2">
                      <label>Second Due Date <span className="text-red-500">*</span></label>
                      <DatePicker 
                        value={values.due_dates.second_due_date}
                        onChange={(date) => setFieldValue('due_dates.second_due_date', date)}
                        disabled={!values.frequency}
                        placeholder="Select Second Due Date"
                        inputFormat="DD-MM-YYYY"
                      />
                      {touched.due_dates?.second_due_date && errors.due_dates?.second_due_date && (
                        <div className="text-red-500 text-sm">{errors.due_dates.second_due_date}</div>
                      )}
                    </div>
                  )}

                  {/* Third Due Date */}
                  {enabledDateFields.third_due_date && (
                    <div className="space-y-2">
                      <label>Third Due Date <span className="text-red-500">*</span></label>
                      <DatePicker 
                        value={values.due_dates.third_due_date}
                        onChange={(date) => setFieldValue('due_dates.third_due_date', date)}
                        disabled={!values.frequency}
                        placeholder="Select Third Due Date"
                        inputFormat="DD-MM-YYYY"
                      />
                      {touched.due_dates?.third_due_date && errors.due_dates?.third_due_date && (
                        <div className="text-red-500 text-sm">{errors.due_dates.third_due_date}</div>
                      )}
                    </div>
                  )}

                  {/* Last Due Date */}
                  {enabledDateFields.last_due_date && (
                    <div className="space-y-2">
                      <label>Last Due Date <span className="text-red-500">*</span></label>
                      <DatePicker 
                        value={values.due_dates.last_due_date}
                        onChange={(date) => setFieldValue('due_dates.last_due_date', date)}
                        disabled={!values.frequency}
                        placeholder="Select Last Due Date"
                        inputFormat="DD-MM-YYYY"
                      />
                      {touched.due_dates?.last_due_date && errors.due_dates?.last_due_date && (
                        <div className="text-red-500 text-sm">{errors.due_dates.last_due_date}</div>
                      )}
                    </div>
                  )}

                  {/* Bi-Annual Due Date */}
                  {enabledDateFields.bi_annual_due_date && (
                    <div className="space-y-2">
                      <label>Bi-Annual Due Date <span className="text-red-500">*</span></label>
                      <DatePicker 
                        value={values.due_dates.bi_annual_due_date}
                        onChange={(date) => setFieldValue('due_dates.bi_annual_due_date', date)}
                        disabled={!values.frequency}
                        placeholder="Select Bi-Annual Due Date"
                        inputFormat="DD-MM-YYYY"
                      />
                      {touched.due_dates?.bi_annual_due_date && errors.due_dates?.bi_annual_due_date && (
                        <div className="text-red-500 text-sm">{errors.due_dates.bi_annual_due_date}</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Submit buttons */}
              <div className="flex justify-end gap-2 pt-8">
                <Button
                  type="button"
                  variant="plain"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="solid"
                  loading={loading}
                  disabled={loading}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReturnSetupAddForm;