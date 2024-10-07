import React, { useMemo } from 'react';
import { Button, Dialog, Tooltip, Pagination, Notification, toast } from '@/components/ui';
import { MdEdit } from 'react-icons/md';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import OutlinedInput from '@/components/ui/OutlinedInput';

interface DistrictData {
  id: string;
  stateName: string;
  districtName: string;
}

interface DistrictTableProps {
  districtData: DistrictData[];
  setDistrictData: React.Dispatch<React.SetStateAction<DistrictData[]>>;
}

const DistrictTable: React.FC<DistrictTableProps> = ({ districtData, setDistrictData }) => {
  const [editDialogIsOpen, setEditDialogIsOpen] = React.useState(false);
  const [itemToEdit, setItemToEdit] = React.useState<DistrictData | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);

  const columns: ColumnDef<DistrictData>[] = useMemo(
    () => [
      {
        header: 'State Name',
        accessorKey: 'stateName',
      },
      {
        header: 'District Name',
        accessorKey: 'districtName',
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <Tooltip title="Edit">
            <Button
              size="sm"
              onClick={() => openEditDialog(row.original)}
              icon={<MdEdit />}
              className="text-blue-500"
            />
          </Tooltip>
        ),
      },
    ],
    []
  );

  const openEditDialog = (item: DistrictData) => {
    setItemToEdit(item);
    setEditDialogIsOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogIsOpen(false);
    setItemToEdit(null);
  };

  const handleEditConfirm = () => {
    if (itemToEdit) {
      const updatedData = districtData.map(item => 
        item.id === itemToEdit.id ? itemToEdit : item
      );
      setDistrictData(updatedData);
      
      toast.push(
        <Notification
          title="Success"
          type="success"
        >
          The district has been updated successfully.
        </Notification>
      );

      handleDialogClose();
    }
  };

  const handleInputChange = (name: string, value: string | React.ChangeEvent<HTMLInputElement>) => {
    if (typeof value === 'object' && 'target' in value) {
      // This is an event object from OutlinedInput
      setItemToEdit(prevState => ({
        ...prevState!,
        [name]: value.target.value
      }));
    } else {
      // This is a direct value
      setItemToEdit(prevState => ({
        ...prevState!,
        [name]: value
      }));
    }
  };

  const onPaginationChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="relative">
      <DataTable
        columns={columns}
        data={districtData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        loading={false}
        stickyHeader={true}
        stickyFirstColumn={true}
        stickyLastColumn={true}
      />

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(districtData.length / pageSize)}
          onChange={onPaginationChange}
        />
      </div>

      <Dialog isOpen={editDialogIsOpen} onClose={handleDialogClose}>
        <h5 className="mb-4">Edit District</h5>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label>State Name (Not Editable)</label>
            <OutlinedInput 
              label="State Name"
              value={itemToEdit?.stateName || ''}
              disabled={true}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label>District Name</label>
            <OutlinedInput 
              label="District Name"
              value={itemToEdit?.districtName || ''}
              onChange={(e) => handleInputChange('districtName', e)}
            />
          </div>
        </div>
        <div className="text-right mt-6">
          <Button variant="plain" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button variant="solid" onClick={handleEditConfirm}>
            Confirm
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default DistrictTable;