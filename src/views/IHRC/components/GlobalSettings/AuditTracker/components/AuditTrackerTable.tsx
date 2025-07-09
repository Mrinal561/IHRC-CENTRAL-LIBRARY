// import React, { useState } from 'react';
// import { Button, Dialog, Tooltip, Notification, toast } from '@/components/ui';
// import { useNavigate } from 'react-router-dom';
// import { MdEdit } from 'react-icons/md';
// import { FiXCircle } from 'react-icons/fi';
// import { DataTable } from '@/components/shared';
// import { HiOutlineViewGrid } from 'react-icons/hi';
// import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import { ComplianceData, ReferenceData } from '@/@types/compliance';

// interface AuditTrackerTableProps {
//   data: ComplianceData[];
//   loading: boolean;
//   pagination: {
//     pageIndex: number;
//     pageSize: number;
//     total: number;
//   };
//   onPageChange: (page: number) => void;
//   onPageSizeChange: (size: number) => void;
//   refetchData: () => void;
//   states: ReferenceData[];
// }

// const AuditTrackerTable = ({
//   data,
//   loading,
//   pagination,
//   onPageChange,
//   onPageSizeChange,
//   refetchData,
//   states
// }: AuditTrackerTableProps) => {
//   const navigate = useNavigate();
//   const [selectedCompliance, setSelectedCompliance] = useState<ComplianceData | null>(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [isTogglingStatus, setIsTogglingStatus] = useState(false);

//   const toggleComplianceStatus = async (id: number, is_active: boolean) => {
//     setIsTogglingStatus(true);
//     try {
//       await httpClient.put(
//         endpoints.compliances.togglestatus(id.toString()),
//         { is_active }
//       );
//       toast.push(
//         <Notification title="Success" type="success">
//           Compliance status updated successfully
//         </Notification>
//       );
//       refetchData();
//     } catch (error) {
//       toast.push(
//         <Notification title="Error" type="error">
//           Failed to update compliance status
//         </Notification>
//       );
//     } finally {
//       setIsTogglingStatus(false);
//     }
//   };

//   const formatDisplayValue = (value: string) => {
//     if (!value) return '';
    
//     if (value.includes('_')) {
//       return value.split('_')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');
//     }
    
//     return value.charAt(0).toUpperCase() + value.slice(1);
//   };

