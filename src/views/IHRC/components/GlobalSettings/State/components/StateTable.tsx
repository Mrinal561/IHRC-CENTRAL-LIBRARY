import React, { useMemo } from 'react';
import { Button, Dialog, Tooltip, Pagination, Notification, toast } from '@/components/ui';
import { MdEdit } from 'react-icons/md';
import DataTable, { ColumnDef } from '@/components/shared/DataTable';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import DatePicker from '@/components/ui/DatePicker';

interface StateData {
  id: string;
  stateName: string;
  ptEcFrequency: string;
  ptRcFrequency: string;
  ptEcDueDate: Date | null;
  ptRcDueDate: Date | null;
}

interface StateTableProps {
  stateData: StateData[];
  setStateData: React.Dispatch<React.SetStateAction<StateData[]>>;
}

const frequencyOptions = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'half-yearly', label: 'Half Yearly' },
  { value: 'monthly', label: 'Monthly' },
];

const StateTable: React.FC<StateTableProps> = ({ stateData, setStateData }) => {
  const [editDialogIsOpen, setEditDialogIsOpen] = React.useState(false);
  const [itemToEdit, setItemToEdit] = React.useState<StateData | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getFrequencyLabel = (value: string) => {
    const option = frequencyOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const columns: ColumnDef<StateData>[] = useMemo(
    () => [
      {
        header: 'State Name',
        accessorKey: 'stateName',
      },
      {
        header: 'PT EC Frequency',
        accessorKey: 'ptEcFrequency',
        cell: ({ getValue }) => getFrequencyLabel(getValue() as string),
      },
      {
        header: 'PT RC Frequency',
        accessorKey: 'ptRcFrequency',
        cell: ({ getValue }) => getFrequencyLabel(getValue() as string),
      },
      {
        header: 'PT EC Due Date',
        accessorKey: 'ptEcDueDate',
        cell: ({ getValue }) => formatDate(getValue() as Date),
      },
      {
        header: 'PT RC Due Date',
        accessorKey: 'ptRcDueDate',
        cell: ({ getValue }) => formatDate(getValue() as Date),
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

  const openEditDialog = (item: StateData) => {
    setItemToEdit(item);
    setEditDialogIsOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogIsOpen(false);
    setItemToEdit(null);
  };

  const handleEditConfirm = () => {
    if (itemToEdit) {
      
      toast.push(
        <Notification
          title="Success"
          type="success"
        >
          The item has been updated successfully.
        </Notification>
      );

      handleDialogClose();
    }
  };

  const handleInputChange = (name: string, value: string | Date | null | React.ChangeEvent<HTMLInputElement>) => {
    if (value === null) {
      // Handle null value (e.g., when clearing a date picker)
      setItemToEdit(prevState => ({
        ...prevState!,
        [name]: null
      }));
    } else if (typeof value === 'object' && 'target' in value) {
      // This is an event object from OutlinedInput
      setItemToEdit(prevState => ({
        ...prevState!,
        [name]: value.target.value
      }));
    } else {
      // This is a direct value from OutlinedSelect or DatePicker
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
        data={stateData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        loading={false}
        stickyHeader={true}
        stickyFirstColumn={true}
        stickyLastColumn={true}
      />

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(stateData.length / pageSize)}
          onChange={onPaginationChange}
        />
      </div>

      <Dialog isOpen={editDialogIsOpen} onClose={handleDialogClose}>
        <h5 className="mb-4">Edit State</h5>
        <div className='flex flex-col gap-4'>
          <OutlinedInput 
            label="State Name"
            value={itemToEdit?.stateName || ''}
            onChange={(e) => handleInputChange('stateName', e)}
          />
          <OutlinedSelect 
            label="PT EC Frequency"
            options={frequencyOptions}
            value={itemToEdit?.ptEcFrequency || ''}
            onChange={(value) => handleInputChange('ptEcFrequency', value)}
          />
          <OutlinedSelect 
            label="PT RC Frequency"
            options={frequencyOptions}
            value={itemToEdit?.ptRcFrequency || ''}
            onChange={(value) => handleInputChange('ptRcFrequency', value)}
          />
          <DatePicker 
          placeholder='PT EC Due Date'
            value={itemToEdit?.ptEcDueDate}
            onChange={(date) => handleInputChange('ptEcDueDate', date)}
          />
          <DatePicker 
          
          placeholder='PT RC Due Date'
            value={itemToEdit?.ptRcDueDate}
            onChange={(date) => handleInputChange('ptRcDueDate', date)}
          />
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

export default StateTable;