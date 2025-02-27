import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { format, parseISO, startOfDay } from 'date-fns';
import { Button, Checkbox, DatePicker, Dialog, Tooltip } from '@/components/ui';
import { MdEdit } from 'react-icons/md';
import { AppDispatch } from '@/store'
import { useDispatch } from 'react-redux';

import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react';
import { HiOutlineViewGrid } from 'react-icons/hi'
import { createPTConfig, fetchPTConfigs } from '@/store/slices/ptConfig/ptConfigSlice';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import OutlinedSelect from '@/components/ui/Outlined';
import { updateLWFConfig } from '@/store/slices/lwfConfig/lwfConfigSlice';
import { fetchDetail } from '@/store/slices/common/commonSlice';
import * as yup from 'yup';
import dayjs from 'dayjs';
import SimpleDatePicker from '@/components/ui/OutlinedInput/SimpleDatePicker';



const formatDateForSubmission = (date) => {
  if (!date) return null;
  return format(startOfDay(date), 'yyyy-MM-dd');
};

const parseAPIDate = (dateString) => {
  if (!dateString) return null;
  return parseISO(dateString);
};

const DatePickerComponent = ({ frequency, value, onChange, disabled, placeholder }) => {
  if (frequency === 'monthly') {
    return (
      <SimpleDatePicker
        className="w-full"
        placeholder={placeholder}
        value={value ? parseAPIDate(value) : null}
        onChange={(date) => onChange(formatDateForSubmission(date))}
        disabled={disabled}
      />
    );
  }
  
  return (
    <DatePicker
    // size='sm'
      inputFormat='DD-MM'
      className="w-full"
      placeholder={placeholder}
      value={value ? parseAPIDate(value) : null}
      onChange={(date) => onChange(formatDateForSubmission(date))}
      disabled={disabled}
    />
  );
};

// Function to get day with suffix for display
function formatDayWithSuffix(date, frequency) {
  if (!date) return '-';
  const dayjs_date = dayjs(date);
  const day = dayjs_date.date();
  const suffix = getDaySuffix(day);
  
  // For monthly/yearly, only show the day with suffix
  if (frequency === 'monthly') {
      return `${day}${suffix}`;
  }
  
  // For quarterly/half_yearly, show month and day
  return `${dayjs_date.format('MMM')} ${day}${suffix}`;
}

function getDaySuffix(day) {
    if (day % 10 === 1 && day !== 11) return 'st';
    if (day % 10 === 2 && day !== 12) return 'nd';
    if (day % 10 === 3 && day !== 13) return 'rd';
    return 'th';
}
// First, add these validation schemas
const createPTValidationSchema = (frequency, isActive) => {
  if (!isActive) {
    return yup.object().shape({}); // Return an empty schema
  }
    const baseSchema = {
        firstDate: yup
            .date()
            .required('First due date is required')
            .typeError('First due date must be a valid date'),
    }

    if (frequency === 'quarterly') {
        return yup.object().shape({
            ...baseSchema,
            secondDate: yup
                .date()
                .required('Second due date is required')
                .min(
                    yup.ref('firstDate'),
                    'Second due date must be after first due date',
                )
                .typeError('Second due date must be a valid date'),
            thirdDate: yup
                .date()
                .required('Third due date is required')
                .min(
                    yup.ref('secondDate'),
                    'Third due date must be after second due date',
                )
                .typeError('Third due date must be a valid date'),
            lastDate: yup
                .date()
                .required('Last due date is required')
                .min(
                    yup.ref('thirdDate'),
                    'Last due date must be after third due date',
                )
                .typeError('Last due date must be a valid date'),
        })
    }

    if (frequency === 'half_yearly') {
        return yup.object().shape({
            ...baseSchema,
            lastDate: yup
                .date()
                .required('Last due date is required')
                .min(
                    yup.ref('firstDate'),
                    'Last due date must be after first due date',
                )
                .typeError('Last due date must be a valid date'),
        })
    }

    return yup.object().shape(baseSchema)
}


const frequencyOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
];

