
import React, { useMemo, useState, useEffect } from 'react';
import { Button, Dialog, Tooltip, Notification, toast } from '@/components/ui';
import { MdEdit } from 'react-icons/md';
// import { FiTrash } from 'react-icons/ri';
import OutlinedInput from '@/components/ui/OutlinedInput';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface State {
  id: number;
  name: string;
}

interface DistrictData {
  id: number;
  state_id: number;
  name: string;
  State: State;
}

interface DistrictTableProps {
  districtData: DistrictData[];
  isLoading?: boolean;
  onDataChange: () => void;
}

const DistrictTable: React.FC<DistrictTableProps> = ({
  districtData,
  isLoading = false,
  onDataChange
}) => {
  const [districtTableData, setDistrictTableData] = useState<DistrictData[]>([]);
  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<DistrictData | null>(null);
  const [itemToDelete, setItemToDelete] = useState<DistrictData | null>(null);
  const [editedDistrictName, setEditedDistrictName] = useState('');
  const [tableData, setTableData] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: { order: '', key: '' },
  });

  useEffect(() => {
    fetchDistrictData(1, 10);
  }, []);

  const fetchDistrictData = async (page: number, size: number) => {
    try {
      const response = await httpClient.get(endpoints.district.getAll(), {
        params: {
          page,
          page_size: size
        }
      });
      
      setDistrictTableData(response.data.data);
      setTableData(prev => ({
        ...prev,
        total: response.data.paginate_data.totalResult,
        pageIndex: response.data.paginate_data.page,
      }));
    } catch (error) {
      console.error('Failed to fetch district data:', error);
      showNotification('danger', 'Failed to fetch district data');
    }
  };

  const columns = useMemo<ColumnDef<DistrictData>[]>(
    () => [
      {
        header: 'State Name',
        accessorFn: (row) => row.State.name,
        cell: (props) => (
          <div className="w-48 truncate">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'District Name',
        accessorKey: 'name',
        cell: (props) => (
          <div className="w-48 truncate">{props.getValue() as string}</div>
        ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Tooltip title="Edit District">
              <Button
                size="sm"
                onClick={() => openEditDialog(row.original)}
                icon={<MdEdit />}
                className="text-blue-500"
              />
            </Tooltip>
            {/* <Tooltip title="Delete District">
              <Button
                size="sm"
                onClick={() => openDeleteDialog(row.original)}
                icon={<FiTrash />}
                className="text-red-500"
              />
            </Tooltip> */}
          </div>
        ),
      },
    ],
    []
  );

  const openEditDialog = (district: DistrictData) => {
    setItemToEdit(district);
    setEditedDistrictName(district.name);
    setEditDialogIsOpen(true);
  };

  const openDeleteDialog = (district: DistrictData) => {
    setItemToDelete(district);
    setDeleteDialogIsOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogIsOpen(false);
    setDeleteDialogIsOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
    setEditedDistrictName('');
  };

  const showNotification = (type: 'success' | 'danger', message: string) => {
    toast.push(
      <Notification title={type === 'success' ? 'Success' : 'Error'} type={type}>
        {message}
      </Notification>
    );
  };

  // const handleDeleteConfirm = async () => {
  //   if (itemToDelete?.id) {
  //     try {
  //       await httpClient.delete(endpoints.district.delete(itemToDelete.id));
  //       showNotification('success', 'District deleted successfully');
        
  //       // Recalculate the current page after deletion
  //       const newTotal = tableData.total - 1;
  //       const lastPage = Math.ceil(newTotal / tableData.pageSize);
  //       const newPageIndex = tableData.pageIndex > lastPage ? lastPage : tableData.pageIndex;
        
  //       await fetchDistrictData(newPageIndex, tableData.pageSize);
  //       onDataChange();
  //     } catch (error) {
  //       console.error('Failed to delete district:', error);
  //       showNotification('danger', 'Failed to delete district');
  //     }
  //     handleDialogClose();
  //   }
  // };

  // const handleEditConfirm = async () => {
  //   if (itemToEdit?.id && editedDistrictName.trim()) {
  //     try {
  //       await httpClient.put(endpoints.district.update(itemToEdit.id), {
  //         name: editedDistrictName.trim(),
  //         state_id: itemToEdit.state_id
  //       });
        
  //       showNotification('success', 'District updated successfully');
  //       await fetchDistrictData(tableData.pageIndex, tableData.pageSize);
  //       onDataChange();
  //     } catch (error) {
  //       console.error('Failed to update district:', error);
  //       showNotification('danger', 'Failed to update district');
  //     }
  //     handleDialogClose();
  //   } else {
  //     showNotification('danger', 'Please fill in all required fields');
  //   }
  // };

  const onPaginationChange = (page: number) => {
    setTableData(prev => ({ ...prev, pageIndex: page }));
    fetchDistrictData(page, tableData.pageSize);
  };

  const onSelectChange = (value: number) => {
    setTableData(prev => ({
      ...prev,
      pageSize: Number(value),
      pageIndex: 1,
    }));
    fetchDistrictData(1, value);
  };

  return (
    <div className="relative">
      <DataTable
        columns={columns}
        data={districtTableData}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ className: 'rounded-md' }}
        loading={isLoading}
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

      {/* Edit Dialog */}
      {/* <Dialog
        isOpen={editDialogIsOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-4">Edit District</h5>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <OutlinedInput
              label="State Name"
              value={itemToEdit?.State.name || ''}
            />
          </div>
          <div className="flex flex-col gap-2">
            <OutlinedInput
              label="District Name"
              value={editedDistrictName}
              onChange={(e) => setEditedDistrictName(e.target.value)}
            />
          </div>
        </div>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={handleEditConfirm}>
            Confirm
          </Button>
        </div>
      </Dialog> */}

      {/* Delete Confirmation Dialog */}
      {/* <Dialog
        isOpen={deleteDialogIsOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-4">Confirm Deletion</h5>
        <p>
          Are you sure you want to delete district "{itemToDelete?.name}"? 
          This action cannot be undone.
        </p>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </div>
      </Dialog> */}
    </div>
  );
};

export default DistrictTable;