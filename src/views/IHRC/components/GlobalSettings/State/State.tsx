// import React, { useState, useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { Button, Dialog, Notification, toast } from '@/components/ui'
// import { HiPlusCircle } from 'react-icons/hi'
// import AdaptableCard from '@/components/shared/AdaptableCard'
// import OutlinedInput from '@/components/ui/OutlinedInput'
// import OutlinedSelect from '@/components/ui/Outlined/Outlined'
// import DatePicker from '@/components/ui/DatePicker'
// import BulkUpload from './components/BulkUpload'
// import StateTable from './components/StateTable'
// import {
//     fetchStates,
//     createState,
//     updateState,
//     clearError,
// } from '@/store/slices/state/stateSlice'
// import { AppDispatch, RootState } from '@/store'
// import { transformStatePayload } from '@/@types/stateTransformer'

// const frequencyOptions = [
//     { value: 'yearly', label: 'Yearly' },
//     { value: 'half_yearly', label: 'Half Yearly' },
//     { value: 'monthly', label: 'Monthly' },
// ]

// const paymentOptions = [
//     { value: 'online', label: 'Online' },
//     { value: 'offline', label: 'Offline' },
// ]

// const initialStateData = {
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
// }

// const State = () => {
//     const dispatch = useDispatch<AppDispatch>()
//     const { states, loading, error } = useSelector(
//         (state: RootState) => state.state,
//     )
//     const [stateTableLoading, setStateTableLoading] = useState(false)

//     const [isDialogOpen, setIsDialogOpen] = useState(false)
//     const [isEditMode, setIsEditMode] = useState(false)
//     const [editingId, setEditingId] = useState<string | null>(null)

//     const [currentStateId, setCurrentStateId] = useState(null)
//     const [stateData, setStateData] = useState(initialStateData)
//     const [stateTableData, setStateTableData] = useState([])

//     useEffect(() => {
//         fetchStateData()
//     }, [])

//     const fetchStateData = async () => {
//         const { payload: data } = await dispatch(fetchStates())
//         setStateTableData(data.data)
//     }

//     useEffect(() => {
//         if (error) {
//             toast.push(
//                 <Notification title="Error" closable={true} type="danger">
//                     {error}
//                 </Notification>,
//             )
//             dispatch(clearError())
//         }
//     }, [error, dispatch])

//     const handleEdit = (stateToEdit) => {
//         setIsEditMode(true)
//         setCurrentStateId(stateToEdit.id)
//         console.log(stateToEdit)
//         setStateData({
//             name: stateToEdit.name,
//             ptec_frequency: stateToEdit.ptec_frequency,
//             ptrc_frequency: stateToEdit.ptrc_frequency,
//             lwf_frequency: stateToEdit.lwf_frequency,
//             paymentFrequency: stateToEdit.payment_mode,
//             ptEcFirstDueDate:
//                 stateToEdit.ptec_payment_due_date?.first_date || null,
//             ptEcLastDueDate:
//                 stateToEdit.ptec_payment_due_date?.last_date || null,
//             ptRcFirstDueDate:
//                 stateToEdit.ptrc_payment_due_date?.first_date || null,
//             ptRcLastDueDate:
//                 stateToEdit.ptrc_payment_due_date?.last_date || null,
//             lwfFirstDueDate:
//                 stateToEdit.lwf_payment_due_date?.first_date || null,
//             lwfLastDueDate: stateToEdit.lwf_payment_due_date?.last_date || null,
//         })
//         setIsDialogOpen(true)
//     }

//     const handleInputChange = (
//         name: string,
//         value: string | Date | null | React.ChangeEvent<HTMLInputElement>,
//     ) => {
//         if (value === null) {
//             setStateData((prev) => ({ ...prev, [name]: null }))
//         } else if (typeof value === 'object' && 'target' in value) {
//             setStateData((prev) => ({ ...prev, [name]: value.target.value }))
//         } else {
//             setStateData((prev) => {
//                 const updated = { ...prev, [name]: value }
//                 if (name.includes('Frequency')) {
//                     const lastDueDateField = name.replace(
//                         'Frequency',
//                         'LastDueDate',
//                     )
//                     if (value === 'yearly' || value === 'monthly') {
//                         updated[lastDueDateField] = null
//                     }
//                 }
//                 return updated
//             })
//         }
//     }

