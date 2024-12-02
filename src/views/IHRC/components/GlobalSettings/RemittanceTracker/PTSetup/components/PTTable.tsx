import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { format } from 'date-fns';
import { Button, Tooltip } from '@/components/ui';
import { MdEdit } from 'react-icons/md';
import { AppDispatch } from '@/store'
import { useDispatch } from 'react-redux';
import { fetchPFSetups } from '@/store/slices/pfsetup/pfsetupSlice'; 
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react';
import { HiOutlineViewGrid } from 'react-icons/hi'



const PTTable = ({ tableLoading, setTableLoading, onEdit }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [pfTableData, setPFTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
 

  const formatDate = (date) => {
    if (!date) return '-';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const getFrequencyLabel = (value) => {
    const labels = {
      'yearly': 'Yearly',
      'half_yearly': 'Half Yearly',
      'monthly': 'Monthly'
    };
    return labels[value] || value;
  };

  const columns = useMemo(
    () => [
      {
        header: 'State',
        accessorKey: 'name',
      },
      {
        header: 'PT EC Frequency',
        accessorKey: 'frequency',
        cell: ({ row }) => getFrequencyLabel(row.original.frequency),
      },
      {
        header: 'First Due Date',
        accessorKey: 'firstDueDate',
        cell: ({ row }) => formatDate(row.original.firstDueDate),
      },
      {
        header: 'Second Due Date',
        accessorKey: 'secondDueDate',
        cell: ({ row }) => formatDate(row.original.secondDueDate) || '-',
      },
      {
        header: 'Third Due Date',
        accessorKey: 'thirdDueDate',
        cell: ({ row }) => formatDate(row.original.thirdDueDate) || '-',
      },
      {
        header: 'Fourth Due Date',
        accessorKey: 'fourthDueDate',
        cell: ({ row }) => formatDate(row.original.fourthDueDate) || '-',
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <Tooltip title="Edit" placement="top">
              <Button
                size="sm"
                icon={<MdEdit />}
                onClick={() => onEdit(row.original)}
              />
            </Tooltip>
          </div>
        ),
      },
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
    fetchPFSetupData(1, 10);
  }, []);

  useEffect(() => {
    if (tableLoading) {
      fetchPFSetupData(1, 10);
      setTableLoading(false);
    }
  }, [tableLoading]);

  const fetchPFSetupData = async (page: number, size: number) => {
    try {
      // You'll need to implement this Redux action
      const { payload: data } = await dispatch(
        fetchPFSetups({ page, page_size: size })
      );
      
    //   setPFTableData(data?.data);
    //   setTableData((prev) => ({
    //     ...prev,
    //     total: data?.paginate_data.totalResult,
    //     pageIndex: data?.paginate_data.page,
    //   }));
    } catch (error) {
      console.error('Failed to fetch PF setups', error);
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

export default PTTable;