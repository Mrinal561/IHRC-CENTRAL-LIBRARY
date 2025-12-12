import React, { useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Button, Tooltip, Badge } from '@/components/ui';
import { FiFileText, FiDownload, FiUpload, FiFile } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';

interface RegisterData {
  id: number;
  company_name: string;
  company_admin_name: string;
  company_admin_email: string;
  year: number;
  // month: string;
  status: 'pending' | 'processed' | 'completed';
  has_original_zip: boolean;
  has_processed_zip: boolean;
  original_uploaded_at: string;
  processed_uploaded_at?: string;
  processed_by?: {
    name: string;
  };
}

interface RegisterTableProps {
  data: RegisterData[];
  loading: boolean;
  onDownloadOriginal: (id: number) => void;
  onDownloadProcessed: (id: number) => void;
  onUploadProcessed: (id: number) => void;
  onEdit: (id: number) => void;
  pageIndex: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number) => void;
  onSelectChange: (pageSize: number) => void;
}

const RegisterTable = ({ 
  data,
  loading,
  onDownloadOriginal,
  onDownloadProcessed,
  onUploadProcessed,
  onEdit,
  pageIndex,
  pageSize,
  total,
  onPaginationChange,
  onSelectChange
}: RegisterTableProps) => {
      const [downloading, setDownloading] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'yellow';
      case 'processed': return 'blue';
      case 'completed': return 'green';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const columns = useMemo(
    () => [
      {
        header: 'Company Name',
        enableSorting: false,
        accessorKey: 'company_name',
        cell: ({ row }: any) => (
          <div className="w-40 truncate">
            {row.original.company_name}
          </div>
        ),
      },
      {
        header: 'Company Admin',
        enableSorting: false,
        cell: ({ row }: any) => (
          <div className="w-40">
            <div className="font-medium">{row.original.company_admin_name}</div>
            <div className="text-sm text-gray-500 truncate">{row.original.company_admin_email}</div>
          </div>
        ),
      },
      {
        header: 'Description',
        enableSorting: false,
        accessorKey: 'description',
        cell: ({ row }: any) => (
        <Tooltip title={row.original.description} placement="top">
          <div className="text-center truncate w-48">
            {row.original.description || '--'}
          </div>
          </Tooltip>
        ),
      },
      {
        header: 'Year',
        enableSorting: false,
        accessorKey: 'year',
        cell: ({ row }: any) => (
          <div className="text-center">
            {row.original.year}
          </div>
        ),
      },
      {
        header: 'Month',
        enableSorting: false,
        accessorKey: 'month',
        cell: ({ row }: any) => (
          <div className="w-20">
            {row.original.month}
          </div>
        ),
      },
      {
        header: 'Status',
        enableSorting: false,
        accessorKey: 'status',
        cell: ({ row }) => {
                    const statusColors = {
                        pending: 'bg-yellow-100 text-yellow-800',
                        processed: 'bg-blue-100 text-blue-800',
                        completed: 'bg-green-100 text-green-800'
                    };
                    
                    return (
                        <span className={`px-4 py-2 rounded-xl text-[13px] font-bold ${statusColors[row.original.status]}`}>
                            {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
                        </span>
                    );
                },
      },
      {
        header: 'Input File',
        enableSorting: false,
        cell: ({ row }: any) => (
          <div className="flex justify-center w-24">
            {row.original.has_original_zip ? (
              <Tooltip title="Download Input File" placement="top">
                {/* <Button
                  size="sm"
                //   variant="plain"
                  icon={<FiFile className="text-blue-600" />}
                  onClick={() => onDownloadOriginal(row.original.id)}
                  className='border-none'
                /> */}
                <Button
                                    size="sm"
                                    variant="plain"
                                    icon={<FiFile className="w-5 h-5 text-blue-600 hover:text-blue-800" />}
                                    onClick={() => onDownloadOriginal(row.original.id)}
                                    loading={downloading === `${row.original.id}-original`}
                                    disabled={downloading === `${row.original.id}-original`}
                                />
              </Tooltip>
            ) : (
              <span className="text-gray-400">N/A</span>
            )}
          </div>
        ),
      },
      {
        header: 'Uploaded Date',
        enableSorting: false,
        cell: ({ row }: any) => (
          <div className="w-32">
            {formatDate(row.original.original_uploaded_at)}
          </div>
        ),
      },
    //   {
    //     header: 'Processed By',
    //     enableSorting: false,
    //     cell: ({ row }: any) => (
    //       <div className="w-32 truncate text-center">
    //         {row.original.processed_by?.name || '--'}
    //       </div>
    //     ),
    //   },
      {
        header: 'Completed Date',
        enableSorting: false,
        cell: ({ row }: any) => (
          <div className="w-32 text-center">
            {row.original.processed_uploaded_at 
              ? formatDate(row.original.processed_uploaded_at)
              : '--'
            }
          </div>
        ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }: any) => (
          <div className="flex gap-1">
            {row.original.has_processed_zip && (
              <Tooltip title="Download Output Register" placement="top">
                <Button
                  size="sm"
                  icon={<FiDownload />}
                  onClick={() => onDownloadProcessed(row.original.id)}
                />
              </Tooltip>
            )}
            
            {/* <Tooltip title="Upload Processed Document" placement="top">
              <Button
                size="sm"
                icon={<FiUpload />}
                onClick={() => onUploadProcessed(row.original.id)}
              />
            </Tooltip> */}
            
            <Tooltip title="Upload Output Register" placement="top">
              <Button
                size="sm"
                icon={<FiUpload />}
                onClick={() => onEdit(row.original.id)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [onDownloadOriginal, onDownloadProcessed, onUploadProcessed, onEdit]
  );

  return (
    <div className="relative">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        stickyHeader={true}
        pagingData={{
          total: total,
          pageIndex: pageIndex,
          pageSize: pageSize,
        }}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
        selectable={true}
      />
    </div>
  );
};

export default RegisterTable;