//     const handleDialogClose = () => {
//         setIsDialogOpen(false)
//         setIsEditMode(false)
//         setCurrentStateId(null)
//         setStateData(initialStateData)
//     }

//     const handleConfirm = async () => {
//         try {
//             const transformedData = transformStatePayload(stateData)
//             if (isEditMode && editingId) {
//                 await dispatch(
//                     updateState({ id: currentStateId, data: transformedData }),
//                 )

//                 handleDialogClose()
//                 setStateTableLoading(true)

//                 // await dispatch()
//                 toast.push(
//                     <Notification title="Success" type="success">
//                         State updated successfully!
//                     </Notification>,
//                 )
//             } else {
//                 await dispatch(createState(transformedData)).unwrap()
//                 handleDialogClose()
//                 setStateTableLoading(true)
//                 toast.push(
//                     <Notification title="Success" type="success">
//                         State created successfully!
//                     </Notification>,
//                 )
//             }
//         } catch (error) {
//             // Error handling is done in the useEffect above
//         }
//     }

//     const FrequencyRow = ({
//         title,
//         frequencyName,
//         firstDateName,
//         lastDateName,
//         frequency,
//     }) => (
//         <div className="flex gap-4">
//             <div className="w-1/3">
//                 <label className="text-gray-600 mb-2 block">{title}</label>
//                 <OutlinedSelect
//                     label="Frequency"
//                     options={frequencyOptions}
//                     value={frequency}
//                     onChange={(value) =>
//                         handleInputChange(frequencyName, value)
//                     }
//                 />
//             </div>
//             <div className="w-1/3">
//                 <label className="text-gray-600 mb-2 block">
//                     First Due Date
//                 </label>
//                 <DatePicker
//                     className="w-full"
//                     placeholder="Select date"
//                     value={stateData[firstDateName]}
//                     onChange={(date) => handleInputChange(firstDateName, date)}
//                 />
//             </div>
//             <div className="w-1/3">
//                 <label className="text-gray-600 mb-2 block">
//                     Last Due Date
//                 </label>
//                 <DatePicker
//                     className="w-full"
//                     placeholder="Select date"
//                     value={stateData[lastDateName]}
//                     onChange={(date) => handleInputChange(lastDateName, date)}
//                     disabled={frequency !== 'half_yearly'}
//                 />
//             </div>
//         </div>
//     )

//     return (
//         <AdaptableCard className="h-full" bodyClass="h-full">
//             <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
//                 <div className="mb-4 lg:mb-0">
//                     <h3 className="text-2xl font-bold">State Manager</h3>
//                 </div>
//                 <div className="flex gap-2">
//                     <BulkUpload />
//                     <Button
//                         variant="solid"
//                         size="sm"
//                         icon={<HiPlusCircle />}
//                         onClick={() => setIsDialogOpen(true)}
//                     >
//                         Add State
//                     </Button>
//                 </div>
//             </div>

//             <StateTable
//                 tableLoading={stateTableLoading}
//                 setStateTableLoading={setStateTableLoading}
//                 stateData={stateTableData}
//                 loading={loading}
//                 onEdit={handleEdit}
//             />

