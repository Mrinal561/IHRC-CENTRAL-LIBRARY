import React, { useMemo, useState } from 'react';
import { Button, Dialog, Tooltip } from '@/components/ui';
import { MdEdit, MdDelete } from 'react-icons/md';
import DataTable from '@/components/shared/DataTable';
import { PFConfigData } from '@/store/slices/pfConfig/pfConfigSlice';
import Loading from '@/components/shared/Loading';
import dayjs from 'dayjs';
import { BiTrash } from 'react-icons/bi';
import { FiEdit } from 'react-icons/fi';


const PFTable = ({ pfConfigurationData, loading, onEdit }) => {

  const [selectedId, setSelectedId] = React.useState<string | null>(null);




  const columns = useMemo(
    () => [
      {
        header: 'Frequency',
        accessorKey: 'pf_frequency',
        cell: ({ row }) => {
          const frequency = row.original.pf_frequency;
          return frequency.charAt(0).toUpperCase() + frequency.slice(1);
        },
      },
      {
        header: 'First Due Date',
        accessorKey: 'pt_payment_due_date.first_date',
        cell: ({ row }) => {
          const date = row.original.pt_payment_due_date.first_date;
          return date ? dayjs(date).format('DD/MM/YYYY') : '-';
        },
      },
      {
        header: 'Second Due Date',
        accessorKey: 'pt_payment_due_date.last_date',
        cell: ({ row }) => {
          const date = row.original.pt_payment_due_date.last_date;
          return date ? dayjs(date).format('DD/MM/YYYY') : '-';
        },
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Tooltip title="Edit">
              <Button
                size="sm"
                icon={<MdEdit />}
                onClick={() => onEdit(row.original)}
                className="text-blue-500 hover:text-blue-600"
              />
            </Tooltip>
           
          </div>
        ),
      },
    ],
    [onEdit]
  );

  const [tableData, setTableData] = useState({
    total: pfConfigurationData.length,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: { order: '', key: '' },
  });

  const onPaginationChange = (page: number) => {
    setTableData(prev => ({ ...prev, pageIndex: page }));
  };

  const onSelectChange = (value: number) => {
    setTableData(prev => ({ ...prev, pageSize: Number(value), pageIndex: 1 }));
  };


  return (
    <>
      <DataTable 
        data={pfConfigurationData} 
        columns={columns} 
        loading={loading}
        stickyHeader={true}
        stickyFirstColumn={true}
        stickyLastColumn={true}
        pagingData={{
          total: pfConfigurationData.total,
          pageIndex: pfConfigurationData.pageIndex,
          pageSize: pfConfigurationData.pageSize,
        }}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
        selectable={true}
      />

     
    </>
  );
};

export default PFTable;