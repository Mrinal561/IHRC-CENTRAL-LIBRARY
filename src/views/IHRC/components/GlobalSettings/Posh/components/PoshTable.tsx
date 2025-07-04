// import React, { useMemo, useState, useEffect } from 'react';
// import DataTable from '@/components/shared/DataTable';
// import { Button, Tooltip } from '@/components/ui';
// import { MdEdit } from 'react-icons/md';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';

// interface PoshData {
//     id: string;
//     state_name: string;
//     district_name: string;
//     authority_name: string;
//     authority_address: string;
// }

// interface PoshTableProps {
//     onEdit: (id: string) => void;
//     searchTerm: string;
//     pageIndex: number;
//     pageSize: number;
//     onPaginationChange: (page: number) => void;
//     onSelectChange: (pageSize: number) => void;
//     timestamp?: number;
// }

// const PoshTable = ({ 
//     onEdit, 
//     searchTerm,
//     pageIndex,
//     pageSize,
//     onPaginationChange,
//     onSelectChange,
//     timestamp 
// }: PoshTableProps) => {
//     const [loading, setLoading] = useState(true);
//     const [poshTableData, setPoshTableData] = useState<PoshData[]>([]);
//     const [totalResults, setTotalResults] = useState(0);

//     useEffect(() => {
//         const fetchPoshData = async () => {
//             try {
//                 setLoading(true);
//                 const response = await httpClient.get(endpoints.posh.list(), {
//                     params: {
//                         page: pageIndex,
//                         page_size: pageSize,
//                         search: searchTerm
//                     }
//                 });
                
//                 setPoshTableData(response.data.data || []);
//                 setTotalResults(response.data.paginate_data?.totalResults || 0);
//             } catch (error) {
//                 console.error('Error fetching POSH data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
    
//         fetchPoshData();
//         // Add tableData.timestamp to dependency array if passed as prop
//     }, [pageIndex, pageSize, searchTerm, timestamp]);
//     const columns = useMemo(
//         () => [
//             {
//                 header: 'State',
//                 enableSorting: false,
//                 accessorKey: 'state_name',
//                 cell: ({ row }) => (
//                     <div className="w-40 truncate">
//                         {row.original.state_name}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'District',
//                 enableSorting: false,
//                 accessorKey: 'district_name',
//                 cell: ({ row }) => (
//                     <div className="w-40 truncate">
//                         {row.original.district_name}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'Authority Name',
//                 enableSorting: false,
//                 accessorKey: 'authority_name',
//                 cell: ({ row }) => (
//                     <div className="w-40 truncate">
//                         {row.original.authority_name}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'Authority Address',
//                 enableSorting: false,
//                 accessorKey: 'authority_address',
//                 cell: ({ row }) => (
//                     <div className="w-60 truncate">
//                         {row.original.authority_address}
//                     </div>
//                 ),
//             },
//             {
//                 header: 'Actions',
//                 id: 'actions',
//                 cell: ({ row }) => (
//                     <Tooltip title="Edit" placement="top">
//                         <Button
//                             size="sm"
//                             icon={<MdEdit />}
//                             onClick={() => onEdit(row.original.id)}
//                         />
//                     </Tooltip>
//                 ),
//             },
//         ],
//         [onEdit]
//     );

//     return (
//         <div className="relative">
//             <DataTable
//                 columns={columns}
//                 data={poshTableData}
//                 loading={loading}
//                 stickyHeader={true}
//                 stickyFirstColumn={true}
//                 stickyLastColumn={true}                
//                 pagingData={{
//                     total: totalResults,
//                     pageIndex: pageIndex,
//                     pageSize: pageSize,
//                 }}
//                 onPaginationChange={onPaginationChange}
//                 onSelectChange={onSelectChange}
//                 selectable={true}
//             />
//         </div>
//     );
// };

// export default PoshTable;




import React, { useMemo } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Button, Tooltip } from '@/components/ui';
import { MdEdit } from 'react-icons/md';

interface PoshData {
    id: string;
    state_name: string;
    district_name: string;
    authority_name: string;
    authority_address: string;
}

interface PoshTableProps {
    data: PoshData[];
    loading: boolean;
    onEdit: (id: string) => void;
    pageIndex: number;
    pageSize: number;
    total: number;
    onPaginationChange: (page: number) => void;
    onSelectChange: (pageSize: number) => void;
}

const PoshTable = ({ 
    data,
    loading,
    onEdit, 
    pageIndex,
    pageSize,
    total,
    onPaginationChange,
    onSelectChange
}: PoshTableProps) => {
    const columns = useMemo(
        () => [
            {
                header: 'State',
                enableSorting: false,
                accessorKey: 'state_name',
                cell: ({ row }) => (
                    <div className="w-40 truncate">
                        {row.original.state_name}
                    </div>
                ),
            },
            {
                header: 'District',
                enableSorting: false,
                accessorKey: 'district_name',
                cell: ({ row }) => (
                    <div className="w-40 truncate">
                        {row.original.district_name}
                    </div>
                ),
            },
            {
                header: 'Authority Name',
                enableSorting: false,
                accessorKey: 'authority_name',
                cell: ({ row }) => (
                    <div className="w-40 truncate">
                        {row.original.authority_name}
                    </div>
                ),
            },
            {
                header: 'Authority Address',
                enableSorting: false,
                accessorKey: 'authority_address',
                cell: ({ row }) => (
                    <div className="w-60 truncate">
                        {row.original.authority_address}
                    </div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <Tooltip title="Edit" placement="top">
                        <Button
                            size="sm"
                            icon={<MdEdit />}
                            onClick={() => onEdit(row.original.id)}
                        />
                    </Tooltip>
                ),
            },
        ],
        [onEdit]
    );

    return (
        <div className="relative">
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                stickyHeader={true}
                stickyFirstColumn={true}
                stickyLastColumn={true}                
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

export default PoshTable;