//             <Dialog
//                 isOpen={isDialogOpen}
//                 onClose={handleDialogClose}
//                 onRequestClose={handleDialogClose}
//             >
//                 <h5 className="mb-6">
//                     {isEditMode ? 'Edit State' : 'Add State'}
//                 </h5>
//                 <div className="flex flex-col gap-6">
//                     <div className="flex gap-4">
//                         <div className="w-1/2">
//                             <label className="text-gray-600 mb-2 block">
//                                 State Name
//                             </label>
//                             <OutlinedInput
//                                 label="Enter state name"
//                                 value={stateData.name}
//                                 onChange={(e) => handleInputChange('name', e)}
//                             />
//                         </div>
//                         <div className="w-1/2">
//                             <label className="text-gray-600 mb-2 block">
//                                 Payment Mode
//                             </label>
//                             <OutlinedSelect
//                                 label="Select payment mode"
//                                 options={paymentOptions}
//                                 value={stateData.paymentFrequency}
//                                 onChange={(value) =>
//                                     handleInputChange('paymentFrequency', value)
//                                 }
//                             />
//                         </div>
//                     </div>

//                     <FrequencyRow
//                         title="PT EC Frequency"
//                         frequencyName="ptec_frequency"
//                         firstDateName="ptEcFirstDueDate"
//                         lastDateName="ptEcLastDueDate"
//                         frequency={stateData.ptec_frequency}
//                     />

//                     <FrequencyRow
//                         title="PT RC Frequency"
//                         frequencyName="ptrc_frequency"
//                         firstDateName="ptRcFirstDueDate"
//                         lastDateName="ptRcLastDueDate"
//                         frequency={stateData.ptrc_frequency}
//                     />

//                     <FrequencyRow
//                         title="LWF Frequency"
//                         frequencyName="lwf_frequency"
//                         firstDateName="lwfFirstDueDate"
//                         lastDateName="lwfLastDueDate"
//                         frequency={stateData.lwf_frequency}
//                     />
//                 </div>

//                 <div className="flex justify-end gap-2 mt-6">
//                     <Button variant="plain" onClick={handleDialogClose}>
//                         Cancel
//                     </Button>
//                     <Button variant="solid" onClick={handleConfirm}>
//                         {isEditMode ? 'Update' : 'Confirm'}
//                     </Button>
//                 </div>
//             </Dialog>
//         </AdaptableCard>
//     )
// }

// export default State

// // import React, { useState, useEffect } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { Button, Dialog, Notification, toast } from '@/components/ui';
// // import { HiPlusCircle } from 'react-icons/hi';
// // import AdaptableCard from '@/components/shared/AdaptableCard';
// // import OutlinedInput from '@/components/ui/OutlinedInput';
// // import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// // import DatePicker from '@/components/ui/DatePicker';
// // import BulkUpload from './components/BulkUpload';
// // import StateTable from './components/StateTable';
// // import {
// //   fetchStates,
// //   createState,
// //   updateState,
// //   clearError
// // } from '@/store/slices/state/stateSlice';
// // import { AppDispatch, RootState } from '@/store';
// // import { transformStatePayload } from '@/@types/stateTransformer';

// // const frequencyOptions = [
// //   { value: 'yearly', label: 'Yearly' },
// //   { value: 'half_yearly', label: 'Half Yearly' },
// //   { value: 'monthly', label: 'Monthly' },
// // ];

// // const paymentOptions = [
// //   { value: 'online', label: 'Online' },
// //   { value: 'offline', label: 'Offline' },
// // ];

// // const initialStateData = {
// //   name: '',
// //   ptec_frequency: '',
// //   ptrc_frequency: '',
// //   lwf_frequency: '',
// //   paymentFrequency: '',
// //   ptEcFirstDueDate: null,
// //   ptEcLastDueDate: null,
// //   ptRcFirstDueDate: null,
// //   ptRcLastDueDate: null,
// //   lwfFirstDueDate: null,
// //   lwfLastDueDate: null,
// // };

// // const State = () => {
// //   const dispatch = useDispatch<AppDispatch>();
// //   const { states, loading, error } = useSelector((state: RootState) => state.state);
// //   const [tableKey, setTableKey] = useState(0);
// //   const [pfTableLoading, setPfTableLoading] = useState(false)

// //   const [isDialogOpen, setIsDialogOpen] = useState(false);
// //   const [isEditMode, setIsEditMode] = useState(false);
// //   const [editingId, setEditingId] = useState<string | null>(null);
// //   const [currentStateId, setCurrentStateId] = useState(null);
// //   const [stateData, setStateData] = useState(initialStateData);

