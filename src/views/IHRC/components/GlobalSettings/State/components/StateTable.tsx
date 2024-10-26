import React, { useMemo } from 'react';
import { Button, Dialog, Tooltip, Notification, toast } from '@/components/ui';
import { MdEdit, MdDelete } from 'react-icons/md';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import DatePicker from '@/components/ui/DatePicker';
// import { StateData } from '@/store/slices/stateSlice';
import { StateData } from '@/store/slices/state/stateSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { useAppDispatch } from '@/store';

interface StateTableProps {
  stateData: StateData[];
  loading: boolean;
  onUpdate: (id: string, data: Partial<StateData>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const frequencyOptions = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'half-yearly', label: 'Half Yearly' },
  { value: 'monthly', label: 'Monthly' },
];

const StateTable = ({ 
  stateData,
  loading,
  onUpdate,
  onDelete
}:StateTableProps):JSX.Element  => {
  const dispatch = useAppDispatch();  
  const [editDialogIsOpen, setEditDialogIsOpen] = React.useState(false);
  const [itemToEdit, setItemToEdit] = React.useState<StateData | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getFrequencyLabel = (value: string) => {
    const option = frequencyOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const columns: ColumnDef<StateData>[] = useMemo(
    () => [
      {
        header: 'State Name',
        accessorKey: 'name',
      },
      {
        header: 'PT EC Frequency',
        accessorKey: 'ptec_frequency',
        cell: ({ getValue }) => getFrequencyLabel(getValue() as string),
      },
      {
        header: 'PT RC Frequency',
        accessorKey: 'ptrc_frequency',
        cell: ({ getValue }) => getFrequencyLabel(getValue() as string),
      },
      {
        header: 'LWF Frequency',
        accessorKey: 'lwf_frequency',
        cell: ({ getValue }) => getFrequencyLabel(getValue() as string),
      },
      {
        header: 'Payment Mode',
        accessorKey: 'paymentFrequency',
        cell: ({ getValue }) => getValue() === 'online' ? 'Online' : 'Offline',
      },
      {
        header: 'PT EC Due Dates',
        accessorKey: 'ptEcDueDates',
        cell: ({ row }) => (
          <div>
            <div>First: {formatDate(row.original.ptEcFirstDueDate)}</div>
            <div>Last: {formatDate(row.original.ptEcLastDueDate)}</div>
          </div>
        ),
      },
      {
        header: 'PT RC Due Dates',
        accessorKey: 'ptRcDueDates',
        cell: ({ row }) => (
          <div>
            <div>First: {formatDate(row.original.ptRcFirstDueDate)}</div>
            <div>Last: {formatDate(row.original.ptRcLastDueDate)}</div>
          </div>
        ),
      },
      {
        header: 'LWF Due Dates',
        accessorKey: 'lwfDueDates',
        cell: ({ row }) => (
          <div>
            <div>First: {formatDate(row.original.lwfFirstDueDate)}</div>
            <div>Last: {formatDate(row.original.lwfLastDueDate)}</div>
          </div>
        ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Tooltip title="Edit">
              <Button
                size="sm"
                onClick={() => openEditDialog(row.original)}
                icon={<MdEdit />}
                className="text-blue-500"
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                size="sm"
                onClick={() => openDeleteConfirm(row.original.id)}
                icon={<MdDelete />}
                className="text-red-500"
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    []
  );

  const openEditDialog = (item: StateData) => {
    setItemToEdit(item);
    setEditDialogIsOpen(true);
  };

  const openDeleteConfirm = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogIsOpen(false);
    setItemToEdit(null);
  };

  const handleDelete = async () => {
    if (itemToDelete) {
      try {
        await onDelete(itemToDelete);
        toast.push(
          <Notification title="Success" type="success">
            State deleted successfully
          </Notification>
        );
        setDeleteConfirmOpen(false);
        setItemToDelete(null);
      } catch (error) {
        // Error handling is done at the parent level
      }
    }
  };

  const handleEditConfirm = async () => {
    if (itemToEdit) {
      try {
        await onUpdate(itemToEdit.id, itemToEdit);
        toast.push(
          <Notification title="Success" type="success">
            State updated successfully
          </Notification>
        );
        handleDialogClose();
      } catch (error) {
        // Error handling is done at the parent level
      }
    }
  };

  const handleInputChange = (name: string, value: string | Date | null | React.ChangeEvent<HTMLInputElement>) => {
    if (!itemToEdit) return;

    if (value === null) {
      setItemToEdit(prev => ({
        ...prev!,
        [name]: null
      }));
    } else if (typeof value === 'object' && 'target' in value) {
      setItemToEdit(prev => ({
        ...prev!,
        [name]: value.target.value
      }));
    } else {
      setItemToEdit(prev => {
        const updated = { ...prev!, [name]: value };
        if (name.includes('Frequency')) {
          const lastDueDateField = name.replace('Frequency', 'LastDueDate');
          if (value === 'yearly' || value === 'monthly') {
            updated[lastDueDateField] = null;
          }
        }
        return updated;
      });
    }
  };

  return (
    <div className="relative">
      <DataTable
        columns={columns}
        data={stateData}
        loading={loading}
        stickyHeader={true}
        stickyFirstColumn={true}
        stickyLastColumn={true}
      />

      {/* Edit Dialog */}
      <Dialog isOpen={editDialogIsOpen} onClose={handleDialogClose}>
        <h5 className="mb-4">Edit State</h5>
        <div className='flex flex-col gap-4'>
          <OutlinedInput 
            label="State Name"
            value={itemToEdit?.name || ''}
            onChange={(e) => handleInputChange('stateName', e)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <OutlinedSelect 
                label="PT EC Frequency"
                options={frequencyOptions}
                value={itemToEdit?.ptec_frequency || ''}
                onChange={(value) => handleInputChange('ptec_frequency', value)}
              />
              <DatePicker 
                placeholder="PT EC First Due Date"
                value={itemToEdit?.ptEcFirstDueDate}
                onChange={(date) => handleInputChange('ptEcFirstDueDate', date)}
              />
              <DatePicker 
                placeholder="PT EC Last Due Date"
                value={itemToEdit?.ptEcLastDueDate}
                onChange={(date) => handleInputChange('ptEcLastDueDate', date)}
                disabled={itemToEdit?.ptec_frequency !== 'half-yearly'}
              />
            </div>
            <div>
              <OutlinedSelect 
                label="PT RC Frequency"
                options={frequencyOptions}
                value={itemToEdit?.ptrc_frequency || ''}
                onChange={(value) => handleInputChange('ptrc_frequency', value)}
              />
              <DatePicker 
                placeholder="PT RC First Due Date"
                value={itemToEdit?.ptRcFirstDueDate}
                onChange={(date) => handleInputChange('ptRcFirstDueDate', date)}
              />
              <DatePicker 
                placeholder="PT RC Last Due Date"
                value={itemToEdit?.ptRcLastDueDate}
                onChange={(date) => handleInputChange('ptRcLastDueDate', date)}
                disabled={itemToEdit?.ptrc_frequency !== 'half-yearly'}
              />
            </div>
          </div>
          <div>
            <OutlinedSelect 
              label="LWF Frequency"
              options={frequencyOptions}
              value={itemToEdit?.lwf_frequency || ''}
              onChange={(value) => handleInputChange('lwf_frequency', value)}
            />
            <DatePicker 
              placeholder="LWF First Due Date"
              value={itemToEdit?.lwfFirstDueDate}
              onChange={(date) => handleInputChange('lwfFirstDueDate', date)}
            />
            <DatePicker 
              placeholder="LWF Last Due Date"
              value={itemToEdit?.lwfLastDueDate}
              onChange={(date) => handleInputChange('lwfLastDueDate', date)}
              disabled={itemToEdit?.lwf_frequency !== 'half-yearly'}
            />
          </div>
        </div>
        <div className="text-right mt-6">
          <Button variant="plain" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button variant="solid" onClick={handleEditConfirm}>
            Save Changes
          </Button>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        isOpen={deleteConfirmOpen} 
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <h5 className="mb-4">Confirm Delete</h5>
        <p>Are you sure you want to delete this state? This action cannot be undone.</p>
        <div className="text-right mt-6">
          <Button variant="plain" onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="solid" className="bg-red-500" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default StateTable;