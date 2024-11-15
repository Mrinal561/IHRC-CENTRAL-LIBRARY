

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '@/components/shared/DataTable';
import { Tooltip, Button, Dialog, Notification, toast } from '@/components/ui';
import { MdEdit } from 'react-icons/md';
import { RiEyeLine } from 'react-icons/ri';
import { FiTrash } from 'react-icons/fi';
import type { ColumnDef } from '@/components/shared/DataTable';
import { AppDispatch, RootState } from '@/store';
import { fetchCompliances } from '@/store/slices/compliances/compliancesSlice';


const ComplianceTable = () => {
    const dispatch = useDispatch<AppDispatch>();

  const [complianceTableData, setComplianceTableData] = useState([]);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchComplianceData(1, 10);
  }, []);

  const fetchComplianceData = async (page: number, size: number) => {
      const { payload: data } = await dispatch(fetchCompliances({page: page, page_size: size}));
      setComplianceTableData(data.data);
      setTableData((prev) => ({
        ...prev,
        total: data?.paginate_data.totalResult,
        pageIndex: data?.paginate_data.page,
    }))
     
  };

  const openNotification = (type: 'success' | 'info' | 'danger' | 'warning', message: string) => {
    toast.push(
      <Notification title={type.charAt(0).toUpperCase() + type.slice(1)} type={type}>
        {message}
      </Notification>
    );
  };

  const handleViewDetails = (compliance) => {
    navigate(`/app/compliance/details/${compliance.id}`, {
        state: compliance
    });
  };

  const handleEdit = (compliance) => {
    navigate(`/app/compliance/edit/${compliance.id}`, {
        state: compliance,
    })
  };

  const handleDelete = (compliance) => {
    setItemToDelete(compliance);
    setDialogIsOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete?.id) return;

    try {
      setIsLoading(true);
      const result = await dispatch(deleteCompliance(itemToDelete.id)).unwrap();
      
      // If deletion was successful
      openNotification('success', 'Compliance deleted successfully');
      // Refresh the table data
      await fetchComplianceData();
    } catch (error: any) {
      console.error('Error deleting compliance:', error);
      openNotification('danger', error?.message || 'Failed to delete compliance');
    } finally {
      setIsLoading(false);
      setDialogIsOpen(false);
      setItemToDelete(null);
    }
  };


  const columns = useMemo(
    () => [    
    {
       header: 'ID',
       accessorKey: 'record_id',
       cell: (props) => (
         <div className="w-20 text-start">{props.getValue()}</div>
       ),
     },
    {
      header: 'Header',
      accessorKey: 'header',
      cell: (props) => (
        <Tooltip title={props.getValue()} placement="top">
          <div className="w-40 truncate">{props.getValue()}</div>
        </Tooltip>
      ),
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (props) => (
        <Tooltip title={props.getValue()} placement="top">
          <div className="w-48 truncate">
            {props.getValue()?.length > 50 
              ? `${props.getValue().substring(0, 50)}...` 
              : props.getValue()}
          </div>
        </Tooltip>
      ),
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: (props) => (
        <div className="w-24">{props.getValue()}</div>
      ),
    },
    // {
    //   header: 'Clause',
    //   accessorKey: 'clause',
    //   cell: (props) => (
    //     <div className="w-24">{props.getValue()}</div>
    //   ),
    // },
    {
        header: 'Category',
        accessorKey: 'category',
        cell: (props) => (
          <div className="w-48">{props.getValue()}</div>
        ),
      },
      {
        header: 'Legislation',
        accessorKey: 'legislation',
        cell: (props) => (
          <div className="w-48 truncate">
          {props.getValue()?.length > 50 
            ? `${props.getValue().substring(0, 50)}...` 
            : props.getValue()}
        </div>
        ),
      },
      {
        header: 'Penalty Description',
        accessorKey: 'penalty_description',
        cell: (props) => (
          <div className="w-40">{props.getValue()}</div>
        ),
      },
    {
      header: 'Criticality',
      accessorKey: 'criticality',
      cell: (props) => {
        const criticality = props.getValue();
        return (
          <div className="w-24 font-semibold">
            <span className={`
              ${criticality === 'high' ? 'text-red-500' : ''}
              ${criticality === 'medium' ? 'text-yellow-500' : ''}
              ${criticality === 'low' ? 'text-green-500' : ''}
            `}>
              {criticality}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Tooltip title="View Details" placement="top">
            <Button
              size="sm"
              icon={<RiEyeLine />}
              onClick={() => handleViewDetails(row.original)}
            />
          </Tooltip>
          <Tooltip title="Edit" placement="top">
            <Button
              size="sm"
              icon={<MdEdit />}
              onClick={() => handleEdit(row.original)}
            />
          </Tooltip>
          {/* <Tooltip title="Delete" placement="top">
            <Button
              size="sm"
              icon={<FiTrash />}
              onClick={() => handleDelete(row.original)}
            />
          </Tooltip> */}
        </div>
      ),
    },
  ], []);


  
  const [tableData, setTableData] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: { order: '', key: '' },
  });

  const onPaginationChange = (page: number) => {
    setTableData(prev => ({ ...prev, pageIndex: page }));
    fetchComplianceData(page, tableData.pageSize)
  };

  const onSelectChange = (value: number) => {
    setTableData((prev) => ({
      ...prev,
      pageSize: Number(value),
      pageIndex: 1,
  }))
  fetchComplianceData(1, value)
  };

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={complianceTableData}
        skeletonAvatarColumns={[0]}
        skeletonAvatarProps={{ className: 'rounded-md' }}
        loading={false}
        stickyHeader={true}
        pagingData={{
          total: tableData.total,
          pageIndex: tableData.pageIndex,
          pageSize: tableData.pageSize,
        }}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
        selectable={true}
      />
      
      <Dialog
        isOpen={dialogIsOpen}
        onClose={() => setDialogIsOpen(false)}
      >
        <div className="p-4">
          <h5 className="mb-4 text-lg font-semibold">Confirm Delete</h5>
          <p className="mb-4">
            Are you sure you want to delete the compliance
            {/* <span className="font-medium">{itemToDelete?.headerr}</span>? */}
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="plain"
              size="sm"
              onClick={() => setDialogIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleConfirmDelete}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ComplianceTable;