// //   useEffect(() => {
// //     if (error) {
// //       toast.push(
// //         <Notification title="Error" closable={true} type="danger">
// //           {error}
// //         </Notification>
// //       );
// //       dispatch(clearError());
// //     }
// //   }, [error, dispatch]);

// //   const handleEdit = (stateToEdit) => {
// //     setIsEditMode(true);
// //     setCurrentStateId(stateToEdit.id);
// //     setStateData({
// //       name: stateToEdit.name,
// //       ptec_frequency: stateToEdit.ptec_frequency,
// //       ptrc_frequency: stateToEdit.ptrc_frequency,
// //       lwf_frequency: stateToEdit.lwf_frequency,
// //       paymentFrequency: stateToEdit.payment_mode,
// //       ptEcFirstDueDate: stateToEdit.ptec_payment_due_date?.first_date || null,
// //       ptEcLastDueDate: stateToEdit.ptec_payment_due_date?.last_date || null,
// //       ptRcFirstDueDate: stateToEdit.ptrc_payment_due_date?.first_date || null,
// //       ptRcLastDueDate: stateToEdit.ptrc_payment_due_date?.last_date || null,
// //       lwfFirstDueDate: stateToEdit.lwf_payment_due_date?.first_date || null,
// //       lwfLastDueDate: stateToEdit.lwf_payment_due_date?.last_date || null,
// //     });
// //     setIsDialogOpen(true);
// //   };

// //   const handleInputChange = (name: string, value: string | Date | null | React.ChangeEvent<HTMLInputElement>) => {
// //     if (value === null) {
// //       setStateData(prev => ({ ...prev, [name]: null }));
// //     } else if (typeof value === 'object' && 'target' in value) {
// //       setStateData(prev => ({ ...prev, [name]: value.target.value }));
// //     } else {
// //       setStateData(prev => {
// //         const updated = { ...prev, [name]: value };
// //         if (name.includes('Frequency')) {
// //           const lastDueDateField = name.replace('Frequency', 'LastDueDate');
// //           if (value === 'yearly' || value === 'monthly') {
// //             updated[lastDueDateField] = null;
// //           }
// //         }
// //         return updated;
// //       });
// //     }
// //   };

// //   const handleDialogClose = () => {
// //     setIsDialogOpen(false);
// //     setIsEditMode(false);
// //     setCurrentStateId(null);
// //     setStateData(initialStateData);
// //   };

// //   const handleConfirm = async () => {
// //     try {
// //       const transformedData = transformStatePayload(stateData);
// //       if (isEditMode && currentStateId) {
// //         await dispatch(updateState({ id: currentStateId, data: transformedData }));
// //         handleDialogClose();
// //         setPfTableLoading(true)

// //         toast.push(
// //           <Notification title="Success" type="success">
// //             State updated successfully!
// //           </Notification>
// //         );

// //       } else {
// //         await dispatch(createState(transformedData)).unwrap();
// //         handleDialogClose();
// //         setPfTableLoading(true)
// //         toast.push(
// //           <Notification title="Success" type="success">
// //             State created successfully!
// //           </Notification>
// //         );
// //       }
// //       setTableKey(prev => prev + 1);
// //     } catch (error) {
// //       // Error handling is done in the useEffect above
// //       console.log(error)
// //       toast.push(
// //         <Notification title="Error" closable={true} type="danger">
// //             Failed to {isEditMode ? 'update' : 'add'} state
// //         </Notification>,
// //     )
// //     }
// //   };

