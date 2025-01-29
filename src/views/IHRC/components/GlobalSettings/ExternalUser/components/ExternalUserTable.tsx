// import React, { useMemo, useState } from 'react';
// import { Button, Dialog, Tooltip } from '@/components/ui';
// import { FiTrash } from 'react-icons/fi';
// import DataTable from '@/components/shared/DataTable';

// interface ExternalUserTableProps {
//   data: Array<{
//     id: number;
//     name: string;
//     email: string;
//     company_name: string;
//     contact_number: string;
//     created_at: string;
//     updated_at: string;
//   }>;
//   loading: boolean;
// }

// const ExternalUserTable: React.FC<ExternalUserTableProps> = ({
//   data,
//   loading,
// }) => {
//   const [dialogIsOpen, setDialogIsOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<number | null>(null);

//   const handleDelete = (id: number) => {
//     setItemToDelete(id);
//     setDialogIsOpen(true);
//   };

//   const handleDialogClose = () => {
//     setDialogIsOpen(false);
//     setItemToDelete(null);
//   };

//   const handleDialogConfirm = () => {
//     if (itemToDelete) {
//       console.log(`Deleting user ${itemToDelete}`);
//       // Add your delete logic here
//     }
//     setDialogIsOpen(false);
//     setItemToDelete(null);
//   };

//   const columns = useMemo(
//     () => [
//       {
//         header: 'Name',
//         enableSorting: false,
//         accessorKey: 'name',
//         cell: (props) => (
//           <div className="w-36 text-start">{props.getValue()}</div>
//         ),
//       },
//       {
//         header: 'Email',
//         enableSorting: false,
//         accessorKey: 'email',
//         cell: (props) => (
//           <div className="w-40 text-start">{props.getValue()}</div>
//         ),
//       },
//       {
//         header: 'Phone Number',
//         enableSorting: false,
//         accessorKey: 'contact_number',
//         cell: (props) => (
//           <div className="w-36 text-start">{props.getValue()}</div>
//         ),
//       },
//       {
//         header: 'Company',
//         enableSorting: false,
//         accessorKey: 'company_name',
//         cell: (props) => (
//           <div className="w-36 text-start">{props.getValue()}</div>
//         ),
//       },
//       {
//         header: 'Actions',
//         enableSorting: false,
//         id: 'actions',
//         cell: ({ row }) => (
//           <div className="flex items-center gap-2">
//             <Tooltip title="Delete">
//               <Button
//                 size="sm"
//                 variant="plain"
//                 onClick={() => handleDelete(row.original.id)}
//                 icon={<FiTrash className="text-red-500" />}
//               />
//             </Tooltip>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   return (
//     <div className="relative">
//       <DataTable
//         columns={columns}
//         data={data}
//         loading={loading}
//         skeletonAvatarColumns={[0]}
//         skeletonAvatarProps={{ className: 'rounded-md' }}
//         stickyHeader={true}
//       />

//       <Dialog
//         isOpen={dialogIsOpen}
//         onClose={handleDialogClose}
//         onRequestClose={handleDialogClose}
//       >
//         <h5 className="mb-4">Confirm Deletion</h5>
//         <p>Are you sure you want to delete this user?</p>
//         <div className="text-right mt-6">
//           <Button
//             className="ltr:mr-2 rtl:ml-2"
//             variant="plain"
//             onClick={handleDialogClose}
//           >
//             Cancel
//           </Button>
//           <Button variant="solid" onClick={handleDialogConfirm}>
//             Delete
//           </Button>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default ExternalUserTable;

// import React, { useMemo, useState } from 'react';
// import { Button, Dialog, Tooltip } from '@/components/ui';
// import { FiTrash } from 'react-icons/fi';
// import DataTable from '@/components/shared/DataTable';
// import { showErrorNotification } from '@/components/ui/ErrorMessage';
// import { useDispatch } from 'react-redux';
// import { deleteExternalUser } from '@/store/slices/externaluser/externalUserSlice';

// interface PaginationProps {
//   total: number;
//   pageIndex: number;
//   pageSize: number;
//   onPaginationChange: (page: number) => void;
//   onPageSizeChange: (pageSize: number) => void;
// }

