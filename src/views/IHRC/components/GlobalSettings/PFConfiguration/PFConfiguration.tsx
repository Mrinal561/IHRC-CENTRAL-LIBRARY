// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { AdaptableCard } from '@/components/shared';
// import { Button, Dialog, Notification, toast } from '@/components/ui';
// import { HiPlusCircle } from 'react-icons/hi';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// import { DatePicker } from '@/components/ui/DatePicker';
// import PFTable from './components/PFTable';
// import BulkUpload from './components/BulkUpload';
// import { 
//   fetchPFConfigs, 
//   createPFConfig, 
//   updatePFConfig, 
// } from '@/store/slices/pfConfig/pfConfigSlice';
// import { AppDispatch, RootState } from '@/store';
// import { PFConfigData } from '@/@types/pfConfig';


// const PFConfiguration = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { pfConfigs, loading, error } = useSelector((state: RootState) => state.pfconfig);
//   const [pfTableData, setPfTableData] = useState([]);

//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [newPF, setNewPF] = useState<PFConfigData>({
//     pf_frequency: '',
//     pt_payment_due_date: {
//       first_date: '',
//       last_date: '',
//     },
//   });

//   useEffect(() => {
//     fetchPfData();
//   },[] );
//   const fetchPfData = async () => {
//     const { payload: data } = await dispatch(fetchPFConfigs());
//     setPfTableData(data.data);
// };

// const openNotification = (type: 'success' | 'info' | 'danger' | 'warning', message: string) => {
//   toast.push(
//     <Notification title={type.charAt(0).toUpperCase() + type.slice(1)} type={type}>
//       {message}
//     </Notification>
//   );
// };

//   const handlePFState = () => {
//     setIsEditing(false);
//     setEditingId(null);
//     setIsDialogOpen(true);
//     setNewPF({
//       pf_frequency: '',
//       pt_payment_due_date: {
//         first_date: '',
//         last_date: '',
//       },
//     });
//   };

//   const handleEdit = (pfConfig) => {
//     setIsEditing(true);
//     setEditingId(pfConfig.id);
//     setNewPF({
//       pf_frequency: pfConfig.pf_frequency,
//       pt_payment_due_date: {
//         first_date: pfConfig.pt_payment_due_date.first_date,
//         last_date: pfConfig.pt_payment_due_date.last_date,
//       },
//     });
//     setIsDialogOpen(true);
//   };

//   const handleDialogClose = () => {
//     setIsDialogOpen(false);
//     setIsEditing(false);
//     setEditingId(null);
//     setNewPF({
//       pf_frequency: '',
//       pt_payment_due_date: {
//         first_date: '',
//         last_date: '',
//       },
//     });
//   };

//   const handleConfirm = async () => {
//     try {
//       if (isEditing && editingId) {
//         await dispatch(updatePFConfig({ id: editingId, data: newPF })).unwrap();
//         toast.push(
//           <Notification title="Success" type="success">
//             PF Configuration updated successfully!
//           </Notification>
//         );
//       } else {
//         await dispatch(createPFConfig(newPF)).unwrap();
//         toast.push(
//           <Notification title="Success" type="success">
//             PF Configuration added successfully!
//           </Notification>
//         );
//       }
//     } catch (error) {
//       toast.push(
//         <Notification title="Error" type="danger">
//           Failed to {isEditing ? 'update' : 'add'} PF Configuration
//         </Notification>
//       );
//     }
//     handleDialogClose();
//     fetchPfData();
//   };

//   const handleInputChange = (name: string, value: any) => {
//     if (name === 'frequency') {
//       setNewPF((prev) => ({
//         ...prev,
//         pf_frequency: value.toLowerCase(),
//         pt_payment_due_date: {
//           ...prev.pt_payment_due_date,
//           last_date: value.toLowerCase() !== 'half_yearly' ? null : prev.pt_payment_due_date.last_date,
//         },
//       }));
//     } else if (name === 'firstDueDate') {
//       setNewPF((prev) => ({
//         ...prev,
//         pt_payment_due_date: {
//           ...prev.pt_payment_due_date,
//           first_date: value.toISOString().split('T')[0],
//         },
//       }));
//     } else if (name === 'secondDueDate') {
//       setNewPF((prev) => ({
//         ...prev,
//         pt_payment_due_date: {
//           ...prev.pt_payment_due_date,
//           last_date: value ? value.toISOString().split('T')[0] : null,
//         },
//       }));
//     }
//   };
  