const PTTable = ({ tableLoading, setTableLoading, onEdit, refreshTrigger,search }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [ptEcValidationErrors, setPtEcValidationErrors] = useState({
    firstDate: undefined,
    secondDate: undefined,
    thirdDate: undefined,
    lastDate: undefined
});

const [ptRcValidationErrors, setPtRcValidationErrors] = useState({
    firstDate: undefined,
    secondDate: undefined,
    thirdDate: undefined,
    lastDate: undefined
});
  const [ptTableData, setPTTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [ptEcFrequency, setPtEcFrequency] = useState('');
  const [ptRcFrequency, setPtRcFrequency] = useState('');
  const [ptEcDates, setPtEcDates] = useState({
    firstDate: null,
    secondDate: null,
    thirdDate: null,
    lastDate: null
  });
  const [ptRcDates, setPtRcDates] = useState({
    firstDate: null,
    secondDate: null,
    thirdDate: null,
    lastDate: null
  });

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    try {
      const response = await httpClient.get(endpoints.common.getStatesAll());
      if (response.data) {
        setStates(response.data.map(state => ({
          label: state.name,
          value: String(state.id)
        })));
      }
    } catch (error) {
      console.error('Failed to load states:', error);
    }
  };

  const handleEdit = async (config) => {
    try {
      const response = await dispatch(fetchDetail(config.id));
      const detailData = response.payload;
      
      const formatDate = (dateString) => dateString ? new Date(dateString) : null;
      
      setIsDialogOpen(true);
      setSelectedStateId(detailData.id);
      setSelectedState(states.find(state => state.value === String(detailData.id)));
      setPtEcFrequency(detailData.ptec_frequency);
      setPtRcFrequency(detailData.ptrc_frequency);
      setIsActive(detailData.ptrc_active && detailData.ptec_active);
      
      setPtEcDates({
        firstDate:  detailData.ptec_payment_due_date?.first_date,
        secondDate:  detailData.ptec_payment_due_date?.second_date,
        thirdDate:  detailData.ptec_payment_due_date?.third_date,
        lastDate:  detailData.ptec_payment_due_date?.last_date
      });
  
      setPtRcDates({
        firstDate:  detailData.ptrc_payment_due_date?.first_date,
        secondDate:  detailData.ptrc_payment_due_date?.second_date,
        thirdDate:  detailData.ptrc_payment_due_date?.third_date,
        lastDate:  detailData.ptrc_payment_due_date?.last_date
      });
    } catch (error) {
      showErrorNotification('Failed to fetch PT details');
    }
  };

  const isDueDateDisabled = (frequency: string, dateIndex: number) => {
    switch (frequency) {
      case 'monthly':
      case 'yearly':
        return dateIndex > 0;
      case 'half_yearly':
        return dateIndex > 0 && dateIndex < 3;
      case 'quarterly':
        return false;
      default:
        return true;
    }
  };

  const validatePTECDates = async () => {
    if (!isActive) {
      setPtEcValidationErrors({});
      return true;
    }
    try {
        const validationSchema = createPTValidationSchema(ptEcFrequency, isActive);
        await validationSchema.validate(ptEcDates, { abortEarly: false });
        setPtEcValidationErrors({});
        return true;
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setPtEcValidationErrors(newErrors);
            return false;
        }
        return false;
    }
};

const validatePTRCDates = async () => {
  if (!isActive) {
    setPtRcValidationErrors({});
    return true;
  }
    try {
        const validationSchema = createPTValidationSchema(ptRcFrequency,isActive);
        await validationSchema.validate(ptRcDates, { abortEarly: false });
        setPtRcValidationErrors({});
        return true;
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setPtRcValidationErrors(newErrors);
            return false;
        }
        return false;
    }
};

useEffect(() => {
  validatePTECDates();
}, [ptEcDates, ptEcFrequency, isActive]);

useEffect(() => {
  validatePTRCDates();
}, [ptRcDates, ptRcFrequency, isActive]);

// Generic function to handle date changes
const handleDateChangeForFrequency = (dateType, date, frequency, setDates) => {
  setDates(prev => {
      const newDates = { ...prev };
      newDates[dateType] = date;

      // Reset disabled dates to null based on frequency
      if (frequency === 'monthly' || frequency === 'yearly') {
          newDates.secondDate = null;
          newDates.thirdDate = null;
          newDates.lastDate = null;
      } else if (frequency === 'half_yearly') {
          newDates.secondDate = null;
          newDates.thirdDate = null;
      }

      return newDates;
  });
};

