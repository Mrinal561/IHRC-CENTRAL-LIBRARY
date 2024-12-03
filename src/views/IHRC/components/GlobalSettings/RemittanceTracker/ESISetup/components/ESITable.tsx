import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '@/components/shared/DataTable';
import { format } from 'date-fns';
import { Button, Tooltip, Badge } from '@/components/ui';
import { MdEdit } from 'react-icons/md';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { AppDispatch, RootState } from '@/store';
import { fetchESIConfigs } from '@/store/slices/esiConfig/esiConfigSlice';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import Lottie from 'lottie-react';

const ESITable = ({ onEdit }: { onEdit: (config: any) => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);
  const [esiTableData, setESITableData] = useState([]);

  const [tableData, setTableData] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: { order: '', key: '' },
  });

  useEffect(() => {
    fetchESISetupData(tableData.pageIndex, tableData.pageSize);
  }, []);

  const fetchESISetupData = async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const response = await dispatch(fetchESIConfigs({page, page_size: size}));
      
      // Log the entire response to see its structure
      console.log('Full API Response:', response);

      // Adjust this based on the actual response structure
      if (response?.payload?.data) {
        console.log('Data:', response.payload.data);
        console.log('Paginate Data:', response.payload.paginateData);

        setESITableData(response.payload.data);
        setTableData((prev) => ({
          ...prev,
          total: response.payload.paginateData?.totalResults || 0,
          totalPages: response.payload.paginateData?.totalPages || 0,
          pageIndex: page, 
          pageSize: size
        }));
      } else {
        console.error('No data found in the response');
        setESITableData([]);
      }
    } catch (error) {
      console.error('Failed to fetch ESI configurations', error);
      setESITableData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the code remains the same as in your previous implementation
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
      // {
      //   header: 'State ID',
      //   accessorKey: 'id',
      // },
      {
        header: 'State Name',
        accessorKey: 'name',
        cell: ({row}) => 
          <div className="w-72 text-start">
        {row.original.name}
      </div>
      },
      {
        header: 'ESI Frequency',
        accessorKey: 'esi_frequency',
        cell: ({ row }) => 
          <div className="w-40 text-start">
            {getFrequencyLabel(row.original.esi_frequency)}
          </div>
      },
      {
        header: 'First Due Date',
        accessorKey: 'first_date',
        cell: ({ row }) => 
          <div className="w-40 text-start">
        {formatDate(row.original.esi_payment_due_date?.first_date)}
      </div>
      },
      {
        header: 'Second Due Date',
        accessorKey: 'second_date',
        cell: ({ row }) => 
          <div className="w-40 text-start">
        {formatDate(row.original.esi_payment_due_date?.second_date)}
      </div>
      },
      {
        header: 'Third Due Date',
        accessorKey: 'third_date',
        cell: ({ row }) => 
          <div className="w-40 text-start">
        {formatDate(row.original.esi_payment_due_date?.third_date)}
      </div>
      },
      {
        header: 'Last Due Date',
        accessorKey: 'last_date',
        cell: ({ row }) => 
          <div className="w-40 text-start">
        {formatDate(row.original.esi_payment_due_date?.last_date)}
      </div>
      },
      {
        header: 'Status',
        accessorKey: 'esi_active',
        cell: ({ row }) => (
          <div className="w-24 text-start">
          <div 
            className={row.original.esi_active ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}
            >
            {row.original.esi_active ? 'Active' : 'Inactive'}
          </div>
            </div>
        ),
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

  const onPaginationChange = (page: number) => {
    setTableData(prev => ({ ...prev, pageIndex: page }));
    fetchESISetupData(page, tableData.pageSize);
  };

  const onSelectChange = (value: number) => {
    setTableData((prev) => ({
      ...prev,
      pageSize: Number(value),
      pageIndex: 1,
    }));
    fetchESISetupData(1, value);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
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
      {esiTableData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
          <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-center">
            No ESI Configurations Available
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={esiTableData}
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

export default ESITable;