
import React, { useMemo, useState } from 'react';
import { ColumnDef } from '@/components/shared/DataTable';
import DataTable from '@/components/shared/DataTable';


// Define the structure of our data
export interface VersionHistoryDataRow {
 versionNumber: string;
 updatedDate: string;
 changeLog: string;
}

// Sample data for the table
const initialData: VersionHistoryDataRow[] = [
    {
        versionNumber: '1.0',
        updatedDate: '2024-01-01',
        changeLog: 'Initial release.',
    },
    {
        versionNumber: '1.1',
        updatedDate: '2024-02-10',
        changeLog: 'Initial release.',
    },
    {
        versionNumber: '1.2',
        updatedDate: '2024-03-15',
        changeLog: 'Initial release.',
    },
    {
        versionNumber: '1.3',
        updatedDate: '2024-04-22',
        changeLog: 'Initial release.',
    },
    {
        versionNumber: '1.4',
        updatedDate: '2024-05-18',
        changeLog: 'Initial release.',
    },
  
];

const VersionHistoryTable: React.FC = () => {
  // State for the table data
  const [data] = useState<VersionHistoryDataRow[]>(initialData);
 
  const columns: ColumnDef<VersionHistoryDataRow>[] = useMemo(
    () => [
      {
        header: 'Version Number',
        accessorKey: 'versionNumber',
        cell: (props) => (
          <div className="w-24 text-start">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'Updated Date',
        accessorKey: 'updatedDate',
        cell: (props) => (
          <div className="w-24 text-start">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'Log',
        accessorKey: 'changeLog',
        cell: (props) => (
          <div className="w-24 text-start">{props.getValue() as string}</div>
        ),
      },
    ],
    []
  );

  // State for table pagination and sorting
  const [tableData, setTableData] = useState({
    total: initialData.length,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: { order: '', key: '' },
  });

  // Function to handle pagination changes
  const onPaginationChange = (page: number) => {
    setTableData(prev => ({ ...prev, pageIndex: page }));
  };

  // Function to handle page size changes
  const onSelectChange = (value: number) => {
    setTableData(prev => ({ ...prev, pageSize: Number(value), pageIndex: 1 }));
  };

  return (
    <div className="relative">
      {/* Render the DataTable component */}
      <DataTable
        columns={columns}
        data={data}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ className: 'rounded-md' }}
        loading={false}
        pagingData={{
          total: tableData.total,
          pageIndex: tableData.pageIndex,
          pageSize: tableData.pageSize,
        }}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
        stickyHeader={true}
          stickyFirstColumn={true}
          stickyLastColumn={true}
      />

      
    </div>
  );
};

export default VersionHistoryTable;