// interface ExternalUserTableProps {
//   data: Array<{
//     id: number;
//     name: string;
//     email: string;
//     company_name: string;
//     contact_number: string;
//     created_at: string;
//     updated_at: string;
//   }>;
//   loading: boolean;
//   pagination: {
//     total: number;
//     pageIndex: number;
//     pageSize: number;
//   };
//   onPaginationChange: (page: number) => void;
//   onPageSizeChange: (pageSize: number) => void;
//   onRefresh?: () => void;
// }

// const ExternalUserTable: React.FC<ExternalUserTableProps> = ({
//   data,
//   loading,
//   pagination,
//   onPaginationChange,
//     onPageSizeChange,
//     onRefresh
// }) => {
//   const [dialogIsOpen, setDialogIsOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<number | null>(null);
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
//     const dispatch = useDispatch();
//   const handleDelete = (id: number) => {
//     setItemToDelete(id);
//     setDialogIsOpen(true);
//   };

//   const handleDialogClose = () => {
//     setDialogIsOpen(false);
//     setItemToDelete(null);
//   };

//   const handleDialogConfirm = () => {
//     if (itemToDelete) {
//       console.log(`Deleting user ${itemToDelete}`);
//       dispatch(deleteExternalUser(itemToDelete)).unwrap().catch((error: any) => {
//         // Handle different error formats
//         if (error.response?.data?.message) {
//             // API error response
//             showErrorNotification(error.response.data.message);
//         } else if (error.message) {
//             // Regular error object
//             showErrorNotification(error.message);
//         } else if (Array.isArray(error)) {
//             // Array of error messages
//             showErrorNotification(error);
//         } else {
//             // Fallback error message
//             showErrorNotification(error);
//         }
//         throw error; // Re-throw to prevent navigation
//     });

//       setDeleteConfirmOpen(false);
//       if (onRefresh) {
//         onRefresh();
//       }
//     }
//     setDialogIsOpen(false);
//     setItemToDelete(null);
//   };

//   const columns = useMemo(
//     () => [
//       {
//         header: 'Name',
//         enableSorting: false,
//         accessorKey: 'name',
//         cell: (props) => (
//           <div className="w-36 text-start">{props.getValue()}</div>
//         ),
//       },
//       {
//         header: 'Email',
//         enableSorting: false,
//         accessorKey: 'email',
//         cell: (props) => (
//           <div className="w-40 text-start">{props.getValue()}</div>
//         ),
//       },
//       {
//         header: 'Phone Number',
//         enableSorting: false,
//         accessorKey: 'contact_number',
//         cell: (props) => (
//           <div className="w-36 text-start">{props.getValue()}</div>
//         ),
//       },
//       {
//         header: 'Company',
//         enableSorting: false,
//         accessorKey: 'company_name',
//         cell: (props) => (
//           <div className="w-36 text-start">{props.getValue()}</div>
//         ),
//       },
//       {
//         header: 'Actions',
//         enableSorting: false,
//         id: 'actions',
//         cell: ({ row }) => (
//           <div className="flex items-center gap-2">
//             <Tooltip title="Delete">
//               <Button
//                 size="sm"
//                 variant="plain"
//                 onClick={() => handleDelete(row.original.id)}
//                 icon={<FiTrash className="text-red-500" />}
//               />
//             </Tooltip>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   return (
//     <div className="relative">
//       <DataTable
//         columns={columns}
//         data={data}
//         loading={loading}
//         skeletonAvatarColumns={[0]}
//         skeletonAvatarProps={{ className: 'rounded-md' }}
//         stickyHeader={true}
//         pagingData={{
//             total: pagination.total,
//             pageIndex: pagination.pageIndex,
//             pageSize: pagination.pageSize,
//         }}
//         onPaginationChange={onPaginationChange}
//         onSelectChange={onPageSizeChange}
//         // pageSizeOptions={[10, 20, 50, 100]}
//       />

