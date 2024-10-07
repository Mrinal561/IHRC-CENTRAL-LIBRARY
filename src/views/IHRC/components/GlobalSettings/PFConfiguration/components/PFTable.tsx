import React, { useMemo } from 'react';
import { Button, Tooltip } from '@/components/ui';
import { MdEdit } from 'react-icons/md';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';

interface PFData {
  id: string;
  frequency: string;
  firstDueDate: Date | null;
  secondDueDate: Date | null;
}

interface PFTableProps {
  pfData: PFData[];
}

const PFTable: React.FC<PFTableProps> = ({ pfData }) => {
  const columns: ColumnDef<PFData>[] = useMemo(
    () => [
      {
        header: 'Frequency',
        accessorKey: 'frequency',
      },
      {
        header: 'First Due Date',
        accessorKey: 'firstDueDate',
        cell: ({ row }) => {
          const date = row.original.firstDueDate;
          return date ? date.toLocaleDateString() : '-';
        },
      },
      {
        header: 'Second Due Date',
        accessorKey: 'secondDueDate',
        cell: ({ row }) => {
          const date = row.original.secondDueDate;
          return date ? date.toLocaleDateString() : '-';
        },
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <Tooltip title="Edit">
            <Button
              size="sm"
              onClick={() => {
                // Implement edit functionality here
                console.log('Edit', row.original);
              }}
              icon={<MdEdit />}
              className="text-blue-500"
            />
          </Tooltip>
        ),
      },
    ],
    []
  );

  return <DataTable columns={columns} data={pfData} />;
};

export default PFTable;