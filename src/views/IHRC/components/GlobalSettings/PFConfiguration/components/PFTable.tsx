import React, { useEffect, useMemo, useState } from 'react'
import { Button, Dialog, toast, Tooltip, Notification } from '@/components/ui'
import { MdEdit, MdDelete } from 'react-icons/md'
import DataTable from '@/components/shared/DataTable'
import {
    fetchPFConfigs,
    PFConfigData,
} from '@/store/slices/pfConfig/pfConfigSlice'
import Loading from '@/components/shared/Loading'
import dayjs from 'dayjs'
import { BiTrash } from 'react-icons/bi'
import { FiEdit } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { AppDispatch, fetchAuthUser } from '@/store'

const PFTable = ({
    tableLoading,
    setPfTableLoading,
    pfConfigurationData,
    loading,
    onEdit,
}: any) => {
    const dispatch = useDispatch<AppDispatch>()

    const [selectedId, setSelectedId] = React.useState<string | null>(null)
    const [pfTableData, setPfTableData] = useState([])

    const columns = useMemo(
        () => [
            {
                header: 'Frequency',
                accessorKey: 'pf_frequency',
                cell: ({ row }) => {
                    const frequency = row.original.pf_frequency
                    return (
                        frequency.charAt(0).toUpperCase() + frequency.slice(1)
                    )
                },
            },
            {
                header: 'First Due Date',
                accessorKey: 'pf_payment_due_date.first_date',
                cell: ({ row }) => {
                    const date = row.original.pt_payment_due_date.first_date
                    return date ? dayjs(date).format('DD/MM/YYYY') : '-'
                },
            },
            // {
            //     header: 'Second Due Date',
            //     accessorKey: 'pt_payment_due_date.last_date',
            //     cell: ({ row }) => {
            //         const date = row.original.pt_payment_due_date.last_date
            //         return date ? dayjs(date).format('DD/MM/YYYY') : '-'
            //     },
            // },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <Tooltip title="Edit">
                            <Button
                                size="sm"
                                icon={<MdEdit />}
                                onClick={() => onEdit(row.original)}
                                className="text-blue-500 hover:text-blue-600"
                            />
                        </Tooltip>
                    </div>
                ),
            },
        ],
        [onEdit],
    )

    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: { order: '', key: '' },
    })

    const onPaginationChange = (page: number) => {
        setTableData((prev) => ({ ...prev, pageIndex: page }))
        fetchPfData(page, tableData.pageSize)
    }

    const onSelectChange = (value: number) => {
        setTableData((prev) => ({
            ...prev,
            pageSize: Number(value),
            pageIndex: 1,
        }))
        fetchPfData(1, value)
    }
    useEffect(() => {
        fetchPfData(1, 10)
        setPfTableLoading(false)
    }, [])

    useEffect(() => {
        if (tableLoading) {
            fetchPfData(1, 10)
            setPfTableLoading(false)
        }
    }, [tableLoading])

    const fetchPfData = async (page: number, size: number) => {
        const { payload: data } = await dispatch(
            fetchPFConfigs({ page: page, page_size: size }),
        )
        setPfTableData(data?.data)
        setTableData((prev) => ({
            ...prev,
            total: data?.paginate_data.totalResult,
            pageIndex: data?.paginate_data.page,
        }))
    }

    const openNotification = (
        type: 'success' | 'info' | 'danger' | 'warning',
        message: string,
    ) => {
        toast.push(
            <Notification
                title={type.charAt(0).toUpperCase() + type.slice(1)}
                type={type}
            >
                {message}
            </Notification>,
        )
    }

    return (
        <>
            <DataTable
                data={pfTableData}
                columns={columns}
                loading={loading}
                stickyHeader={true}
                stickyFirstColumn={true}
                stickyLastColumn={true}
                pagingData={{
                    total: tableData.total,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                selectable={true}
            />
        </>
    )
}

export default PFTable