//   const columns = React.useMemo(
//     () => [
//       {
//         header: 'Function',
//         enableSorting: false,
//         accessorKey: 'function',
//         cell: ({ row }) => <div className="w-40">{formatDisplayValue(row.original.function)}</div>
//       },
//       {
//         header: 'Applicable',
//         enableSorting: false,
//         accessorKey: 'applicable',
//         cell: ({ row }) => <div className="w-40">{formatDisplayValue(row.original.applicable)}</div>
//       },
//       {
//         header: 'State',
//         enableSorting: false,
//         accessorKey: 'state_id',
//         cell: ({ row }) => {
//           const stateName = row.original.state_id 
//             ? states.find(state => state.id === row.original.state_id)?.name 
//             : (row.original.applicable === 'central' ? 'Central' : 'N/A');
//           return <div className="w-40">{stateName}</div>;
//         }
//       },
//             {
//                 header: 'Legislation Act',
//                 enableSorting: false,
//                 accessorKey: 'legislation_act',
//                 cell: ({ row }) => <Tooltip title={formatDisplayValue(row.original.legislation_act)}>
//                     <div className="w-52 truncate">{formatDisplayValue(row.original.legislation_act)}</div>
//                 </Tooltip>
//             },
//             {
//                 header: 'Compliance Categorization',
//                 enableSorting: false,
//                 accessorKey: 'compliance_categorization',
//                 cell: ({ row }) => <div className="w-40">{formatDisplayValue(row.original.compliance_categorization)}</div>
//             },
//             {
//                 header: 'Compliance Header',
//                 enableSorting: false,
//                 accessorKey: 'compliance_header',
//                 cell: ({ row }) => <Tooltip title={formatDisplayValue(row.original.compliance_header)}>
//                     <div className="w-48 truncate">{formatDisplayValue(row.original.compliance_header)}</div>
//                 </Tooltip>
//             },
//             {
//                 header: 'Compliance Description',
//                 enableSorting: false,
//                 accessorKey: 'compliance_description',
//                 cell: ({ row }) => <Tooltip title={formatDisplayValue(row.original.compliance_description)}>
//                     <div className="w-64 truncate">{formatDisplayValue(row.original.compliance_description)}</div>
//                 </Tooltip>
//             },
//             {
//                 header: 'Penalty Type',
//                 enableSorting: false,
//                 accessorKey: 'penalty_type',
//                 cell: ({ row }) => <div className="w-32">{formatDisplayValue(row.original.penalty_type)}</div>
//             },
//             {
//                 header: 'Penalty Description',
//                 enableSorting: false,
//                 accessorKey: 'penalty_description',
//                 cell: ({ row }) => <Tooltip title={formatDisplayValue(row.original.penalty_description)}>
//                     <div className="w-48 truncate">{formatDisplayValue(row.original.penalty_description)}</div>
//                 </Tooltip>
//             },
//             {
//                 header: 'Compliance Applicability',
//                 enableSorting: false,
//                 accessorKey: 'compliance_applicability',
//                 cell: ({ row }) => <div className="w-40">{formatDisplayValue(row.original.compliance_applicability)}</div>
//             },
//             {
//                 header: 'Compliance Reference',
//                 enableSorting: false,
//                 accessorKey: 'compliance_reference',
//                 cell: ({ row }) => <Tooltip title={formatDisplayValue(row.original.compliance_reference)}>
//                     <div className="w-48 truncate">{formatDisplayValue(row.original.compliance_reference)}</div>
//                 </Tooltip>
//             },
//             {
//                 header: 'Compliance Type',
//                 enableSorting: false,
//                 accessorKey: 'compliance_type',
//                 cell: ({ row }) => <div className="w-40">{formatDisplayValue(row.original.compliance_type)}</div>
//             },
//             {
//                 header: 'Compliance Frequency',
//                 enableSorting: false,
//                 accessorKey: 'compliance_frequency',
//                 cell: ({ row }) => <div className="w-40">{formatDisplayValue(row.original.compliance_frequency)}</div>
//             },
//             {
//                 header: 'Criticality',
//                 enableSorting: false,
//                 accessorKey: 'criticality',
//                 cell: ({ row }) => (
//                     <div className={`w-24 ${
//                         row.original.criticality === 'High' ? 'text-red-500 font-semibold' : 
//                         row.original.criticality === 'Medium' ? 'text-yellow-500 font-semibold' : 'text-green-500 font-semibold'
//                     }`}>
//                         {formatDisplayValue(row.original.criticality)}
//                     </div>
//                 )
//             },
//             {
//                 header: 'First Due Date',
//                 enableSorting: false,
//                 accessorKey: 'due_dates',
//                 cell: ({ row }) => <div className="w-40">{row.original.due_dates.first_due_date}</div>
//             },
//             {
//                 header: 'Second Due Date',
//                 enableSorting: false,
//                 accessorKey: 'due_dates',
//                 cell: ({ row }) => <div className="w-40">{row.original.due_dates.second_due_date}</div>
//             },
//             {
//                 header: 'Third Due Date',
//                 enableSorting: false,
//                 accessorKey: 'due_dates',
//                 cell: ({ row }) => <div className="w-40">{row.original.due_dates.third_due_date}</div>
//             },
//             {
//                 header: 'Last Due Date',
//                 enableSorting: false,
//                 accessorKey: 'due_dates',
//                 cell: ({ row }) => <div className="w-40">{row.original.due_dates.last_due_date}</div>
//             },
            
//             {
//                 header: 'Status',
//                 enableSorting: false,
//                 accessorKey: 'is_active',
//                 cell: ({ row }) => (
//                     <div className={`w-20 ${row.original.is_active ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}`}>
//                         {row.original.is_active ? 'Active' : 'Inactive'}
//                     </div>
//                 )
//             },
//              {
//         header: 'Actions',
//         id: 'actions',
//         cell: ({ row }) => (
//           <div className="flex items-center gap-2">
//             {/* <Tooltip title="Edit">
//               <Button
//                 size="sm"
//                 onClick={() =>
//                   navigate('/edit-compliance', {
//                     state: { complianceSetupId: row.original.id },
//                   })
//                 }
//                 icon={<MdEdit />}
//                 className="text-blue-500"
//               />
//             </Tooltip> */}

//             {row.original.is_active ? (
//               <Tooltip title="Disable">
//                 <Button
//                   size="sm"
//                   icon={<FiXCircle />}
//                   className="text-red-500"
//                   onClick={() => {
//                     setSelectedCompliance(row.original)
//                     setDeleteDialogOpen(true)
//                   }}
//                   disabled={isTogglingStatus}
//                 />
//               </Tooltip>
//             ) : (
//               <Tooltip title="Enable">
//                 <Button
//                   size="sm"
//                   icon={<IoMdCheckmarkCircleOutline />}
//                   className="text-green-500"
//                   onClick={() => toggleComplianceStatus(row.original.id, true)}
//                   loading={isTogglingStatus}
//                 />
//               </Tooltip>
//             )}
//           </div>
//         ),
//       },
//     ],
//     [navigate, isTogglingStatus, states]
//   )

//   const handleDisableConfirm = () => {
//     if (selectedCompliance) {
//       toggleComplianceStatus(selectedCompliance.id, false);
//       setDeleteDialogOpen(false);
//     }
//   };