//   const isSecondDateDisabled = newPF.pf_frequency !== 'half_yearly';

//   const frequencyOptions = [
//     { value: 'monthly', label: 'Monthly' },
//     { value: 'half_yearly', label: 'Half Yearly' },
//     { value: 'yearly', label: 'Yearly' },
//   ];

//   return (
//     <AdaptableCard className="h-full" bodyClass="h-full">
//       <div className="lg:flex items-center justify-between mb-4">
//         <h3 className="mb-4 lg:mb-0">PF Configuration</h3>
//         <div className="flex gap-4">
//           <BulkUpload />
//           <Button size="sm" variant="solid" onClick={handlePFState} icon={<HiPlusCircle />}>
//             Add PF
//           </Button>
//         </div>
//       </div>

//       <PFTable 
//         pfConfigurationData={pfTableData} 
//         onEdit={handleEdit}
//         loading={loading}
//       />

//       <Dialog isOpen={isDialogOpen} onClose={handleDialogClose}>
//         <h5 className="mb-4">{isEditing ? 'Edit' : 'Add'} PF Configuration</h5>
//         <div className="flex flex-col gap-4">
//           <div className="flex flex-col gap-2">
//             <label>PF Frequency</label>
//             <OutlinedSelect
//               label="Select Frequency"
//               options={frequencyOptions}
//               value={frequencyOptions.find(
//                 option => option.value.toLowerCase() === newPF.pf_frequency
//               )}
//               onChange={(selectedOption) => handleInputChange('frequency', selectedOption.value)}
//             />
//           </div>
//           <div className="flex flex-col gap-2">
//             <label>First Default Due Date</label>
//             <DatePicker
//               value={newPF.pt_payment_due_date.first_date ? new Date(newPF.pt_payment_due_date.first_date) : null}
//               onChange={(date) => handleInputChange('firstDueDate', date)}
//               placeholder="Select first due date"
//             />
//           </div>
//           <div className="flex flex-col gap-2">
//             <label>Second Default Due Date</label>
//             <DatePicker
//               value={newPF.pt_payment_due_date.last_date ? new Date(newPF.pt_payment_due_date.last_date) : null}
//               onChange={(date) => handleInputChange('secondDueDate', date)}
//               disabled={isSecondDateDisabled}
//               placeholder="Select second due date"
//             />
//           </div>
//         </div>
//         <div className="text-right mt-6">
//           <Button variant="plain" onClick={handleDialogClose}>
//             Cancel
//           </Button>
//           <Button variant="solid" onClick={handleConfirm}>
//             {isEditing ? 'Update' : 'Confirm'}
//           </Button>
//         </div>
//       </Dialog>
//     </AdaptableCard>
//   );
// };

// export default PFConfiguration;


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdaptableCard } from '@/components/shared';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { DatePicker } from '@/components/ui/DatePicker';
import PFTable from './components/PFTable';
import BulkUpload from './components/BulkUpload';
import { 
  fetchPFConfigs, 
  createPFConfig, 
  updatePFConfig, 
} from '@/store/slices/pfConfig/pfConfigSlice';
import { AppDispatch, RootState } from '@/store';
import { PFConfigData } from '@/@types/pfConfig';


