import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { format } from 'date-fns';
import { Button, Tooltip } from '@/components/ui';
import { MdEdit } from 'react-icons/md';
import { AppDispatch } from '@/store'
import { useDispatch } from 'react-redux';
import { fetchPFConfigs } from '@/store/slices/pfConfig/pfConfigSlice';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react';
import { HiOutlineViewGrid } from 'react-icons/hi'



const PFSetupTable = ({ 
  tableLoading = false, 
  setTableLoading, 
  onEdit ,
  refreshTrigger
} : any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [pfTableData, setPFTableData] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);

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
      //   header: 'ID',
      //   accessorKey: 'id',
      // },
      
      {
        header: 'Mode',
        accessorKey: 'payment_mode',
      },
      {
        header: 'PF Frequency',
        accessorKey: 'pf_frequency',
        cell: ({ row }) => getFrequencyLabel(row.original.pf_frequency),
      },
      {
        header: 'First Due Date',
        accessorKey: 'first_date',
        cell: ({ row }) => formatDate(row.original.pf_payment_due_date.first_date),
      },
      {
        header: 'Mode',
        accessorKey: 'pfiw_payment_mode',
      },
      {
        header: 'PFIW Frequency',
        accessorKey: 'pfiw_frequency',
        cell: ({ row }) => getFrequencyLabel(row.original.pfiw_frequency),
      },
      {
        header: 'First Due Date',
        accessorKey: 'first_date',
        cell: ({ row }) => formatDate(row.original.pfiw_payment_due_date.first_date),
      },
      // {
      //   header: 'Second Due Date',
      //   accessorKey: 'second_date',
      //   cell: ({ row }) => formatDate(row.original.pt_payment_due_date.second_date) || '-',
      // },
      // {
      //   header: 'Third Due Date',
      //   accessorKey: 'third_date',
      //   cell: ({ row }) => formatDate(row.original.pt_payment_due_date.third_date) || '-',
      // },
      // {
      //   header: 'Last Due Date',
      //   accessorKey: 'last_date',
      //   cell: ({ row }) => formatDate(row.original.pt_payment_due_date.last_date) || '-',
      // },
      // {
      //   header: 'Actions',
      //   id: 'actions',
      //   cell: ({ row }) => (
      //     <div className="flex space-x-2">
      //       <Tooltip title="Edit" placement="top">
      //         <Button
      //           size="sm"
      //           icon={<MdEdit />}
      //           onClick={() => onEdit && onEdit(row.original)}
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
    fetchPFSetupData(tableData.pageIndex, tableData.pageSize);
  }, [refreshTrigger]);


  const fetchPFSetupData = async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const { payload } = await dispatch(
        fetchPFConfigs({ page, page_size: size })
      );
      
      if (payload?.data && payload?.paginateData) {
        setPFTableData(payload?.data);
      setTableData((prev) => ({
        ...prev,
        total: payload.paginateData.totalResult,
        totalPages: payload.paginateData.totalPages,
        pageIndex: page, 
        pageSize: size
      }));
      }
    } catch (error) {
      console.error('Failed to fetch PF setups', error);
      setIsLoading(false);
    }
    finally{
      setIsLoading(false);
    }
  };

  const onPaginationChange = (page: number) => {
    setTableData(prev => ({ ...prev, pageIndex: page }));
    fetchPFSetupData(page, tableData.pageSize);
  };

  const onSelectChange = (value: number) => {
    setTableData((prev) => ({
      ...prev,
      pageSize: Number(value),
      pageIndex: 1,
    }));
    fetchPFSetupData(1, value);
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
      {pfTableData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
          <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-center">
            No Data Available
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={pfTableData}
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

export default PFSetupTable;