//   return (
//     <div className='relative'>
//       {data.length === 0 && !loading ? (
//         <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
//           <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
//           <p className="text-center">No Data Available</p>
//         </div>
//       ) : (
//         <DataTable
//           columns={columns}
//           data={data}
//           loading={loading}
//           skeletonAvatarColumns={[0]}
//           skeletonAvatarProps={{ className: 'rounded-md' }}
//           pagingData={{
//             total: pagination.total,
//             pageIndex: pagination.pageIndex,
//             pageSize: pagination.pageSize,
//           }}
//           onPaginationChange={onPageChange}
//           onSelectChange={onPageSizeChange}
//           stickyHeader={true}
//           stickyFirstColumn={true}
//           stickyLastColumn={true}
//         />
//       )}

//       <Dialog
//         isOpen={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         shouldCloseOnOverlayClick={false}
//       >
//         <h5 className="mb-4">Confirm Disable</h5>
//         <p>Are you sure you want to disable this Compliance?</p>
//         <div className="text-right mt-6">
//           <Button
//             className="ltr:mr-2 rtl:ml-2"
//             variant="plain"
//             onClick={() => setDeleteDialogOpen(false)}
//           >
//             Cancel
//           </Button>
//           <Button 
//             variant="solid" 
//             onClick={handleDisableConfirm}
//             loading={isTogglingStatus}
//           >
//             Confirm
//           </Button>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default AuditTrackerTable;



















import React, { useState, useMemo } from 'react';
import { Button, Dialog, Tooltip, Notification, toast } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import { FiXCircle } from 'react-icons/fi';
import { DataTable } from '@/components/shared';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { ComplianceData, ReferenceData } from '@/@types/compliance';

interface AuditTrackerTableProps {
  data: ComplianceData[];
  loading: boolean;
  onStatusToggle: (id: number, is_active: boolean) => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
    total: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  states: ReferenceData[];
}

