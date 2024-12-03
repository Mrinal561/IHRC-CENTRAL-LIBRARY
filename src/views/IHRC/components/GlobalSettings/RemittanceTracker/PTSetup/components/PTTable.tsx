import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { format } from 'date-fns';
import { Button, Tooltip } from '@/components/ui';
import { MdEdit } from 'react-icons/md';
import { AppDispatch } from '@/store'
import { useDispatch } from 'react-redux';

import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react';
import { HiOutlineViewGrid } from 'react-icons/hi'
import { fetchPTConfigs } from '@/store/slices/ptConfig/ptConfigSlice';



const PTTable = ({ tableLoading, setTableLoading, onEdit }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [ptTableData, setPTTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
 

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
  }, []);

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
    </div>
  );
};

export default PTTable;