// //   const FrequencyRow = ({
// //     title,
// //     frequencyName,
// //     firstDateName,
// //     lastDateName,
// //     frequency,
// //   }) => (
// //     <div className="flex gap-4">
// //       <div className="w-1/3">
// //         <label className="text-gray-600 mb-2 block">{title}</label>
// //         <OutlinedSelect
// //           label="Frequency"
// //           options={frequencyOptions}
// //           value={frequency}
// //           onChange={(value) => handleInputChange(frequencyName, value)}
// //         />
// //       </div>
// //       <div className="w-1/3">
// //         <label className="text-gray-600 mb-2 block">First Due Date</label>
// //         <DatePicker
// //           className="w-full"
// //           placeholder="Select date"
// //           value={stateData[firstDateName]}
// //           onChange={(date) => handleInputChange(firstDateName, date)}
// //         />
// //       </div>
// //       <div className="w-1/3">
// //         <label className="text-gray-600 mb-2 block">Last Due Date</label>
// //         <DatePicker
// //           className="w-full"
// //           placeholder="Select date"
// //           value={stateData[lastDateName]}
// //           onChange={(date) => handleInputChange(lastDateName, date)}
// //           disabled={frequency !== 'half_yearly'}
// //         />
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <AdaptableCard className="h-full" bodyClass="h-full">
// //       <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
// //         <div className="mb-4 lg:mb-0">
// //           <h3 className="text-2xl font-bold">State Manager</h3>
// //         </div>
// //         <div className="flex gap-2">
// //           <BulkUpload />
// //           <Button
// //             variant="solid"
// //             size="sm"
// //             icon={<HiPlusCircle />}
// //             onClick={() => setIsDialogOpen(true)}
// //           >
// //             Add State
// //           </Button>
// //         </div>
// //       </div>

// //       <StateTable
// //       tableLoading={pfTableLoading}
// //       setPfTableLoading={setPfTableLoading}
// //         key={tableKey}
// //         loading={loading}
// //         onEdit={handleEdit}
// //       />

// //       <Dialog
// //         isOpen={isDialogOpen}
// //         onClose={handleDialogClose}
// //         onRequestClose={handleDialogClose}
// //       >
// //         <h5 className="mb-6">{isEditMode ? 'Edit State' : 'Add State'}</h5>
// //         <div className="flex flex-col gap-6">
// //           <div className="flex gap-4">
// //             <div className="w-1/2">
// //               <label className="text-gray-600 mb-2 block">State Name</label>
// //               <OutlinedInput
// //                 label="Enter state name"
// //                 value={stateData.name}
// //                 onChange={(e) => handleInputChange('name', e)}
// //               />
// //             </div>
// //             <div className="w-1/2">
// //               <label className="text-gray-600 mb-2 block">Payment Mode</label>
// //               <OutlinedSelect
// //                 label="Select payment mode"
// //                 options={paymentOptions}
// //                 value={stateData.paymentFrequency}
// //                 onChange={(value) => handleInputChange('paymentFrequency', value)}
// //               />
// //             </div>
// //           </div>

// //           <FrequencyRow
// //             title="PT EC Frequency"
// //             frequencyName="ptec_frequency"
// //             firstDateName="ptEcFirstDueDate"
// //             lastDateName="ptEcLastDueDate"
// //             frequency={stateData.ptec_frequency}
// //           />

// //           <FrequencyRow
// //             title="PT RC Frequency"
// //             frequencyName="ptrc_frequency"
// //             firstDateName="ptRcFirstDueDate"
// //             lastDateName="ptRcLastDueDate"
// //             frequency={stateData.ptrc_frequency}
// //           />

// //           <FrequencyRow
// //             title="LWF Frequency"
// //             frequencyName="lwf_frequency"
// //             firstDateName="lwfFirstDueDate"
// //             lastDateName="lwfLastDueDate"
// //             frequency={stateData.lwf_frequency}
// //           />
// //         </div>

// //         <div className="flex justify-end gap-2 mt-6">
// //           <Button
// //             variant="plain"
// //             onClick={handleDialogClose}
// //           >
// //             Cancel
// //           </Button>
// //           <Button variant="solid" onClick={handleConfirm}>
// //             {isEditMode ? 'Update' : 'Confirm'}
// //           </Button>
// //         </div>
// //       </Dialog>
// //     </AdaptableCard>
// //   );
// // };

// // export default State;



