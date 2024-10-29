import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { format } from 'date-fns';
import { Button, Tooltip } from '@/components/ui';
import { MdEdit } from 'react-icons/md';
import { AppDispatch } from '@/store'
import { useDispatch } from 'react-redux';
import { fetchStates } from '@/store/slices/state/stateSlice';


const StateTable = ({ stateData, loading, onEdit }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [stateTableData, setStateTableData] = useState([])


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
        header: 'State Name',
        accessorKey: 'name',
      },
      {
        header: 'Payment Mode',
        accessorKey: 'payment_mode',
        cell: ({ row }) => row.original.payment_mode === 'online' ? 'Online' : 'Offline',
      },
      {
        header: 'PT EC Frequency',
        accessorKey: 'ptec_frequency',
        cell: ({ row }) => getFrequencyLabel(row.original.ptec_frequency),
      },
      {
        header: 'PT EC Due Dates',
        cell: ({ row }) => (
          <div className="space-y-1">
            <div>First: {formatDate(row.original.ptec_payment_due_date?.first_date)}</div>
            {row.original.ptec_frequency === 'half_yearly' && (
              <div>Last: {formatDate(row.original.ptec_payment_due_date?.last_date)}</div>
            )}
          </div>
        ),
      },
      {
        header: 'PT RC Frequency',
        accessorKey: 'ptrc_frequency',
        cell: ({ row }) => getFrequencyLabel(row.original.ptrc_frequency),
      },
      {
        header: 'PT RC Due Dates',
        cell: ({ row }) => (
          <div className="space-y-1">
            <div>First: {formatDate(row.original.ptrc_payment_due_date?.first_date)}</div>
            {row.original.ptrc_frequency === 'half_yearly' && (
              <div>Last: {formatDate(row.original.ptrc_payment_due_date?.last_date)}</div>
            )}
          </div>
        ),
      },
      {
        header: 'LWF Frequency',
        accessorKey: 'lwf_frequency',
        cell: ({ row }) => getFrequencyLabel(row.original.lwf_frequency),
      },
      {
        header: 'LWF Due Dates',
        cell: ({ row }) => (
          <div className="space-y-1">
            <div>First: {formatDate(row.original.lwf_payment_due_date?.first_date)}</div>
            {row.original.lwf_frequency === 'half_yearly' && (
              <div>Last: {formatDate(row.original.lwf_payment_due_date?.last_date)}</div>
            )}
          </div>
        ),
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

  useEffect(() => {
    fetchStateData(1, 10)
  }, [])


  const fetchStateData = async (page: number, size: number) => {
    const { payload: data } = await dispatch(
      fetchStates({page: page, page_size: size}),
    )
    setStateTableData(data?.data)
    setTableData((prev) => ({
      ...prev,
      total: data?.paginate_data.totalResult,
      pageIndex: data?.paginate_data.page,
  }))
  }

  const [tableData, setTableData] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: { order: '', key: '' },
  });

  const onPaginationChange = (page: number) => {
    setTableData(prev => ({ ...prev, pageIndex: page }));
    fetchStateData(page, tableData.pageSize)
  };

  const onSelectChange = (value: number) => {
    setTableData((prev) => ({
      ...prev,
      pageSize: Number(value),
      pageIndex: 1,
  }))
  fetchStateData(1, value)
  };


  return (
    <div className="relative">
      <DataTable
        columns={columns}
        data={stateTableData}
        loading={loading}
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
    </div>
  );
};

export default StateTable;