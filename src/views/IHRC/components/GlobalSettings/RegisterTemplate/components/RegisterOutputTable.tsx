import React from 'react';
import { FiFile } from 'react-icons/fi';
import DataTable from '@/components/shared/DataTable';
import type { ColumnDef } from '@/components/shared/DataTable';
import { RegisterOutput } from '../RegisterOutputTemplate';

// 

interface RegisterOutputTableProps {
  data: RegisterOutput[];
  loading: boolean;
  onDownload: (register: RegisterOutput) => void;
   pagination: {
        total: number;
        pageIndex: number;
        pageSize: number;
      };
  onPaginationChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const RegisterOutputTable = ({
  data,
  loading,
  onDownload,
  pagination,
   onPaginationChange,
    onPageSizeChange,
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
        <div className="flex justify-start px-7 items-start">
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
                        total: pagination.total,
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                      }}
                      onPaginationChange={onPaginationChange}
                      onSelectChange={onPageSizeChange}
    />
  );
};

export default RegisterOutputTable;