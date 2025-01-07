import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '@/components/shared/DataTable';
import { format } from 'date-fns';
import { Button, Tooltip, Badge, Dialog, Checkbox, DatePicker } from '@/components/ui';
import { MdEdit } from 'react-icons/md';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { AppDispatch, RootState } from '@/store';
import { fetchLWFConfigs, updateLWFConfig } from '@/store/slices/lwfConfig/lwfConfigSlice';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import Lottie from 'lottie-react';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import OutlinedSelect from '@/components/ui/Outlined';
import { fetchDetail } from '@/store/slices/common/commonSlice';


const frequencyOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
];

const LWFTable = ({ tableLoading, setTableLoading, onEdit, refreshTrigger }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);
  const [lwfTableData, setLWFTableData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [frequency, setFrequency] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [paymentDueDates, setPaymentDueDates] = useState({
    firstDate: null,
    secondDate: null,
    thirdDate: null,
    lastDate: null
  });
  const [tableData, setTableData] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: { order: '', key: '' },
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
      setFrequency(detailData.lwf_frequency);
      setIsActive(detailData.lwf_active);
      setPaymentDueDates({
        firstDate: formatDate(detailData.lwf_payment_due_date.first_date),
        secondDate: formatDate(detailData.lwf_payment_due_date.second_date),
        thirdDate: formatDate(detailData.lwf_payment_due_date.third_date),
        lastDate: formatDate(detailData.lwf_payment_due_date.last_date)
      });
    } catch (error) {
      showErrorNotification('Failed to fetch state details');
    }
  };

  const isDueDateDisabled = (dateIndex) => {
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

  const handleConfirm = async () => {
    if (!selectedState || !frequency || !paymentDueDates.firstDate) {
      showErrorNotification('Please fill all required fields');
      return;
    }

    const lwfConfigData = {
      frequency,
      payment_due_date: {
        first_date: paymentDueDates.firstDate,
        second_date: paymentDueDates.secondDate,
        third_date: paymentDueDates.thirdDate,
        last_date: paymentDueDates.lastDate
      },
      payment_mode: 'online',
      active: isActive,
      state_id: selectedState.value
    };

    try {
      await dispatch(updateLWFConfig({ id: selectedState.value, data: lwfConfigData }));
      setIsDialogOpen(false);
      fetchLWFSetupData(tableData.pageIndex, tableData.pageSize);
    } catch (error) {
      showErrorNotification(error.message);
    }
  };
  
  useEffect(() => {
    fetchLWFSetupData(tableData.pageIndex, tableData.pageSize);
  }, [refreshTrigger]);

  const fetchLWFSetupData = async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const response = await dispatch(fetchLWFConfigs({page, page_size: size}));
      
      // Log the entire response to see its structure
      console.log('Full API Response:', response);

      // Adjust this based on the actual response structure
      if (response?.payload?.data) {
        console.log('Data:', response.payload.data);
        console.log('Paginate Data:', response.payload.paginateData);

        setLWFTableData(response.payload.data);
        setTableData((prev) => ({
          ...prev,
          total: response.payload.paginateData?.totalResults || 0,
          totalPages: response.payload.paginateData?.totalPages || 0,
          pageIndex: page, 
          pageSize: size
        }));
      } else {
        console.error('No data found in the response');
        setLWFTableData([]);
      }
    } catch (error) {
      console.error('Failed to fetch ESI configurations', error);
      setLWFTableData([]);
    } finally {
      setIsLoading(false);
    }
  };



  const formatDate = (date: string | null) => {
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
        header: 'State Name',
        accessorKey: 'name',
        cell: ({row}) => 
          <div className="w-72 text-start">
        {row.original.name}
      </div>
      },
      {
        header: 'LWF Frequency',
        accessorKey: 'lwf_frequency',
        cell: ({ row }) => 
          <div className="w-40 text-start">
            {getFrequencyLabel(row.original.lwf_frequency)}
          </div>
      },
      {
        header: 'First Due Date',
        accessorKey: 'first_date',
        cell: ({ row }) => 
          <div className="w-40 text-start">
        {formatDate(row.original.lwf_payment_due_date?.first_date)}
      </div>
      },
      {
        header: 'Second Due Date',
        accessorKey: 'second_date',
        cell: ({ row }) => 
          <div className="w-40 text-start">
        {formatDate(row.original.lwf_payment_due_date?.second_date)}
      </div>
      },
      {
        header: 'Third Due Date',
        accessorKey: 'third_date',
        cell: ({ row }) => 
          <div className="w-40 text-start">
        {formatDate(row.original.lwf_payment_due_date?.third_date)}
      </div>
      },
      {
        header: 'Last Due Date',
        accessorKey: 'last_date',
        cell: ({ row }) => 
          <div className="w-40 text-start">
        {formatDate(row.original.lwf_payment_due_date?.last_date)}
      </div>
      },
      {
        header: 'Status',
        accessorKey: 'lwf_active',
        cell: ({ row }) => (
          <div className="w-24 text-start">
          {/* <div 
            className={row.original.esi_active ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}
            >
            {row.original.esi_active ? 'Active' : 'Inactive'}
          </div> */}
           <div 
            className={row.original.lwf_active ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}
            >
            {row.original.lwf_active ? 'Active' : 'Inactive'}
          </div>
            </div>
        ),
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
    ],
    [states]
  );


  const onPaginationChange = (page: number) => {
    setTableData(prev => ({ ...prev, pageIndex: page }));
    fetchLWFSetupData(page, tableData.pageSize);
  };

  const onSelectChange = (value: number) => {
    setTableData((prev) => ({
      ...prev,
      pageSize: Number(value),
      pageIndex: 1,
    }));
    fetchLWFSetupData(1, value);
  };

  if (isLoading) {
    
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
        {lwfTableData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-center">
        No Data Available
                </p>
      </div>
            ) : (
      <DataTable
        columns={columns}
        data={lwfTableData}
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
      >
        <h5 className="mb-6">Edit LWF Setup</h5>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">State</label>
              <OutlinedSelect
                label="Select State"
                options={states}
                value={selectedState}
                onChange={setSelectedState}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">LWF Frequency</label>
              <OutlinedSelect
                label="Select LWF Frequency"
                options={frequencyOptions}
                value={frequencyOptions.find(option => option.value === frequency)}
                onChange={(selected) => setFrequency(selected?.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">First Due Date <span className="text-red-500">*</span></label>
              <DatePicker
                className="w-full"
                placeholder="Select first due date"
                value={paymentDueDates.firstDate}
                onChange={(date) => setPaymentDueDates(prev => ({ ...prev, firstDate: date }))}
              />
            </div>
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">Second Due Date</label>
              <DatePicker
                className="w-full"
                placeholder="Select second due date"
                value={paymentDueDates.secondDate}
                onChange={(date) => setPaymentDueDates(prev => ({ ...prev, secondDate: date }))}
                disabled={isDueDateDisabled(1)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">Third Due Date</label>
              <DatePicker
                className="w-full"
                placeholder="Select third due date"
                value={paymentDueDates.thirdDate}
                onChange={(date) => setPaymentDueDates(prev => ({ ...prev, thirdDate: date }))}
                disabled={isDueDateDisabled(2)}
              />
            </div>
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">Last Due Date</label>
              <DatePicker
                className="w-full"
                placeholder="Select last due date"
                value={paymentDueDates.lastDate}
                onChange={(date) => setPaymentDueDates(prev => ({ ...prev, lastDate: date }))}
                disabled={isDueDateDisabled(3)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={isActive}
              onChange={(checked) => setIsActive(checked)}
            />
            <label className="text-gray-600">
              Is LWF applicable for Selected State
            </label>
          </div>
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
            Update
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default LWFTable;
  