// For ptEcFrequency
const handleDateChangePtEc = (dateType, date) => {
  handleDateChangeForFrequency(dateType, date, ptEcFrequency, setPtEcDates);
};

// For ptRcFrequency
const handleDateChangePtRc = (dateType, date) => {
  handleDateChangeForFrequency(dateType, date, ptRcFrequency, setPtRcDates);
};

// Update useEffect to reset dates when frequency changes
useEffect(() => {
  if (ptEcFrequency === 'monthly' || ptEcFrequency === 'yearly') {
      setPtEcDates(prev => ({
          ...prev,
          secondDate: null,
          thirdDate: null,
          lastDate: null,
      }));
  } else if (ptEcFrequency === 'half_yearly') {
      setPtEcDates(prev => ({
          ...prev,
          secondDate: null,
          thirdDate: null,
      }));
  }
}, [ptEcFrequency]);

useEffect(() => {
  if (ptRcFrequency === 'monthly' || ptRcFrequency === 'yearly') {
      setPtRcDates(prev => ({
          ...prev,
          secondDate: null,
          thirdDate: null,
          lastDate: null,
      }));
  } else if (ptRcFrequency === 'half_yearly') {
      setPtRcDates(prev => ({
          ...prev,
          secondDate: null,
          thirdDate: null,
      }));
  }
}, [ptRcFrequency]);



  const handleConfirm = async () => {
    if (!selectedState || isActive === null) {
      showErrorNotification('Please fill all required fields');
      return;
  }



  if(isActive){
    const isEcValid = await validatePTECDates();
    const isRcValid = await validatePTRCDates();
  if (!isEcValid || !isRcValid) {
      return;
  }
}

    const ptConfigData = {
      ptec_frequency: isActive ? ptEcFrequency : null,
      ptrc_frequency: isActive ? ptRcFrequency : null,
      ptec_payment_due_date: isActive ? {
        first_date: ptEcDates.firstDate,
        second_date: ptEcDates.secondDate,
        third_date: ptEcDates.thirdDate,
        last_date: ptEcDates.lastDate
      } : {
        first_date: null,
      second_date: null,
      third_date: null,
      last_date: null,
      },
      ptrc_payment_due_date: isActive ? {
        first_date: ptRcDates.firstDate,
        second_date: ptRcDates.secondDate,
        third_date: ptRcDates.thirdDate,
        last_date: ptRcDates.lastDate
      } : {
        first_date: null,
      second_date: null,
      third_date: null,
      last_date: null,
      },
      ptec_payment_mode: 'online',
      ptrc_payment_mode: 'online',
      active: isActive,
      state_id: selectedState.value
    };

    try {
      await dispatch(createPTConfig(ptConfigData));
      setIsDialogOpen(false);
      fetchPTSetupData(tableData.pageIndex, tableData.pageSize);
    } catch (error) {
      showErrorNotification(error.message);
    }
  };


  const formatDate = (date) => {
    if (!date) return '-';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const getFrequencyLabel = (value: string | null) => {
    if (!value) return '-';
    const labels: { [key: string]: string } = {
      'yearly': 'Yearly',
      'half_yearly': 'Half Yearly',
      'monthly': 'Monthly',
      'quarterly': 'Quarterly'
    };
    return labels[value] || value;
  };

  const columns = useMemo(
    () => [
      {
        header: 'State',
        accessorKey: 'name',
        enableSorting:false,
        cell: ({row}) => 
          <div className="w-72 text-start">
        {row.original.name}
      </div>
      },
      {
        header: 'PT RC Frequency',
        accessorKey: 'ptrc_frequency',
        enableSorting:false,
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {getFrequencyLabel(row.original.ptrc_frequency)}
  </div>
      },
      {
        header: 'PTRC First Due Date',
        accessorKey: 'first_date',
        enableSorting:false,
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {formatDayWithSuffix(row.original.ptrc_payment_due_date.first_date,row.original.ptrc_frequency)}
  </div>
      },
      {
        header: 'PTRC Second Due Date',
        accessorKey: 'second_date',
        enableSorting:false,
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {formatDayWithSuffix(row.original.ptrc_payment_due_date.second_date, row.original.ptrc_frequency)}
  </div>
      },
      {
        header: 'PTRC Third Due Date',
        accessorKey: 'third_date',
        enableSorting:false,
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {formatDayWithSuffix(row.original.ptrc_payment_due_date.third_date, row.original.ptrc_frequency)}
  </div>
      },
      {
        header: 'PTRC Last Due Date',
        accessorKey: 'last_date',
        enableSorting:false,
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {formatDayWithSuffix(row.original.ptrc_payment_due_date.last_date, row.original.ptrc_frequency)}
  </div>
      },
      {
        header: 'PT EC Frequency',
        accessorKey: 'ptec_frequency',
        enableSorting:false,
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {getFrequencyLabel(row.original.ptec_frequency)}
  </div>      },
      {
        header: 'PTEC First Due Date',
        accessorKey: 'first_date',
        enableSorting:false,
        cell: ({ row }) => 
          <div className="w-44 text-start">
            {formatDayWithSuffix(row.original.ptec_payment_due_date.first_date, row.original.ptec_frequency)}
      </div>
      },
      {
        header: 'PTEC Second Due Date',
        accessorKey: 'second_date',
        enableSorting:false,
        cell: ({ row }) => 
          <div className="w-44 text-start">
            {formatDayWithSuffix(row.original.ptec_payment_due_date.second_date, row.original.ptec_frequency)}
      </div>
      },
      {
        header: 'PTEC Third Due Date',
        accessorKey: 'third_date',
        enableSorting:false,
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {formatDayWithSuffix(row.original.ptec_payment_due_date?.third_date, row.original.ptec_frequency)}
      </div>
      },
      {
        header: 'PTEC Fourth Due Date',
        accessorKey: 'last_date',
        enableSorting:false,
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {formatDayWithSuffix(row.original.ptec_payment_due_date?.last_date, row.original.ptec_frequency)}
      </div>
      },
      {
        header: 'Status',
        accessorKey: 'status',
        enableSorting:false,
        cell: ({ row }) => {
          const isActive = row.original.ptrc_active && row.original.ptec_active;
          return (
            <div className="w-24 text-start">
              <div 
                className={isActive ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}
              >
                {isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          );
        },
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({row}) => (
          <div className="flex space-x-2">
            <Tooltip title="Edit" placement="top">
              <Button
                size="sm"
                icon={<MdEdit />}
                onClick={() => handleEdit(row.original)}
              />
            </Tooltip>
          </div>
        )
      }
      // {
      //   header: 'Actions',
      //   id: 'actions',
      //   cell: ({ row }) => (
      //     <div className="flex space-x-2">
      //       <Tooltip title="Edit" placement="top">
      //         <Button
      //           size="sm"
      //           icon={<MdEdit />}
      //           onClick={() => onEdit(row.original)}
      //         />
      //       </Tooltip>
      //     </div>
      //   ),
      // },
    ],
    [onEdit]
  );

  const [tableData, setTableData] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 50,
    query: '',
    sort: { order: '', key: '' },
  });

  useEffect(() => {
    fetchPTSetupData(tableData.pageIndex, tableData.pageSize);
  }, [refreshTrigger,search]);

  const fetchPTSetupData = async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const response = await dispatch(fetchPTConfigs({page, page_size: size,search}));
      
      // Log the entire response to see its structure
      console.log('Full API Response:', response);

      // Adjust this based on the actual response structure
      if (response?.payload?.data) {
        console.log('Data:', response.payload.data);
        console.log('Paginate Data:', response.payload.paginateData);
        const sortedData = [...response.payload.data].sort((a, b) => 
          a.name.localeCompare(b.name)
        );
  
        setPTTableData(sortedData);
        // setPTTableData(response.payload.data);
        setTableData((prev) => ({
          ...prev,
          total: response.payload.paginateData?.totalResults || 0,
          totalPages: response.payload.paginateData?.totalPages || 0,
          pageIndex: page, 
          pageSize: size
        }));
      } else {
        console.error('No data found in the response');
        setPTTableData([]);
      }
    } catch (error) {
      console.error('Failed to fetch ESI configurations', error);
      setPTTableData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onPaginationChange = (page: number) => {
    setTableData(prev => ({ ...prev, pageIndex: page }));
    fetchPTSetupData(page, tableData.pageSize);
  };

  const onSelectChange = (value: number) => {
    setTableData((prev) => ({
      ...prev,
      pageSize: Number(value),
      pageIndex: 1,
    }));
    fetchPTSetupData(1, value);
  };

  if (isLoading) {
    console.log("Loading....................");
    
    return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500  rounded-xl">
            <div className="w-28 h-28">
                <Lottie 
                    animationData={loadingAnimation} 
                    loop 
                    className="w-24 h-24"
                />
            </div>
            <p className="text-lg font-semibold">
                Loading Data...
            </p>

        </div>
    );
}

  return (
    <div className="relative">
        {ptTableData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-center">
        No Data Available
                </p>
      </div>
            ) : (
      <DataTable
        columns={columns}
        data={ptTableData}
        loading={isLoading}
        stickyHeader={true}
        stickyFirstColumn={true}
        stickyLastColumn={true}
        pagingData={{
          total: tableData.total,
          pageIndex: tableData.pageIndex,
          pageSize: tableData.pageSize,
        }}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
        selectable={true}
      />
    )}
    <Dialog
      isOpen={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      width={1200}
    >
      <h5 className="mb-6">Edit PT Setup</h5>
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <div className="w-full">
            <label className="text-gray-600 mb-2 block">State</label>
            <OutlinedSelect
             disabled={true}
              label="State"
              options={states}
              value={selectedState}
              onChange={setSelectedState}
            />
          </div>
          <div className="w-full">
                <label className="text-gray-600 mb-2 block">Is PT Applicable For Selected State <span className="text-red-500">*</span></label>
                <OutlinedSelect
                  label="Select Applicability"
                  options={[
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' }
                  ]}
                  value={isActive ? { value: true, label: 'Yes' } : { value: false, label: 'No' }}
                  onChange={(selected) => setIsActive(selected?.value)}
                />
              </div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="text-gray-600 mb-2 block">PT EC Frequency</label>
            <OutlinedSelect
              label="Select PT EC Frequency"
              options={frequencyOptions}
              value={frequencyOptions.find(option => option.value === ptEcFrequency)}
              onChange={(selected) => setPtEcFrequency(selected?.value)}
              disabled={!isActive}
            />
          </div>
          <div className="w-1/2">
            <label className="text-gray-600 mb-2 block">PT RC Frequency</label>
            <OutlinedSelect
              label="Select PT RC Frequency"
              options={frequencyOptions}
              value={frequencyOptions.find(option => option.value === ptRcFrequency)}
              onChange={(selected) => setPtRcFrequency(selected?.value)}
              disabled={!isActive}
            />
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <div className="mb-4 w-full">
            <h4 className="text-lg font-semibold mb-4">PT EC Due Dates</h4>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">First Due Date <span className="text-red-500">*</span></label>
                <DatePickerComponent
                frequency={ptEcFrequency}
                value={ptEcDates.firstDate}
                  onChange={(date) => handleDateChangePtEc('firstDate', date)}     
                placeholder="Select First Due Date"
                disabled={!isActive}
              />
                {/* <DatePicker
                  className="w-full"
                  placeholder="Select first due date"
                  value={ptEcDates.firstDate}
                  onChange={(date) => handleDateChangePtEc('firstDate', date)}         */}
                {/* /> */}
                {ptEcValidationErrors.firstDate && (
    <div className="text-red-500 text-sm mt-1 h-4">
        {ptEcValidationErrors.firstDate}
    </div>
)}
              </div>
              <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">
          Second Due Date {ptEcFrequency === 'quarterly' && <span className="text-red-500">*</span>}
        </label>
              <DatePickerComponent
              frequency={ptEcFrequency}
                  placeholder="Select Second Due Date"
                  value={ptEcDates.secondDate}
                  onChange={(date) => handleDateChangePtEc('secondDate', date)}

                  disabled={ !isActive || isDueDateDisabled(ptEcFrequency, 1)}           
                />
                {ptEcValidationErrors.secondDate && (
    <div className="text-red-500 text-sm mt-1">
        {ptEcValidationErrors.secondDate}
    </div>
)}
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">
          Third Due Date {ptEcFrequency === 'quarterly' && <span className="text-red-500">*</span>}
        </label>
        <DatePickerComponent
              frequency={ptEcFrequency}
                  placeholder="Select Third Due Date"
                  value={ptEcDates.thirdDate}
                  onChange={(date) => handleDateChangePtEc('thirdDate', date)}
                  disabled={!isActive || isDueDateDisabled(ptEcFrequency, 2)}        
                />
                {ptEcValidationErrors.thirdDate && (
    <div className="text-red-500 text-sm mt-1">
        {ptEcValidationErrors.thirdDate}
    </div>
)}
              </div>
              <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">
          Fourth Due Date {(ptEcFrequency === 'quarterly' || ptEcFrequency === 'half_yearly') && 
            <span className="text-red-500">*</span>}
        </label>
        <DatePickerComponent
              frequency={ptEcFrequency}
                  placeholder="Select Last Due Date"
                  value={ptEcDates.lastDate}
                  onChange={(date) => handleDateChangePtEc('lastDate', date)}
                  disabled={!isActive || isDueDateDisabled(ptEcFrequency, 3)}    
                />
                {ptEcValidationErrors.lastDate && (
    <div className="text-red-500 text-sm mt-1">
        {ptEcValidationErrors.lastDate}
    </div>
)}
              </div>
            </div>
          </div>

          <div className="mb-4 w-full">
            <h4 className="text-lg font-semibold mb-4">PT RC Due Dates</h4>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">First Due Date <span className="text-red-500">*</span></label>
                <DatePickerComponent
                frequency={ptRcFrequency}
                value={ptRcDates.firstDate}
                onChange={(date) => handleDateChangePtRc('firstDate', date)}  
                placeholder="Select First Due Date"
                disabled={!isActive}
              />
                {/* <DatePicker
                  className="w-full"
                  placeholder="Select first due date"
                  value={ptRcDates.firstDate}
                  onChange={(date) => handleDateChangePtRc('firstDate', date)}    
                /> */}
                 {ptRcValidationErrors.firstDate && (
    <div className="text-red-500 text-sm mt-1 h-4">
        {ptRcValidationErrors.firstDate}
    </div>
)}
              </div>
              <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">
          Second Due Date {ptRcFrequency === 'quarterly' && <span className="text-red-500">*</span>}
        </label>
        <DatePickerComponent
                 placeholder="Select Second Due Date"
                frequency={ptRcFrequency}
                  value={ptRcDates.secondDate}
                  onChange={(date) => handleDateChangePtRc('secondDate', date)}
                  disabled={!isActive || isDueDateDisabled(ptRcFrequency, 1)}    
                />
                 {ptRcValidationErrors.secondDate && (
    <div className="text-red-500 text-sm mt-1">
        {ptRcValidationErrors.secondDate}
    </div>
)}
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">
          Third Due Date {ptRcFrequency === 'quarterly' && <span className="text-red-500">*</span>}
        </label>
        <DatePickerComponent
               placeholder="Select Third Due Date"    
                frequency={ptRcFrequency}
                  value={ptRcDates.thirdDate}
                  onChange={(date) => handleDateChangePtRc('thirdDate', date)}
                  disabled={!isActive || isDueDateDisabled(ptRcFrequency, 2)}     
                />
                 {ptRcValidationErrors.thirdDate && (
    <div className="text-red-500 text-sm mt-1">
        {ptRcValidationErrors.thirdDate}
    </div>
)}
              </div>
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">
          Fourth Due Date {(ptRcFrequency === 'quarterly' || ptRcFrequency === 'half_yearly') && 
            <span className="text-red-500">*</span>}
        </label>
        <DatePickerComponent
                  placeholder="Select Last Due Date"
                frequency={ptRcFrequency}
                  value={ptRcDates.lastDate}
                  onChange={(date) => handleDateChangePtRc('lastDate', date)}
                  disabled={!isActive || isDueDateDisabled(ptRcFrequency, 3)}       
                />
                 {ptRcValidationErrors.lastDate && (
    <div className="text-red-500 text-sm mt-1">
        {ptRcValidationErrors.lastDate}
    </div>
)}
              </div>
            </div>
          </div>
        </div>

        {/* <div className="flex items-center gap-2">
          <Checkbox
            checked={isActive}
            onChange={(checked) => setIsActive(checked)}
          />
          <label className="text-gray-600">
            Is PT applicable for Selected State
          </label>
        </div> */}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          variant="plain"
          onClick={() => setIsDialogOpen(false)}
        >
          Cancel
        </Button>
        <Button 
          variant="solid" 
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </div>
    </Dialog>
    </div>
  );
};

export default PTTable;