import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import { HiPlusCircle } from 'react-icons/hi'
import AdaptableCard from '@/components/shared/AdaptableCard'
import OutlinedInput from '@/components/ui/OutlinedInput'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import DatePicker from '@/components/ui/DatePicker'
import BulkUpload from './components/BulkUpload'
import StateTable from './components/StateTable'
import {
    fetchStates,
    createState,
    updateState,
    clearError,
} from '@/store/slices/state/stateSlice'
import { AppDispatch, RootState } from '@/store'
import { transformStatePayload } from '@/@types/stateTransformer'

const frequencyOptions = [
    { value: 'yearly', label: 'Yearly' },
    { value: 'half_yearly', label: 'Half Yearly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
]

const paymentOptions = [
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
]

const initialStateData = {
    name: '',
    district: '',
    location: '',
    lwf_frequency: '',
    lwf_payment_mode: '',
    lwf_due_dates: {
        first_date: null,
        second_date: null,
        third_date: null,
        last_date: null
    },
    ptrc_frequency: '',
    ptrc_payment_mode: '',
    ptrc_due_dates: {
        first_date: null,
        second_date: null,
        third_date: null,
        last_date: null
    },
    ptec_frequency: '',
    ptec_payment_mode: '',
    ptec_due_dates: {
        first_date: null,
        second_date: null,
        third_date: null,
        last_date: null
    }
}

const State = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { states, loading, error } = useSelector(
        (state: RootState) => state.state
    )
    const [stateTableLoading, setStateTableLoading] = useState(false)

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [currentStateId, setCurrentStateId] = useState(null)
    const [stateData, setStateData] = useState(initialStateData)

    useEffect(() => {
        if (error) {
            toast.push(
                <Notification title="Error" closable={true} type="danger">
                    {error}
                </Notification>,
            )
            dispatch(clearError())
        }
    }, [error, dispatch])

    const handleEdit = (stateToEdit) => {
        setIsEditMode(true)
        setCurrentStateId(stateToEdit.id)
        setStateData({
            name: stateToEdit.name,
            district: stateToEdit.district || '',
            location: stateToEdit.location || '',
            lwf_frequency: stateToEdit.lwf_frequency,
            lwf_payment_mode: stateToEdit.lwf_payment_mode,
            lwf_due_dates: stateToEdit.lwf_due_dates || {
                first_date: null,
                second_date: null,
                third_date: null,
                last_date: null
            },
            ptrc_frequency: stateToEdit.ptrc_frequency,
            ptrc_payment_mode: stateToEdit.ptrc_payment_mode,
            ptrc_due_dates: stateToEdit.ptrc_due_dates || {
                first_date: null,
                second_date: null,
                third_date: null,
                last_date: null
            },
            ptec_frequency: stateToEdit.ptec_frequency,
            ptec_payment_mode: stateToEdit.ptec_payment_mode,
            ptec_due_dates: stateToEdit.ptec_due_dates || {
                first_date: null,
                second_date: null,
                third_date: null,
                last_date: null
            }
        })
        setIsDialogOpen(true)
    }

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            // Handle nested fields like due dates
            const [parent, child] = field.split('.')
            setStateData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }))
        } else {
            setStateData(prev => ({
                ...prev,
                [field]: value
            }))
        }
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false)
        setIsEditMode(false)
        setCurrentStateId(null)
        setStateData(initialStateData)
    }

    const handleConfirm = async () => {
        try {
            const transformedData = transformStatePayload(stateData)
            if (isEditMode && currentStateId) {
                await dispatch(
                    updateState({ id: currentStateId, data: transformedData }),
                )
                toast.push(
                    <Notification title="Success" type="success">
                        State updated successfully!
                    </Notification>,
                )
            } else {
                await dispatch(createState(transformedData))
                toast.push(
                    <Notification title="Success" type="success">
                        State created successfully!
                    </Notification>,
                )
            }
            setStateTableLoading(true)
            handleDialogClose()
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const renderFrequencySection = (title, frequencyField, paymentModeField, dueDatesField) => (
        <div className="mb-6">
            <h6 className="mb-4">{title}</h6>
            <div className="flex gap-4 mb-4">
                <div className="w-1/3">
                    <label className="text-gray-600 mb-2 block">Frequency</label>
                    <OutlinedSelect
                        options={frequencyOptions}
                        value={stateData[frequencyField]}
                        onChange={(value) => handleInputChange(frequencyField, value)} label={undefined}                    />
                </div>
                <div className="w-1/3">
                    <label className="text-gray-600 mb-2 block">Payment Mode</label>
                    <OutlinedSelect
                        options={paymentOptions}
                        value={stateData[paymentModeField]}
                        onChange={(value) => handleInputChange(paymentModeField, value)} label={undefined}                    />
                </div>
            </div>
            <div className="flex gap-4">
                <div className="w-1/4">
                    <label className="text-gray-600 mb-2 block">First Due Date</label>
                    <DatePicker
                        placeholder="Select date"
                        value={stateData[dueDatesField]?.first_date}
                        onChange={(date) => handleInputChange(`${dueDatesField}.first_date`, date)}
                    />
                </div>
                <div className="w-1/4">
                    <label className="text-gray-600 mb-2 block">Second Due Date</label>
                    <DatePicker
                        placeholder="Select date"
                        value={stateData[dueDatesField]?.second_date}
                        onChange={(date) => handleInputChange(`${dueDatesField}.second_date`, date)}
                    />
                </div>
                <div className="w-1/4">
                    <label className="text-gray-600 mb-2 block">Third Due Date</label>
                    <DatePicker
                        placeholder="Select date"
                        value={stateData[dueDatesField]?.third_date}
                        onChange={(date) => handleInputChange(`${dueDatesField}.third_date`, date)}
                    />
                </div>
                <div className="w-1/4">
                    <label className="text-gray-600 mb-2 block">Last Due Date</label>
                    <DatePicker
                        placeholder="Select date"
                        value={stateData[dueDatesField]?.last_date}
                        onChange={(date) => handleInputChange(`${dueDatesField}.last_date`, date)}
                    />
                </div>
            </div>
        </div>
    )

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

            <StateTable
                tableLoading={stateTableLoading}
                setStateTableLoading={setStateTableLoading}
                loading={loading}
                onEdit={handleEdit}
            />

            <Dialog
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
                width={500}
            >
                <h5 className="mb-6">
                    {isEditMode ? 'Edit Details' : 'Add Details'}
                </h5>
                <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col gap-4">
                        <div className="w-full">
                            <label className="text-gray-600 mb-2 block">State Name</label>
                            <OutlinedInput
                                value={stateData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)} label={'Enter State Name'}                            />
                        </div>
                        <div className="w-full">
                            <label className="text-gray-600 mb-2 block">District</label>
                            <OutlinedInput
                                value={stateData.district}
                                onChange={(e) => handleInputChange('district', e.target.value)} label={'Enter District Name'}                            />
                        </div>
                        {/* <div className="w-full">
                            <label className="text-gray-600 mb-2 block">Location</label>
                            <OutlinedInput
                                value={stateData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)} label={'Enter Location Name'}                            />
                        </div> */}
                    </div>

                    {/* {renderFrequencySection(
                        'LWF Details',
                        'lwf_frequency',
                        'lwf_payment_mode',
                        'lwf_due_dates'
                    )}

                    {renderFrequencySection(
                        'PTRC Details',
                        'ptrc_frequency',
                        'ptrc_payment_mode',
                        'ptrc_due_dates'
                    )}

                    {renderFrequencySection(
                        'PTEC Details',
                        'ptec_frequency',
                        'ptec_payment_mode',
                        'ptec_due_dates'
                    )} */}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="plain" onClick={handleDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={handleConfirm}>
                        {isEditMode ? 'Confirm' : 'Confirm'}
                    </Button>
                </div>
            </Dialog>
        </AdaptableCard>
    )
}

export default State