const AuditTrackerTable = ({
  data,
  loading,
  onStatusToggle,
  pagination,
  onPageChange,
  onPageSizeChange,
  states
}: AuditTrackerTableProps) => {
  const navigate = useNavigate();
  const [selectedCompliance, setSelectedCompliance] = useState<ComplianceData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatDisplayValue = (value: string) => {
    if (!value) return '';
    
    if (value.includes('_')) {
      return value.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const columns = useMemo(
    () => [
      {
        header: 'Function',
        enableSorting: false,
        accessorKey: 'function',
        cell: ({ row }) => <div className="w-40">{formatDisplayValue(row.original.function)}</div>
      },
      {
        header: 'Applicable',
        enableSorting: false,
        accessorKey: 'applicable',
        cell: ({ row }) => <div className="w-40">{formatDisplayValue(row.original.applicable)}</div>
      },
      {
        header: 'State',
        enableSorting: false,
        accessorKey: 'state_id',
        cell: ({ row }) => {
          const stateName = row.original.state_id 
            ? states.find(state => state.id === row.original.state_id)?.name 
            : (row.original.applicable === 'central' ? 'Central' : 'N/A');
          return <div className="w-40">{stateName}</div>;
        }
      },
      {
        header: 'Legislation Act',
        enableSorting: false,
        accessorKey: 'legislation_act',
        cell: ({ row }) => <Tooltip title={formatDisplayValue(row.original.legislation_act)}>
          <div className="w-52 truncate">{formatDisplayValue(row.original.legislation_act)}</div>
        </Tooltip>
      },
      {
        header: 'Compliance Categorization',
        enableSorting: false,
        accessorKey: 'compliance_categorization',
        cell: ({ row }) => <div className="w-40">{formatDisplayValue(row.original.compliance_categorization)}</div>
      },
      {
        header: 'Compliance Header',
        enableSorting: false,
        accessorKey: 'compliance_header',
        cell: ({ row }) => <Tooltip title={formatDisplayValue(row.original.compliance_header)}>
          <div className="w-48 truncate">{formatDisplayValue(row.original.compliance_header)}</div>
        </Tooltip>
      },
      {
        header: 'Compliance Description',
        enableSorting: false,
        accessorKey: 'compliance_description',
        cell: ({ row }) => <Tooltip title={formatDisplayValue(row.original.compliance_description)}>
          <div className="w-64 truncate">{formatDisplayValue(row.original.compliance_description)}</div>
        </Tooltip>
      },
      {
        header: 'Penalty Type',
        enableSorting: false,
        accessorKey: 'penalty_type',
        cell: ({ row }) => <div className="w-32">{formatDisplayValue(row.original.penalty_type)}</div>
      },
      {
        header: 'Penalty Description',
        enableSorting: false,
        accessorKey: 'penalty_description',
        cell: ({ row }) => <Tooltip title={formatDisplayValue(row.original.penalty_description)}>
          <div className="w-48 truncate">{formatDisplayValue(row.original.penalty_description)}</div>
        </Tooltip>
      },
      {
        header: 'Compliance Applicability',
        enableSorting: false,
        accessorKey: 'compliance_applicability',
        cell: ({ row }) => <div className="w-40">{formatDisplayValue(row.original.compliance_applicability)}</div>
      },
      {
        header: 'Compliance Reference',
        enableSorting: false,
        accessorKey: 'compliance_reference',
        cell: ({ row }) => <Tooltip title={formatDisplayValue(row.original.compliance_reference)}>
          <div className="w-48 truncate">{formatDisplayValue(row.original.compliance_reference)}</div>
        </Tooltip>
      },
      {
        header: 'Compliance Type',
        enableSorting: false,
        accessorKey: 'compliance_type',
        cell: ({ row }) => <div className="w-40">{formatDisplayValue(row.original.compliance_type)}</div>
      },
      {
        header: 'Compliance Frequency',
        enableSorting: false,
        accessorKey: 'compliance_frequency',
        cell: ({ row }) => <div className="w-40">{formatDisplayValue(row.original.compliance_frequency)}</div>
      },
      {
        header: 'Criticality',
        enableSorting: false,
        accessorKey: 'criticality',
        cell: ({ row }) => (
          <div className={`w-24 ${
            row.original.criticality === 'High' ? 'text-red-500 font-semibold' : 
            row.original.criticality === 'Medium' ? 'text-yellow-500 font-semibold' : 'text-green-500 font-semibold'
          }`}>
            {formatDisplayValue(row.original.criticality)}
          </div>
        )
      },
      {
        header: 'First Due Date',
        enableSorting: false,
        accessorKey: 'due_dates',
        cell: ({ row }) => <div className="w-40">{row.original.due_dates.first_due_date}</div>
      },
      {
        header: 'Second Due Date',
        enableSorting: false,
        accessorKey: 'due_dates',
        cell: ({ row }) => <div className="w-40">{row.original.due_dates.second_due_date}</div>
      },
      {
        header: 'Third Due Date',
        enableSorting: false,
        accessorKey: 'due_dates',
        cell: ({ row }) => <div className="w-40">{row.original.due_dates.third_due_date}</div>
      },
      {
        header: 'Last Due Date',
        enableSorting: false,
        accessorKey: 'due_dates',
        cell: ({ row }) => <div className="w-40">{row.original.due_dates.last_due_date}</div>
      },
      {
        header: 'Status',
        enableSorting: false,
        accessorKey: 'is_active',
        cell: ({ row }) => (
          <div className={`w-20 ${row.original.is_active ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}`}>
            {row.original.is_active ? 'Active' : 'Inactive'}
          </div>
        )
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {/* <Tooltip title="Edit">
              <Button
                size="sm"
                onClick={() =>
                  navigate('/edit-compliance', {
                    state: { complianceSetupId: row.original.id },
                  })
                }
                icon={<MdEdit />}
                className="text-blue-500"
              />
            </Tooltip> */}

            {row.original.is_active ? (
              <Tooltip title="Disable">
                <Button
                  size="sm"
                  icon={<FiXCircle />}
                  className="text-red-500"
                  onClick={() => {
                    setSelectedCompliance(row.original)
                    setDeleteDialogOpen(true)
                  }}
                  disabled={loading}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Enable">
                <Button
                  size="sm"
                  icon={<IoMdCheckmarkCircleOutline />}
                  className="text-green-500"
                  onClick={() => onStatusToggle(row.original.id, true)}
                  loading={loading}
                />
              </Tooltip>
            )}
          </div>
        ),
      },
    ],
    [navigate, states, loading]
  );

  const handleDisableConfirm = async () => {
    if (selectedCompliance) {
      try {
        await onStatusToggle(selectedCompliance.id, false);
        setDeleteDialogOpen(false);
      } catch (error) {
        toast.push(
          <Notification title="Error" type="error">
            Failed to disable compliance
          </Notification>
        );
      }
    }
  };

  return (
    <div className='relative'>
      {data.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
          <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
          <p className="text-center">No Data Available</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          skeletonAvatarColumns={[0]}
          skeletonAvatarProps={{ className: 'rounded-md' }}
          pagingData={{
            total: pagination.total,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          }}
          onPaginationChange={onPageChange}
          onSelectChange={onPageSizeChange}
          stickyHeader={true}
          stickyFirstColumn={true}
          stickyLastColumn={true}
        />
      )}

      <Dialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        shouldCloseOnOverlayClick={false}
      >
        <h5 className="mb-4">Confirm Disable</h5>
        <p>Are you sure you want to disable this Compliance?</p>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="solid" 
            onClick={handleDisableConfirm}
            loading={loading}
          >
            Confirm
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default AuditTrackerTable;