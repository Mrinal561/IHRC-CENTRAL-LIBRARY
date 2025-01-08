import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { format } from 'date-fns';
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

const frequencyOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
];

const PTTable = ({ tableLoading, setTableLoading, onEdit, refreshTrigger }: any) => {
  const dispatch = useDispatch<AppDispatch>();
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
        firstDate: formatDate(detailData.ptec_payment_due_date?.first_date),
        secondDate: formatDate(detailData.ptec_payment_due_date?.second_date),
        thirdDate: formatDate(detailData.ptec_payment_due_date?.third_date),
        lastDate: formatDate(detailData.ptec_payment_due_date?.last_date)
      });
  
      setPtRcDates({
        firstDate: formatDate(detailData.ptrc_payment_due_date?.first_date),
        secondDate: formatDate(detailData.ptrc_payment_due_date?.second_date),
        thirdDate: formatDate(detailData.ptrc_payment_due_date?.third_date),
        lastDate: formatDate(detailData.ptrc_payment_due_date?.last_date)
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

  const handleConfirm = async () => {
    if (!selectedState || !ptEcFrequency || !ptRcFrequency || !ptEcDates.firstDate || !ptRcDates.firstDate) {
      showErrorNotification('Please fill all required fields');
      return;
    }

    const ptConfigData = {
      ptec_frequency: ptEcFrequency,
      ptrc_frequency: ptRcFrequency,
      ptec_payment_due_date: {
        first_date: ptEcDates.firstDate,
        second_date: ptEcDates.secondDate,
        third_date: ptEcDates.thirdDate,
        last_date: ptEcDates.lastDate
      },
      ptrc_payment_due_date: {
        first_date: ptRcDates.firstDate,
        second_date: ptRcDates.secondDate,
        third_date: ptRcDates.thirdDate,
        last_date: ptRcDates.lastDate
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
        cell: ({row}) => 
          <div className="w-72 text-start">
        {row.original.name}
      </div>
      },
      {
        header: 'PT RC Frequency',
        accessorKey: 'ptrc_frequency',
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {getFrequencyLabel(row.original.ptrc_frequency)}
  </div>
      },
      {
        header: 'PTRC First Due Date',
        accessorKey: 'first_date',
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {formatDate(row.original.ptrc_payment_due_date.first_date)}
  </div>
      },
      {
        header: 'PTRC Second Due Date',
        accessorKey: 'second_date',
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {formatDate(row.original.ptrc_payment_due_date.second_date)}
  </div>
      },
      {
        header: 'PTRC Third Due Date',
        accessorKey: 'third_date',
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {formatDate(row.original.ptrc_payment_due_date.third_date)}
  </div>
      },
      {
        header: 'PTRC Last Due Date',
        accessorKey: 'last_date',
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {formatDate(row.original.ptrc_payment_due_date.last_date)}
  </div>
      },
      {
        header: 'PT EC Frequency',
        accessorKey: 'ptec_frequency',
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {getFrequencyLabel(row.original.ptec_frequency)}
  </div>      },
      {
        header: 'PTEC First Due Date',
        accessorKey: 'first_date',
        cell: ({ row }) => 
          <div className="w-44 text-start">
            {formatDate(row.original.ptec_payment_due_date.first_date)}
      </div>
      },
      {
        header: 'PTEC Second Due Date',
        accessorKey: 'second_date',
        cell: ({ row }) => 
          <div className="w-44 text-start">
            {formatDate(row.original.ptec_payment_due_date.second_date)}
      </div>
      },
      {
        header: 'PTEC Third Due Date',
        accessorKey: 'third_date',
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {formatDate(row.original.ptec_payment_due_date?.third)}
      </div>
      },
      {
        header: 'PTEC Fourth Due Date',
        accessorKey: 'last_date',
        cell: ({ row }) => 
          <div className="w-44 text-start">
        {formatDate(row.original.ptec_payment_due_date?.last_date)}
      </div>
      },
      {
        header: 'Status',
        accessorKey: 'status',
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
    pageSize: 10,
    query: '',
    sort: { order: '', key: '' },
  });

  useEffect(() => {
    fetchPTSetupData(tableData.pageIndex, tableData.pageSize);
  }, [refreshTrigger]);

  const fetchPTSetupData = async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const response = await dispatch(fetchPTConfigs({page, page_size: size}));
      
      // Log the entire response to see its structure
      console.log('Full API Response:', response);

      // Adjust this based on the actual response structure
      if (response?.payload?.data) {
        console.log('Data:', response.payload.data);
        console.log('Paginate Data:', response.payload.paginateData);

        setPTTableData(response.payload.data);
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
              label="Select State"
              options={states}
              value={selectedState}
              onChange={setSelectedState}
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
            />
          </div>
          <div className="w-1/2">
            <label className="text-gray-600 mb-2 block">PT RC Frequency</label>
            <OutlinedSelect
              label="Select PT RC Frequency"
              options={frequencyOptions}
              value={frequencyOptions.find(option => option.value === ptRcFrequency)}
              onChange={(selected) => setPtRcFrequency(selected?.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <div className="mb-4 w-full">
            <h4 className="text-lg font-semibold mb-4">PT EC Due Dates</h4>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">First Due Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className="w-full"
                  placeholder="Select first due date"
                  value={ptEcDates.firstDate}
                  onChange={(date) => setPtEcDates(prev => ({ ...prev, firstDate: date }))}
                />
              </div>
              <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">
          Second Due Date {ptEcFrequency === 'quarterly' && <span className="text-red-500">*</span>}
        </label>
                <DatePicker
                  className="w-full"
                  placeholder="Select second due date"
                  value={ptEcDates.secondDate}
                  onChange={(date) => setPtEcDates(prev => ({ ...prev, secondDate: date }))}
                  disabled={isDueDateDisabled(ptEcFrequency, 1)}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">
          Third Due Date {ptEcFrequency === 'quarterly' && <span className="text-red-500">*</span>}
        </label>
                <DatePicker
                  className="w-full"
                  placeholder="Select third due date"
                  value={ptEcDates.thirdDate}
                  onChange={(date) => setPtEcDates(prev => ({ ...prev, thirdDate: date }))}
                  disabled={isDueDateDisabled(ptEcFrequency, 2)}
                />
              </div>
              <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">
          Fourth Due Date {(ptEcFrequency === 'quarterly' || ptEcFrequency === 'half_yearly') && 
            <span className="text-red-500">*</span>}
        </label>
                <DatePicker
                  className="w-full"
                  placeholder="Select fourth due date"
                  value={ptEcDates.lastDate}
                  onChange={(date) => setPtEcDates(prev => ({ ...prev, lastDate: date }))}
                  disabled={isDueDateDisabled(ptEcFrequency, 3)}
                />
              </div>
            </div>
          </div>

          <div className="mb-4 w-full">
            <h4 className="text-lg font-semibold mb-4">PT RC Due Dates</h4>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-gray-600 mb-2 block">First Due Date <span className="text-red-500">*</span></label>
                <DatePicker
                  className="w-full"
                  placeholder="Select first due date"
                  value={ptRcDates.firstDate}
                  onChange={(date) => setPtRcDates(prev => ({ ...prev, firstDate: date }))}
                />
              </div>
              <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">
          Second Due Date {ptRcFrequency === 'quarterly' && <span className="text-red-500">*</span>}
        </label>
                <DatePicker
                  className="w-full"
                  placeholder="Select second due date"
                  value={ptRcDates.secondDate}
                  onChange={(date) => setPtRcDates(prev => ({ ...prev, secondDate: date }))}
                  disabled={isDueDateDisabled(ptRcFrequency, 1)}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">
          Third Due Date {ptRcFrequency === 'quarterly' && <span className="text-red-500">*</span>}
        </label>
                <DatePicker
                  className="w-full"
                  placeholder="Select third due date"
                  value={ptRcDates.thirdDate}
                  onChange={(date) => setPtRcDates(prev => ({ ...prev, thirdDate: date }))}
                  disabled={isDueDateDisabled(ptRcFrequency, 2)}
                />
              </div>
              <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">
          Fourth Due Date {(ptRcFrequency === 'quarterly' || ptRcFrequency === 'half_yearly') && 
            <span className="text-red-500">*</span>}
        </label>
                <DatePicker
                  className="w-full"
                  placeholder="Select fourth due date"
                  value={ptRcDates.lastDate}
                  onChange={(date) => setPtRcDates(prev => ({ ...prev, lastDate: date }))}
                  disabled={isDueDateDisabled(ptRcFrequency, 3)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={isActive}
            onChange={(checked) => setIsActive(checked)}
          />
          <label className="text-gray-600">
            Is PT applicable for Selected State
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

export default PTTable;