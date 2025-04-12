import React, { useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Button, Tooltip } from '@/components/ui';
import { HiDownload, HiOutlinePencil } from 'react-icons/hi';
import Dialog from '@/components/ui/Dialog';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput';
import Input from '@/components/ui/Input';
import { MdEdit } from 'react-icons/md';

const RegisterTable = () => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingRow, setEditingRow] = useState(null);

    // Dummy data based on the register fields
    const dummyData = [
        {
            id: '1',
            centralState: 'Central',
            formNo: 'FORM-001',
            actName: 'The Companies Act, 2013',
            registerName: 'Register of Members',
            frequency: 'Yearly',
            template: 'members_template.xlsx'
        },
        {
            id: '2',
            centralState: 'Delhi',
            formNo: 'FORM-002',
            actName: 'The Shops and Establishments Act',
            registerName: 'Register of Employees',
            frequency: 'Monthly',
            template: 'employees_template.xlsx'
        },
        {
            id: '3',
            centralState: 'Gujarat',
            formNo: 'FORM-003',
            actName: 'The Factories Act, 1948',
            registerName: 'Register of Accidents',
            frequency: 'Quarterly',
            template: 'accidents_template.xlsx'
        },
        {
            id: '4',
            centralState: 'Jharkhand',
            formNo: 'FORM-004',
            actName: 'The Contract Labour Act',
            registerName: 'Register of Contract Workers',
            frequency: 'Half Yearly',
            template: 'contract_workers_template.xlsx'
        },
        {
            id: '5',
            centralState: 'Central',
            formNo: 'FORM-005',
            actName: 'The Minimum Wages Act',
            registerName: 'Register of Wages',
            frequency: 'Monthly',
            template: 'wages_template.xlsx'
        }
    ];

    const centralOption = [
        { label: 'central', value: 'Central' },
        { label: 'delhi', value: 'Delhi' },
        { label: 'gujarat', value: 'Gujarat' },
        { label: 'jharkhand', value: 'Jharkhand' },
    ];

    const frequency = [
        { label: 'yearly', value: 'Yearly' },
        { label: 'monthly', value: 'Monthly' },
        { label: 'quarterly', value: 'Quarterly' },
        { label: 'half_yearly', value: 'Half Yearly' },
    ];

    const handleEditClick = (row) => {
        setEditingRow(row);
        setIsEditDialogOpen(true);
    };

    const handleDownload = (id) => {
        // Handle download logic here
        console.log(`Downloading template for id: ${id}`);
    };

    const columns = [
        {
            header: 'Central/State',
            enableSorting: false,

            accessorKey: 'centralState',
            cell: ({ row }) => <div className="w-32 truncate">{row.original.centralState}</div>
        },
        {
            header: 'Form No',
            enableSorting: false,

            accessorKey: 'formNo',
            cell: ({ row }) => <div className="w-32 truncate">{row.original.formNo}</div>
        },
        {
            header: 'Act Name',
            enableSorting: false,

            accessorKey: 'actName',
            cell: ({ row }) => <div className="w-64 truncate">{row.original.actName}</div>
        },
        {
            header: 'Register Name',
            enableSorting: false,

            accessorKey: 'registerName',
            cell: ({ row }) => <div className="w-64 truncate">{row.original.registerName}</div>
        },
        {
            header: 'Frequency',
            enableSorting: false,
            accessorKey: 'frequency',
            cell: ({ row }) => <div className="w-32 truncate">{row.original.frequency}</div>
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Tooltip title="Download Template">
                        <Button
                            size="sm"
                            icon={<HiDownload />}
                            onClick={() => handleDownload(row.original.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            size="sm"
                            icon={<MdEdit />}
                            onClick={() => handleEditClick(row.original)}
                        />
                    </Tooltip>
                </div>
            )
        }
    ];

    return (
        <div className="relative">
            <DataTable
                columns={columns}
                data={dummyData}
                loading={false}
                pagingData={{
                    total: dummyData.length,
                    pageIndex: 1,
                    pageSize: 10
                }}
                stickyHeader={true}
                stickyFirstColumn={true}
                stickyLastColumn={true}
            />

            {/* Edit Dialog */}
            <Dialog 
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onRequestClose={() => setIsEditDialogOpen(false)}
                width={800}
            >
                <div className="">
                    <h5 className="mb-6">Edit Register</h5>
                    <div className='flex flex-col gap-4'>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Select Central/State</label>
                                <OutlinedSelect 
                                    label={"Select Central/State"} 
                                    options={centralOption}
                                    value={editingRow?.centralState || ''} 
                                    onChange={(value) => setEditingRow({...editingRow, centralState: value})} 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Form No</label>
                                <OutlinedInput 
                                    label={"Enter Form No"}
                                    value={editingRow?.formNo || ''} 
                                    onChange={(value) => setEditingRow({...editingRow, formNo: value})}
                                />                   
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Act Name</label>
                                <OutlinedInput 
                                    textarea
                                    label={"Enter Act Name"}
                                    value={editingRow?.actName || ''} 
                                    onChange={(value) => setEditingRow({...editingRow, actName: value})}
                                />                   
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Register Name</label>
                                <OutlinedInput 
                                    textarea
                                    label={"Enter Register Name"}
                                    value={editingRow?.registerName || ''} 
                                    onChange={(value) => setEditingRow({...editingRow, registerName: value})}
                                />  
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Register Frequency</label>
                                <OutlinedSelect 
                                    label={"Select Register Frequency"} 
                                    options={frequency}
                                    value={editingRow?.frequency || ''} 
                                    onChange={(value) => setEditingRow({...editingRow, frequency: value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Upload Template</label>
                                <Input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    className="mb-4"
                                />                
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="plain" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="solid">
                            Confirm
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default RegisterTable;