const PFConfiguration = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pfConfigs, loading, error } = useSelector((state: RootState) => state.pfconfig);
  const [pfTableData, setPfTableData] = useState([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPF, setNewPF] = useState<PFConfigData>({
    pf_frequency: 'monthly',
    pt_payment_due_date: {
      first_date: '',
      last_date: '',
    },
  });

  useEffect(() => {
    fetchPfData();
  }, []);

  const fetchPfData = async () => {
    const { payload: data } = await dispatch(fetchPFConfigs());
    setPfTableData(data.data);
  };

  const openNotification = (type: 'success' | 'info' | 'danger' | 'warning', message: string) => {
    toast.push(
      <Notification title={type.charAt(0).toUpperCase() + type.slice(1)} type={type}>
        {message}
      </Notification>
    );
  };

  const handlePFState = () => {
    setIsEditing(false);
    setEditingId(null);
    setIsDialogOpen(true);
    setNewPF({
      pf_frequency: '',
      pt_payment_due_date: {
        first_date: '',
        last_date: '',
      },
    });
  };

  const handleEdit = (pfConfig) => {
    setIsEditing(true);
    setEditingId(pfConfig.id);
    setNewPF({
      pf_frequency: pfConfig.pf_frequency,
      pt_payment_due_date: {
        first_date: pfConfig.pt_payment_due_date.first_date,
        last_date: pfConfig.pt_payment_due_date.last_date,
      },
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setNewPF({
      pf_frequency: '',
      pt_payment_due_date: {
        first_date: '',
        last_date: '',
      },
    });
  };

  const handleConfirm = async () => {
    try {
      if (isEditing && editingId) {
        await dispatch(updatePFConfig({ id: editingId, data: newPF })).unwrap();
        toast.push(
          <Notification title="Success" type="success">
            PF Configuration updated successfully!
          </Notification>
        );
      } else {
        await dispatch(createPFConfig(newPF)).unwrap();
        toast.push(
          <Notification title="Success" type="success">
            PF Configuration added successfully!
          </Notification>
        );
      }
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Failed to {isEditing ? 'update' : 'add'} PF Configuration
        </Notification>
      );
    }
    handleDialogClose();
    fetchPfData();
  };

  const handleInputChange = (name: string, value: any) => {
    if (name === 'frequency') {
      const validFrequencies = ['monthly', 'half_yearly', 'yearly'];
      if (!validFrequencies.includes(value.toLowerCase())) {
        console.error('Invalid PF frequency value:', value);
        return;
      }
      setNewPF((prev) => ({
        ...prev,
        pf_frequency: value.toLowerCase() as 'monthly' | 'half_yearly' | 'yearly',
        pt_payment_due_date: {
          ...prev.pt_payment_due_date,
          last_date: value.toLowerCase() !== 'half_yearly' ? null : prev.pt_payment_due_date.last_date,
        },
      }));
    } else if (name === 'firstDueDate') {
      setNewPF((prev) => ({
        ...prev,
        pt_payment_due_date: {
          ...prev.pt_payment_due_date,
          first_date: value.toISOString().split('T')[0],
        },
      }));
    } else if (name === 'secondDueDate') {
      setNewPF((prev) => ({
        ...prev,
        pt_payment_due_date: {
          ...prev.pt_payment_due_date,
          last_date: value ? value.toISOString().split('T')[0] : null,
        },
      }));
    }
  };

  const isSecondDateDisabled = newPF.pf_frequency !== 'half_yearly';

  const frequencyOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'half_yearly', label: 'Half Yearly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="lg:flex items-center justify-between mb-4">
        <h3 className="mb-4 lg:mb-0">PF Configuration</h3>
        <div className="flex gap-4">
          <BulkUpload />
          <Button size="sm" variant="solid" onClick={handlePFState} icon={<HiPlusCircle />}>
            Add PF
          </Button>
        </div>
      </div>

      <PFTable 
        pfConfigurationData={pfTableData} 
        onEdit={handleEdit}
        loading={loading}
      />

      <Dialog isOpen={isDialogOpen} onClose={handleDialogClose}>
        <h5 className="mb-4">{isEditing ? 'Edit' : 'Add'} PF Configuration</h5>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label>PF Frequency</label>
            <OutlinedSelect
              label="Select Frequency"
              options={frequencyOptions}
              value={frequencyOptions.find(
                option => option.value.toLowerCase() === newPF.pf_frequency
              )}
              onChange={(selectedOption) => handleInputChange('frequency', selectedOption.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>First Default Due Date</label>
            <DatePicker
              value={newPF.pt_payment_due_date.first_date ? new Date(newPF.pt_payment_due_date.first_date) : null}
              onChange={(date) => handleInputChange('firstDueDate', date)}
              placeholder="Select first due date"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Second Default Due Date</label>
            <DatePicker
              value={newPF.pt_payment_due_date.last_date ? new Date(newPF.pt_payment_due_date.last_date) : null}
              onChange={(date) => handleInputChange('secondDueDate', date)}
              disabled={isSecondDateDisabled}
              placeholder="Select second due date"
            />
          </div>
        </div>
        <div className="text-right mt-6">
          <Button variant="plain" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button variant="solid" onClick={handleConfirm}>
            {isEditing ? 'Update' : 'Confirm'}
          </Button>
        </div>
      </Dialog>
    </AdaptableCard>
  );
};

export default PFConfiguration;