
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button, Dialog, Notification, toast } from '@/components/ui';
// import { HiPlusCircle } from 'react-icons/hi';
// import AdaptableCard from '@/components/shared/AdaptableCard';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// import DatePicker from '@/components/ui/DatePicker';
// import BulkUpload from './components/BulkUpload';
// import StateTable from './components/StateTable';
// import { 
//   fetchStates, 
//   createState, 
//   updateState, 
//   deleteState,
//   clearError  } from '@/store/slices/state/stateSlice';
// import { AppDispatch, RootState } from '@/store';
// import { transformStatePayload } from '@/@types/stateTransformer';

// const frequencyOptions = [
//   { value: 'yearly', label: 'Yearly' },
//   { value: 'half_yearly', label: 'Half Yearly' },
//   { value: 'monthly', label: 'Monthly' },
// ];

// const paymentOptions = [
//   { value: 'online', label: 'Online' },
//   { value: 'offline', label: 'Offline' },
// ];

// const State = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { states, loading, error } = useSelector((state: RootState) => state.state);
  
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [newStateData, setNewStateData] = useState({
//     name: '',
//     ptec_frequency: '',
//     ptrc_frequency: '',
//     lwf_frequency: '',
//     paymentFrequency: '',
//     ptEcFirstDueDate: null,
//     ptEcLastDueDate: null,
//     ptRcFirstDueDate: null,
//     ptRcLastDueDate: null,
//     lwfFirstDueDate: null,
//     lwfLastDueDate: null,
//   });

//   useEffect(() => {
//     dispatch(fetchStates());
//   }, [dispatch]);

//   useEffect(() => {
//     if (error) {
//       toast.push(
//         <Notification title="Error" type="danger">
//           {error}
//         </Notification>
//       );
//       dispatch(clearError());
//     }
//   }, [error, dispatch]);

//   const handleInputChange = (name: string, value: string | Date | null | React.ChangeEvent<HTMLInputElement>) => {
//     if (value === null) {
//       setNewStateData(prev => ({ ...prev, [name]: null }));
//     } else if (typeof value === 'object' && 'target' in value) {
//       setNewStateData(prev => ({ ...prev, [name]: value.target.value }));
//     } else {
//       setNewStateData(prev => {
//         const updated = { ...prev, [name]: value };
//         if (name.includes('Frequency')) {
//           const lastDueDateField = name.replace('Frequency', 'LastDueDate');
//           if (value === 'yearly' || value === 'monthly') {
//             updated[lastDueDateField] = null;
//           }
//         }
//         return updated;
//       });
//     }
//   };

//   const isDatePickerDisabled = (type: 'first' | 'last', frequency: string) => {
//     if (type === 'first') {
//       return false; // First due date is always enabled
//     } else {
//       // Last due date is only enabled for half-yearly frequency
//       return frequency !== 'half-yearly';
//     }
//   };

//   const handleConfirm = async () => {
//     try {
//       console.log("creating the state")
//       const transformedData = transformStatePayload(newStateData);
//       await dispatch(createState(transformedData)).unwrap();
//       toast.push(
//         <Notification title="Success" type="success">
//           State assigned successfully!
//         </Notification>
//       );
//       handleDialogClose();
//     } catch (error) {
//       // Error handling is done in the useEffect above
//     }
//   };

//   const FrequencyRow = ({ 
//     title,
//     frequencyName,
//     firstDateName,
//     lastDateName,
//     frequency,
//   }: { 
//     title: string;
//     frequencyName: string;
//     firstDateName: string;
//     lastDateName: string;
//     frequency: string;
//   }) => (
//     <div className="flex gap-4">
//       <div className="w-1/3">
//         <label className="text-gray-600 mb-2 block">{title}</label>
//         <OutlinedSelect
//           label="Frequency"
//           options={frequencyOptions}
//           value={frequency}
//           onChange={(value) => handleInputChange(frequencyName, value)}
//         />
//       </div>
//       <div className="w-1/3">
//         <label className="text-gray-600 mb-2 block">First Due Date</label>
//         <DatePicker
//           className="w-full"
//           placeholder="Select date"
//           value={newStateData[firstDateName as keyof typeof newStateData] as Date | null}
//           onChange={(date) => handleInputChange(firstDateName, date)}
//           // disabled={isDatePickerDisabled('first', frequency)}
//         />
//       </div>
//       <div className="w-1/3">
//         <label className="text-gray-600 mb-2 block">Last Due Date</label>
//         <DatePicker
//           className="w-full"
//           placeholder="Select date"
//           value={newStateData[lastDateName as keyof typeof newStateData] as Date | null}
//           onChange={(date) => handleInputChange(lastDateName, date)}
//           // disabled={isDatePickerDisabled('last', frequency)}
//         />
//       </div>
//     </div>
//   );

//   const handleAssignState = () => setIsDialogOpen(true);
  
//   const handleDialogClose = () => {
//     setIsDialogOpen(false);
//     setNewStateData({
//       name: '',
//       ptec_frequency: '',
//       ptrc_frequency: '',
//       lwf_frequency: '',
//       paymentFrequency: '',
//       ptEcFirstDueDate: null,
//       ptEcLastDueDate: null,
//       ptRcFirstDueDate: null,
//       ptRcLastDueDate: null,
//       lwfFirstDueDate: null,
//       lwfLastDueDate: null,
//     });
//   };

//   return (
//     <AdaptableCard className="h-full" bodyClass="h-full">
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
//         <div className="mb-4 lg:mb-0">
//           <h3 className="text-2xl font-bold">State Manager</h3>
//         </div>
//         <div className="flex gap-2">
//           <BulkUpload />
//           <Button
//             variant="solid"
//             size="sm"
//             icon={<HiPlusCircle />}
//             onClick={handleAssignState}
//           >
//             Add State
//           </Button>
//         </div>
//       </div>
      
//       <StateTable 
//         stateData={states} 
//         loading={loading}
//         onUpdate={(id, data) => dispatch(updateState({ id, data }))}
//         onDelete={(id) => dispatch(deleteState(id))}
//       />
//       <Dialog
//         isOpen={isDialogOpen}
//         onClose={handleDialogClose}
//         onRequestClose={handleDialogClose}
//       >
//         <h5 className="mb-6">Assign State</h5>
//         <div className="flex flex-col gap-6">
//           {/* First Row: State and Payment Mode */}
//           <div className="flex gap-4">
//             <div className="w-1/2">
//               <label className="text-gray-600 mb-2 block">State Name</label>
//               <OutlinedInput 
//                 label="Enter state name"
//                 value={newStateData.name}
//                 onChange={(e) => handleInputChange('name', e)}
//               />
//             </div>
//             <div className="w-1/2">
//               <label className="text-gray-600 mb-2 block">Payment Mode</label>
//               <OutlinedSelect
//                 label="Select payment mode"
//                 options={paymentOptions}
//                 value={newStateData.paymentFrequency}
//                 onChange={(value) => handleInputChange('paymentFrequency', value)}
//               />
//             </div>
//           </div>

//           {/* PT EC Row */}
//           <FrequencyRow
//             title="PT EC Frequency"
//             frequencyName="ptec_frequency"
//             firstDateName="ptEcFirstDueDate"
//             lastDateName="ptEcLastDueDate"
//             frequency={newStateData.ptec_frequency}
//           />

//           {/* PT RC Row */}
//           <FrequencyRow
//             title="PT RC Frequency"
//             frequencyName="ptrc_frequency"
//             firstDateName="ptRcFirstDueDate"
//             lastDateName="ptRcLastDueDate"
//             frequency={newStateData.ptrc_frequency}
//           />

//           {/* LWF Row */}
//           <FrequencyRow
//             title="LWF Frequency"
//             frequencyName="lwf_frequency"
//             firstDateName="lwfFirstDueDate"
//             lastDateName="lwfLastDueDate"
//             frequency={newStateData.lwf_frequency}
//           />
//         </div>

//         <div className="flex justify-end gap-2 mt-6">
//           <Button
//             variant="plain"
//             onClick={handleDialogClose}
//           >
//             Cancel
//           </Button>
//           <Button variant="solid" onClick={handleConfirm}>
//             Confirm
//           </Button>
//         </div>
//       </Dialog>
//     </AdaptableCard>
//   );
// };

// export default State;



// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import { Button, Dialog, Notification, toast } from '@/components/ui';
// import { HiPlusCircle } from 'react-icons/hi';
// import AdaptableCard from '@/components/shared/AdaptableCard';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// import DatePicker from '@/components/ui/DatePicker';
// import BulkUpload from './components/BulkUpload';
// import StateTable from './components/StateTable';
// import { fetchStates, createState, clearError } from '@/store/slices/state/stateSlice';

// const frequencyOptions = [
//   { value: 'yearly', label: 'Yearly' },
//   { value: 'half_yearly', label: 'Half Yearly' },
//   { value: 'monthly', label: 'Monthly' },
// ];

// const paymentOptions = [
//   { value: 'online', label: 'Online' },
//   { value: 'offline', label: 'Offline' },
// ];

// // Validation schema for the state form
// const StateFormSchema = Yup.object().shape({
//   name: Yup.string().required('State name is required'),
//   payment_mode: Yup.string().required('Payment mode is required'),
//   ptec_frequency: Yup.string().required('PT EC frequency is required'),
//   ptrc_frequency: Yup.string().required('PT RC frequency is required'),
//   lwf_frequency: Yup.string().required('LWF frequency is required'),
//   ptec_payment_due_date: Yup.object().shape({
//     first_date: Yup.date().required('PT EC first due date is required'),
//     last_date: Yup.date().nullable()
//   }),
//   ptrc_payment_due_date: Yup.object().shape({
//     first_date: Yup.date().required('PT RC first due date is required'),
//     last_date: Yup.date().nullable()
//   }),
//   lwf_payment_due_date: Yup.object().shape({
//     first_date: Yup.date().required('LWF first due date is required'),
//     last_date: Yup.date().nullable()
//   })
// });

// const initialValues = {
//   name: '',
//   payment_mode: '',
//   ptec_frequency: '',
//   ptrc_frequency: '',
//   lwf_frequency: '',
//   ptec_payment_due_date: { first_date: null, last_date: null },
//   ptrc_payment_due_date: { first_date: null, last_date: null },
//   lwf_payment_due_date: { first_date: null, last_date: null }
// };

// const State = () => {
//   const dispatch = useDispatch();
//   const { states, loading, error } = useSelector((state) => state.state);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [ stateTableData, setStateTableData ] = useState([]);

//   useEffect(()=>{
//     fetchStateDataTable();
//   },[]);

//   const fetchStateDataTable = async () => {
//     const { payload: data }: any = await dispatch(fetchStates()); 
//     setStateTableData(data.data)
//     console.log(stateTableData)
//     console.log(data)

//   }

//   useEffect(() => {
//     if (error) {
//       toast.push(
//         <Notification title="Error" type="danger">
//           {error}
//         </Notification>
//       );
//       dispatch(clearError());
//     }
//   }, [error, dispatch]);

//   const handleSubmit = async (values, { resetForm }) => {
//     setIsSubmitting(true);
//     try {
//       await dispatch(createState(values)).unwrap();
//       toast.push(
//         <Notification title="Success" type="success">
//           State added successfully!
//         </Notification>
//       );
//       resetForm();
//       setIsDialogOpen(false);
//     } catch (error) {
//       toast.push(
//         <Notification title="Error" type="danger">
//           {error.message || 'Failed to add state'}
//         </Notification>
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const FrequencyFields = ({ name, title, values, setFieldValue }) => (
//     <div className="flex flex-col gap-4">
//       <div className="w-full">
//         <label className="text-gray-600 mb-2 block">{title}</label>
//         <OutlinedSelect
//           name={`${name}_frequency`}
//           options={frequencyOptions}
//           value={values[`${name}_frequency`]}
//           onChange={(value) => setFieldValue(`${name}_frequency`, value)}
//         />
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="text-gray-600 mb-2 block">First Due Date</label>
//           <DatePicker
//             className="w-full"
//             placeholder="Select date"
//             value={values[`${name}_payment_due_date`].first_date}
//             onChange={(date) => setFieldValue(`${name}_payment_due_date.first_date`, date)}
//           />
//         </div>
//         <div>
//           <label className="text-gray-600 mb-2 block">Last Due Date</label>
//           <DatePicker
//             className="w-full"
//             placeholder="Select date"
//             value={values[`${name}_payment_due_date`].last_date}
//             onChange={(date) => setFieldValue(`${name}_payment_due_date.last_date`, date)}
//             disabled={values[`${name}_frequency`] !== 'half_yearly'}
//           />
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <AdaptableCard className="h-full" bodyClass="h-full">
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
//         <div className="mb-4 lg:mb-0">
//           <h3 className="text-2xl font-bold">State Manager</h3>
//         </div>
//         <div className="flex gap-2">
//           <BulkUpload />
//           <Button
//             variant="solid"
//             size="sm"
//             icon={<HiPlusCircle />}
//             onClick={() => setIsDialogOpen(true)}
//           >
//             Add State
//           </Button>
//         </div>
//       </div>

//       <StateTable stateData={stateTableData} loading={loading} />

//       <Dialog
//         isOpen={isDialogOpen}
//         onClose={() => setIsDialogOpen(false)}
//       >
//         <Formik
//           initialValues={initialValues}
//           validationSchema={StateFormSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ values, errors, touched, setFieldValue }) => (
//             <Form className="flex flex-col gap-6">
//               <h5 className="mb-4">Add New State</h5>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-gray-600 mb-2 block">State Name</label>
//                   <Field
//                     as={OutlinedInput}
//                     name="name"
//                     error={touched.name && errors.name}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-gray-600 mb-2 block">Payment Mode</label>
//                   <Field
//                     as={OutlinedSelect}
//                     name="payment_mode"
//                     options={paymentOptions}
//                     error={touched.payment_mode && errors.payment_mode}
//                   />
//                 </div>
//               </div>

//               <FrequencyFields
//                 name="ptec"
//                 title="PT EC Frequency"
//                 values={values}
//                 setFieldValue={setFieldValue}
//               />

//               <FrequencyFields
//                 name="ptrc"
//                 title="PT RC Frequency"
//                 values={values}
//                 setFieldValue={setFieldValue}
//               />

//               <FrequencyFields
//                 name="lwf"
//                 title="LWF Frequency"
//                 values={values}
//                 setFieldValue={setFieldValue}
//               />

//               <div className="flex justify-end gap-2 mt-6">
//                 <Button
//                   variant="plain"
//                   onClick={() => setIsDialogOpen(false)}
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   variant="solid" 
//                   type="submit"
//                   loading={isSubmitting}
//                 >
//                   Confirm
//                 </Button>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </Dialog>
//     </AdaptableCard>
//   );
// };

// export default State;


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import AdaptableCard from '@/components/shared/AdaptableCard';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import DatePicker from '@/components/ui/DatePicker';
import BulkUpload from './components/BulkUpload';
import StateTable from './components/StateTable';
import { fetchStates, createState, clearError } from '@/store/slices/state/stateSlice';
import { RootState } from '@/store';

const frequencyOptions = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'monthly', label: 'Monthly' },
];

const paymentOptions = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
];

