import React from 'react';
import { FiFile } from 'react-icons/fi';
import DataTable from '@/components/shared/DataTable';
import type { ColumnDef } from '@/components/shared/DataTable';

interface RegisterOutput {
  id: number;
  register_type: string;
  state_name: string;
  document?: string;
  original_filename?: string;
}

interface RegisterOutputTableProps {
  data: RegisterOutput[];
  loading: boolean;
  pageIndex: number;
  pageSize: number;
  total: number;
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
  onDownload: (register: RegisterOutput) => void;
}

const RegisterOutputTable = ({
  data,
  loading,
  pageIndex,
  pageSize,
  total,
  onPaginationChange,
  onDownload,
}: RegisterOutputTableProps) => {
  const columns: ColumnDef<RegisterOutput>[] = [
    {
      header: 'Register Type',
      enableSorting: false,
      accessorKey: 'register_type',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.register_type}</div>
      ),
    },
    {
      header: 'State',
      enableSorting: false,
      accessorKey: 'state_name',
      cell: ({ row }) => <div>{row.original.state_name}</div>,
    },
    {
      header: 'Document',
      enableSorting: false,
      accessorKey: 'document',
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.document ? (
            <button
              onClick={() => onDownload(row.original)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FiFile className="w-5 h-5" />
            </button>
          ) : (
            <span className="text-gray-400">No document</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      pagingData={{
        total,
        pageIndex,
        pageSize,
      }}
      onPaginationChange={onPaginationChange}
    />
  );
};

export default RegisterOutputTable;