//       <Dialog
//         isOpen={dialogIsOpen}
//         onClose={handleDialogClose}
//         onRequestClose={handleDialogClose}
//       >
//         <h5 className="mb-4">Confirm Deletion</h5>
//         <p>Are you sure you want to delete this user?</p>
//         <div className="text-right mt-6">
//           <Button
//             className="ltr:mr-2 rtl:ml-2"
//             variant="plain"
//             onClick={handleDialogClose}
//           >
//             Cancel
//           </Button>
//           <Button variant="solid" onClick={handleDialogConfirm}>
//             Delete
//           </Button>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default ExternalUserTable;

import React, { useMemo, useState } from 'react';
import { Button, Dialog, Tooltip } from '@/components/ui';
import { FiTrash } from 'react-icons/fi';
import DataTable from '@/components/shared/DataTable';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import { useDispatch } from 'react-redux';
import { deleteExternalUser } from '@/store/slices/externaluser/externalUserSlice';
import { HiOutlineViewGrid } from 'react-icons/hi';

interface ExternalUserTableProps {
  data: Array<{
    id: number;
    name: string;
    email: string;
    company_name: string;
    contact_number: string;
    created_at: string;
    updated_at: string;
  }>;
  loading: boolean;
  pagination: {
    total: number;
    pageIndex: number;
    pageSize: number;
  };
  onPaginationChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRefresh: (page: number, pageSize: number) => void;
  onDeleteSuccess: () => void;
}

const ExternalUserTable: React.FC<ExternalUserTableProps> = ({
  data,
  loading,
  pagination,
  onPaginationChange,
  onPageSizeChange,
  onRefresh,
  onDeleteSuccess
}) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setDialogIsOpen(true);
  };

  const handleDialogClose = () => {
    if (!deleteLoading) {
      setDialogIsOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDialogConfirm = async () => {
    if (itemToDelete && !deleteLoading) {
      setDeleteLoading(true);
      try {
        await dispatch(deleteExternalUser(itemToDelete)).unwrap();
        onDeleteSuccess();
      } catch (error: any) {
        if (error.response?.data?.message) {
          showErrorNotification(error.response.data.message);
        } else if (error.message) {
          showErrorNotification(error.message);
        } else if (Array.isArray(error)) {
          showErrorNotification(error);
        } else {
          showErrorNotification('Failed to delete user');
        }
      } finally {
        setDeleteLoading(false);
        setDialogIsOpen(false);
        setItemToDelete(null);
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        enableSorting: false,
        accessorKey: 'name',
        cell: (props) => (
          <div className="w-36 text-start">{props.getValue()}</div>
        ),
      },
      {
        header: 'Email',
        enableSorting: false,
        accessorKey: 'email',
        cell: (props) => (
          <div className="w-40 text-start">{props.getValue()}</div>
        ),
      },
      {
        header: 'Phone Number',
        enableSorting: false,
        accessorKey: 'contact_number',
        cell: (props) => (
          <div className="w-36 text-start">{props.getValue()}</div>
        ),
      },
      {
        header: 'Company',
        enableSorting: false,
        accessorKey: 'company_name',
        cell: (props) => (
          <div className="w-36 text-start">{props.getValue()}</div>
        ),
      },
      {
        header: 'Actions',
        enableSorting: false,
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Tooltip title="Delete">
              <Button
                size="sm"
                variant="plain"
                disabled={deleteLoading}
                onClick={() => handleDelete(row.original.id)}
                icon={<FiTrash />}
                 className="text-red-500"
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    [deleteLoading]
  );

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
        <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
        <p className="text-center">
          No data available 
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ className: 'rounded-md' }}
        stickyHeader={true}
        pagingData={{
          total: pagination.total,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
        }}
        onPaginationChange={onPaginationChange}
        onSelectChange={onPageSizeChange}
      />

      <Dialog
        isOpen={dialogIsOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-4">Confirm Deletion</h5>
        <p>Are you sure you want to delete this user?</p>
        <div className="flex justify-end items-center mt-6 gap-2">
          <Button
            size="sm"
            variant="plain"
            onClick={handleDialogClose}
            disabled={deleteLoading}
            className="min-w-[72px] h-9"
          >
            Cancel
          </Button>
          <Button 
            size="sm"
            variant="solid" 
            onClick={handleDialogConfirm}
            loading={deleteLoading}
            className="min-w-[72px] h-9"
          >
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default ExternalUserTable;