const StateFormSchema = Yup.object().shape({
  name: Yup.string().required('State name is required'),
  payment_mode: Yup.string().required('Payment mode is required'),
  ptec_frequency: Yup.string().required('PT EC frequency is required'),
  ptrc_frequency: Yup.string().required('PT RC frequency is required'),
  lwf_frequency: Yup.string().required('LWF frequency is required'),
  ptec_payment_due_date: Yup.object().shape({
    first_date: Yup.date().required('PT EC first due date is required'),
    last_date: Yup.date().nullable()
  }),
  ptrc_payment_due_date: Yup.object().shape({
    first_date: Yup.date().required('PT RC first due date is required'),
    last_date: Yup.date().nullable()
  }),
  lwf_payment_due_date: Yup.object().shape({
    first_date: Yup.date().required('LWF first due date is required'),
    last_date: Yup.date().nullable()
  })
});

const initialValues = {
  name: '',
  payment_mode: '',
  ptec_frequency: '',
  ptrc_frequency: '',
  lwf_frequency: '',
  ptec_payment_due_date: { first_date: null, last_date: null },
  ptrc_payment_due_date: { first_date: null, last_date: null },
  lwf_payment_due_date: { first_date: null, last_date: null }
};

const State = () => {
  const dispatch = useDispatch();
  const { states, loading, error } = useSelector((state: RootState) => state.state);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
   const [ stateTableData, setStateTableData ] = useState([])
   useEffect(()=>{
     fetchStateDataTable();
   },[])
   const fetchStateDataTable = async () => {
     const { payload: data }: any = await dispatch(fetchStates()); 
     setStateTableData(data.data)
     console.log(stateTableData)
     console.log(data)
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

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      await dispatch(createState(values)).unwrap();
      toast.push(
        <Notification title="Success" type="success">
          State added successfully!
        </Notification>
      );
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
        Failed to add state
        </Notification>
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const FrequencyRow = ({ 
    prefix, 
    title, 
    values, 
    setFieldValue, 
    errors, 
    touched 
  }) => (
    <div className="flex gap-4">
      <div className="w-1/3">
        <label className="text-gray-600 mb-2 block">{title}</label>
        <OutlinedSelect
          label="Frequency"
          options={frequencyOptions}
          value={values[`${prefix}_frequency`]}
          onChange={(value) => setFieldValue(`${prefix}_frequency`, value)}
          // error={touched[`${prefix}_frequency`] && errors[`${prefix}_frequency`]}
        />
      </div>
      <div className="w-1/3">
        <label className="text-gray-600 mb-2 block">First Due Date</label>
        <DatePicker
          className="w-full"
          placeholder="Select date"
          value={values[`${prefix}_payment_due_date`].first_date}
          onChange={(date) => setFieldValue(`${prefix}_payment_due_date.first_date`, date)}
          // error={touched[`${prefix}_payment_due_date`]?.first_date && 
                //  errors[`${prefix}_payment_due_date`]?.first_date}
        />
      </div>
      <div className="w-1/3">
        <label className="text-gray-600 mb-2 block">Last Due Date</label>
        <DatePicker
          className="w-full"
          placeholder="Select date"
          value={values[`${prefix}_payment_due_date`].last_date}
          onChange={(date) => setFieldValue(`${prefix}_payment_due_date.last_date`, date)}
          disabled={values[`${prefix}_frequency`] !== 'half_yearly'}
          // error={touched[`${prefix}_payment_due_date`]?.last_date && 
                //  errors[`${prefix}_payment_due_date`]?.last_date}
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

      <StateTable stateData={stateTableData} loading={loading} />

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={StateFormSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="flex flex-col gap-6">
              <h5 className="mb-4">Add New State</h5>

              {/* First Row - State Name and Payment Mode */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-gray-600 mb-2 block">State Name</label>
                  <OutlinedInput 
                  label='State Name'
                    value={values.name}
                    onChange={(e) => setFieldValue('name', e.target.value)}
                    // error={touched.name && errors.name}
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-gray-600 mb-2 block">Payment Mode</label>
                  <OutlinedSelect
                  label='Mode'
                    options={paymentOptions}
                    value={values.payment_mode}
                    onChange={(value) => setFieldValue('payment_mode', value)}
                    // error={touched.payment_mode && errors.payment_mode}
                  />
                </div>
              </div>

              {/* PT EC Row */}
              <FrequencyRow
                prefix="ptec"
                title="PT EC Frequency"
                values={values}
                setFieldValue={setFieldValue}
                errors={errors}
                touched={touched}
              />

              {/* PT RC Row */}
              <FrequencyRow
                prefix="ptrc"
                title="PT RC Frequency"
                values={values}
                setFieldValue={setFieldValue}
                errors={errors}
                touched={touched}
              />

              {/* LWF Row */}
              <FrequencyRow
                prefix="lwf"
                title="LWF Frequency"
                values={values}
                setFieldValue={setFieldValue}
                errors={errors}
                touched={touched}
              />

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="plain"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  variant="solid" 
                  type="submit"
                  loading={isSubmitting}
                >
                  Confirm
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
    </AdaptableCard>
  );
};

export default State;