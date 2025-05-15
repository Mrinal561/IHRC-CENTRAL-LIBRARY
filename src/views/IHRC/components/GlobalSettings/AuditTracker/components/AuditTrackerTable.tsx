import React, { useMemo, useState } from 'react';
import { Button, Dialog, Tooltip } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import { FiTrash, FiXCircle } from 'react-icons/fi';
import { DataTable } from '@/components/shared';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

const AuditTrackerTable = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    });

    // Dummy data for the table
    const dummyData = [
        {
            id: 1,
            country: 'India',
            function: 'HR Compliance',
            central_state: 'Central',
            legislation_act: 'Factories Act, 1948',
            compliance_categorization: 'Statutory',
            compliance_header: 'Factory License Renewal',
            compliance_description: 'Annual renewal of factory license as per state regulations',
            penalty_type: 'Monetary',
            penalty_description: 'Fine up to ₹1,00,000 for non-compliance',
            compliance_applicability: 'Mandatory',
            compliance_reference: 'Section 6 of Factories Act',
            compliance_type: 'License',
            compliance_frequency: 'Yearly',
            criticality: 'High',
            default_due_date: 'January 31st'
        },
        {
            id: 2,
            country: 'India',
            function: 'Environmental',
            central_state: 'Maharashtra',
            legislation_act: 'Water (Prevention and Control of Pollution) Act, 1974',
            compliance_categorization: 'Environmental',
            compliance_header: 'Water Pollution Control',
            compliance_description: 'Submission of water pollution control measures report',
            penalty_type: 'Both',
            penalty_description: 'Fine and possible imprisonment for violations',
            compliance_applicability: 'Conditional',
            compliance_reference: 'Section 25 Consent to Operate',
            compliance_type: 'Report',
            compliance_frequency: 'Quarterly',
            criticality: 'Medium',
            default_due_date: 'Last day of quarter'
        },
        {
            id: 3,
            country: 'India',
            function: 'Labor',
            central_state: 'Karnataka',
            legislation_act: 'Minimum Wages Act, 1948',
            compliance_categorization: 'Payroll',
            compliance_header: 'Minimum Wage Compliance',
            compliance_description: 'Ensure all employees are paid at least minimum wage',
            penalty_type: 'Monetary',
            penalty_description: 'Fine up to ₹50,000 or imprisonment up to 6 months',
            compliance_applicability: 'Mandatory',
            compliance_reference: 'Section 12 of Minimum Wages Act',
            compliance_type: 'Payroll',
            compliance_frequency: 'Monthly',
            criticality: 'High',
            default_due_date: '7th of next month'
        },
        {
            id: 4,
            country: 'India',
            function: 'Safety',
            central_state: 'Tamil Nadu',
            legislation_act: 'Tamil Nadu Factories Rules, 1950',
            compliance_categorization: 'Safety',
            compliance_header: 'Safety Equipment Inspection',
            compliance_description: 'Monthly inspection of all safety equipment in factory',
            penalty_type: 'Monetary',
            penalty_description: 'Fine up to ₹25,000 per violation',
            compliance_applicability: 'Mandatory',
            compliance_reference: 'Rule 65 of TN Factories Rules',
            compliance_type: 'Inspection',
            compliance_frequency: 'Monthly',
            criticality: 'Medium',
            default_due_date: 'Last working day of month'
        },
        {
            id: 5,
            country: 'India',
            function: 'Tax',
            central_state: 'Gujarat',
            legislation_act: 'Gujarat VAT Act, 2003',
            compliance_categorization: 'Tax',
            compliance_header: 'VAT Return Filing',
            compliance_description: 'Filing of quarterly VAT returns with Gujarat Commercial Tax Dept',
            penalty_type: 'Monetary',
            penalty_description: 'Late fee of ₹200 per day of delay',
            compliance_applicability: 'Mandatory',
            compliance_reference: 'Section 34 of Gujarat VAT Act',
            compliance_type: 'Tax Filing',
            compliance_frequency: 'Quarterly',
            criticality: 'High',
            default_due_date: '20th of next quarter'
        },
        {
            id: 6,
            country: 'India',
            function: 'HR Compliance',
            central_state: 'Central',
            legislation_act: 'Sexual Harassment of Women at Workplace Act, 2013',
            compliance_categorization: 'Statutory',
            compliance_header: 'Annual Report Submission',
            compliance_description: 'Submission of annual report on sexual harassment complaints',
            penalty_type: 'Both',
            penalty_description: 'Fine up to ₹50,000 and cancellation of license',
            compliance_applicability: 'Mandatory',
            compliance_reference: 'Section 21 of POSH Act',
            compliance_type: 'Report',
            compliance_frequency: 'Yearly',
            criticality: 'High',
            default_due_date: 'January 31st'
        },
        {
            id: 7,
            country: 'India',
            function: 'Environmental',
            central_state: 'Uttar Pradesh',
            legislation_act: 'Air (Prevention and Control of Pollution) Act, 1981',
            compliance_categorization: 'Environmental',
            compliance_header: 'Emission Testing',
            compliance_description: 'Half-yearly testing of air emissions from factory',
            penalty_type: 'Monetary',
            penalty_description: 'Fine up to ₹1,00,000 and closure orders',
            compliance_applicability: 'Conditional',
            compliance_reference: 'Section 21 of Air Act',
            compliance_type: 'Testing',
            compliance_frequency: 'Half Yearly',
            criticality: 'Medium',
            default_due_date: 'June 30th and December 31st'
        },
        {
            id: 8,
            country: 'India',
            function: 'Labor',
            central_state: 'Delhi',
            legislation_act: 'Delhi Shops and Establishment Act, 1954',
            compliance_categorization: 'Registration',
            compliance_header: 'Shop Registration',
            compliance_description: 'Registration of all commercial establishments in Delhi',
            penalty_type: 'Monetary',
            penalty_description: 'Fine up to ₹25,000 for non-registration',
            compliance_applicability: 'Mandatory',
            compliance_reference: 'Section 4 of Delhi S&E Act',
            compliance_type: 'License',
            compliance_frequency: 'One Time',
            criticality: 'High',
            default_due_date: 'Within 30 days of commencement'
        },
    ];

    const columns = useMemo(
        () => [
            // {
            //     header: 'Country',
            //     enableSorting: false,
            //     accessorKey: 'country',
            //     cell: ({ row }) => <div className="w-32">{row.original.country}</div>
            // },
            {
                header: 'Function',
                enableSorting: false,
                accessorKey: 'function',
                cell: ({ row }) => <div className="w-40">{row.original.function}</div>
            },
            {
                header: 'Central/State',
                enableSorting: false,
                accessorKey: 'central_state',
                cell: ({ row }) => <div className="w-40">{row.original.central_state}</div>
            },
            {
                header: 'Legislation Act',
                enableSorting: false,
                accessorKey: 'legislation_act',
                cell: ({ row }) => <Tooltip title={row.original.legislation_act}>
                    <div className="w-52 truncate">{row.original.legislation_act}</div>
                </Tooltip>
            },
            {
                header: 'Compliance Categorization',
                enableSorting: false,
                accessorKey: 'compliance_categorization',
                cell: ({ row }) => <div className="w-40">{row.original.compliance_categorization}</div>
            },
            {
                header: 'Compliance Header',
                enableSorting: false,
                accessorKey: 'compliance_header',
                cell: ({ row }) => <Tooltip title={row.original.compliance_header}>
                    <div className="w-48 truncate">{row.original.compliance_header}</div>
                </Tooltip>
            },
            {
                header: 'Compliance Description',
                enableSorting: false,
                accessorKey: 'compliance_description',
                cell: ({ row }) => <Tooltip title={row.original.compliance_description}>
                    <div className="w-64 truncate">{row.original.compliance_description}</div>
                </Tooltip>
            },
            {
                header: 'Penalty Type',
                enableSorting: false,
                accessorKey: 'penalty_type',
                cell: ({ row }) => <div className="w-32">{row.original.penalty_type}</div>
            },
            {
                header: 'Penalty Description',
                enableSorting: false,
                accessorKey: 'penalty_description',
                cell: ({ row }) => <Tooltip title={row.original.penalty_description}>
                    <div className="w-48 truncate">{row.original.penalty_description}</div>
                </Tooltip>
            },
            {
                header: 'Compliance Applicability',
                enableSorting: false,
                accessorKey: 'compliance_applicability',
                cell: ({ row }) => <div className="w-40">{row.original.compliance_applicability}</div>
            },
            {
                header: 'Compliance Reference',
                enableSorting: false,
                accessorKey: 'compliance_reference',
                cell: ({ row }) => <Tooltip title={row.original.compliance_reference}>
                    <div className="w-48 truncate">{row.original.compliance_reference}</div>
                </Tooltip>
            },
            {
                header: 'Compliance Type',
                enableSorting: false,
                accessorKey: 'compliance_type',
                cell: ({ row }) => <div className="w-40">{row.original.compliance_type}</div>
            },
            {
                header: 'Compliance Frequency',
                enableSorting: false,
                accessorKey: 'compliance_frequency',
                cell: ({ row }) => <div className="w-40">{row.original.compliance_frequency}</div>
            },
            {
                header: 'Criticality',
                enableSorting: false,
                accessorKey: 'criticality',
                cell: ({ row }) => (
                    <div className={`w-24 ${
                        row.original.criticality === 'High' ? 'text-red-500 font-semibold' : 
                        row.original.criticality === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                        {row.original.criticality}
                    </div>
                )
            },
            {
                header: 'Default Due Date',
                enableSorting: false,
                accessorKey: 'default_due_date',
                cell: ({ row }) => <div className="w-40">{row.original.default_due_date}</div>
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Tooltip title="Edit">
                            <Button
                                size="sm"
                                onClick={() =>
                                    navigate('/edit-compliance-setup', {
                                        state: { complianceSetupId: row.original.id },
                                    })
                                }
                                icon={<MdEdit />}
                                className="text-blue-500"
                            />
                        </Tooltip>

                        {/* <Tooltip title="Enable">
                            <Button
                                size="sm"
                                icon={<IoMdCheckmarkCircleOutline />}
                                className="text-green-500"
                                onClick={() => {
                                    setDeleteDialogOpen(true);
                                }}
                            />
                        </Tooltip> */}
                        <Tooltip title="Disable">
                            <Button
                                size="sm"
                                icon={<FiXCircle />}
                                className="text-red-500"
                                onClick={() => {
                                    setDeleteDialogOpen(true);
                                }}
                            />
                        </Tooltip>
                    </div>
                ),
            },
        ],
        []
    );

    const onPaginationChange = (page: number) => {
        console.log(tableData);
    };

    const onSelectChange = (value: number) => {
        console.log(tableData);
    };

    return (
        <div className='relative'>
              {dummyData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                            <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                            <p className="text-center">
                    No Data Available
                            </p>
                  </div>
                        ) : (
            <DataTable
                columns={columns}
                data={dummyData}
                loading={loading}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
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
                    <Button variant="solid" onClick={undefined} loading={loading}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default AuditTrackerTable;