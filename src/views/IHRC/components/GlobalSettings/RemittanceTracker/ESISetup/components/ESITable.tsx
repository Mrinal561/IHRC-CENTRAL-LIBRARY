import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import DataTable from '@/components/shared/DataTable'
import { format } from 'date-fns'
import {
    Button,
    Tooltip,
    Dialog,
    DatePicker,
    Checkbox,
    toast,
    Notification,
} from '@/components/ui'
import { MdEdit } from 'react-icons/md'
import { HiOutlineViewGrid } from 'react-icons/hi'
import { AppDispatch } from '@/store'
import {
    fetchESIConfigs,
    createESIConfig,
    updateESIConfig,
    clearCurrentESIConfig,
} from '@/store/slices/esiConfig/esiConfigSlice'
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import { showErrorNotification } from '@/components/ui/ErrorMessage'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import { fetchDetail } from '@/store/slices/common/commonSlice'
import * as yup from 'yup'

const createESIValidationSchema = (frequency) => {
    const baseSchema = {
        firstDate: yup
            .date()
            .required('First due date is required')
            .typeError('First due date must be a valid date'),
    }

    if (frequency === 'quarterly') {
        console.log('que')
        return yup.object().shape({
            ...baseSchema,
            secondDate: yup
                .date()
                .required('Second due date is required')
                .min(
                    yup.ref('firstDate'),
                    'Second due date must be after first due date',
                )
                .typeError('Second due date must be a valid date'),
            thirdDate: yup
                .date()
                .required('Third due date is required')
                .min(
                    yup.ref('secondDate'),
                    'Third due date must be after second due date',
                )
                .typeError('Third due date must be a valid date'),
            lastDate: yup
                .date()
                .required('Last due date is required')
                .min(
                    yup.ref('thirdDate'),
                    'Last due date must be after third due date',
                )
                .typeError('Last due date must be a valid date'),
        })
    }

    if (frequency === 'half_yearly') {
        return yup.object().shape({
            ...baseSchema,
            lastDate: yup
                .date()
                .required('Last due date is required')
                .min(
                    yup.ref('firstDate'),
                    'Last due date must be after first due date',
                )
                .typeError('Last due date must be a valid date'),
        })
    }

    return yup.object().shape(baseSchema)
}
const frequencyOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'half_yearly', label: 'Half Yearly' },
    { value: 'quarterly', label: 'Quarterly' },
]

const ESITable = ({ refreshTrigger }) => {
    const dispatch = useDispatch<AppDispatch>()
    const [validationErrors, setValidationErrors] = useState<{
        firstDate?: string
        secondDate?: string
        thirdDate?: string
        lastDate?: string
    }>({})
    const [isLoading, setIsLoading] = useState(true)
    const [esiTableData, setESITableData] = useState([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [states, setStates] = useState([])
    const [selectedState, setSelectedState] = useState(null)
    const [frequency, setFrequency] = useState('')
    const [isActive, setIsActive] = useState(false)
    const [selectedStateId, setSelectedStateId] = useState(null)
    const [dateFieldsState, setDateFieldsState] = useState({
        isSecondDateEnabled: false,
        isThirdDateEnabled: false,
        isLastDateEnabled: false,
    })
    const [paymentDueDates, setPaymentDueDates] = useState({
        firstDate: null,
        secondDate: null,
        thirdDate: null,
        lastDate: null,
    })

    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: { order: '', key: '' },
    })
    useEffect(() => {
        validateDates()
    }, [paymentDueDates])

    useEffect(() => {
        fetchESISetupData(tableData.pageIndex, tableData.pageSize)
        loadStates()
    }, [refreshTrigger])

    const loadStates = async () => {
        try {
            const response = await httpClient.get(
                endpoints.common.getStatesAll(),
            )
            if (response.data) {
                setStates(
                    response.data.map((state) => ({
                        label: state.name,
                        value: String(state.id),
                    })),
                )
            }
        } catch (error) {
            console.error('Failed to load states:', error)
        }
    }

    const fetchESISetupData = async (page, size) => {
        setIsLoading(true)
        try {
            const response = await dispatch(
                fetchESIConfigs({ page, page_size: size }),
            )
            if (response?.payload?.data) {
                setESITableData(response.payload.data)
                setTableData((prev) => ({
                    ...prev,
                    total: response.payload.paginateData?.totalResults || 0,
                    pageIndex: page,
                    pageSize: size,
                }))
            }
        } catch (error) {
            console.error('Failed to fetch ESI configurations', error)
            setESITableData([])
        } finally {
            setIsLoading(false)
        }
    }

    const isDueDateDisabled = (dateIndex) => {
        switch (frequency) {
            case 'monthly':
            case 'yearly':
                return dateIndex > 0
            case 'half_yearly':
                return dateIndex > 0 && dateIndex < 3
            case 'quarterly':
                return false
            default:
                return true
        }
    }

    const handleEdit = async (config) => {
        try {
            const response = await dispatch(fetchDetail(config.id))
            const detailData = response.payload

            // Convert ISO strings to Date objects for the DatePicker
            const formatDate = (dateString) =>
                dateString ? new Date(dateString) : null

            setIsDialogOpen(true)
            setSelectedStateId(detailData.id)
            setSelectedState(
                states.find((state) => state.value === String(detailData.id)),
            )
            setFrequency(detailData.esi_frequency)
            setIsActive(detailData.esi_active)
            setPaymentDueDates({
                firstDate: formatDate(
                    detailData.esi_payment_due_date.first_date,
                ),
                secondDate: formatDate(
                    detailData.esi_payment_due_date.second_date,
                ),
                thirdDate: formatDate(
                    detailData.esi_payment_due_date.third_date,
                ),
                lastDate: formatDate(detailData.esi_payment_due_date.last_date),
            })
        } catch (error) {
            showErrorNotification('Failed to fetch state details')
        }
    }

    const validateDates = async () => {
        try {
            const validationSchema = createESIValidationSchema(frequency)
            await validationSchema.validate(paymentDueDates, {
                abortEarly: false,
            })
            setValidationErrors({})
            return true
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors = {}
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message
                })
                setValidationErrors(newErrors)
                return false
            }
            return false
        }
    }

    const handleConfirm = async () => {
        if (!selectedState || !frequency) {
            showErrorNotification('Please fill all required fields')
            return
        }
        console.log(validationErrors)
        const isValid = await validateDates()
        console.log(isValid)
        if (!isValid) {
            return
        }

        try {
            const esiConfigData = {
                frequency,
                payment_due_date: {
                    first_date: paymentDueDates.firstDate,
                    second_date: paymentDueDates.secondDate,
                    third_date: paymentDueDates.thirdDate,
                    last_date: paymentDueDates.lastDate,
                },
                payment_mode: 'online',
                active: isActive,
                state_id: selectedState.value,
            }

            await dispatch(
                updateESIConfig({
                    id: selectedState.value,
                    data: esiConfigData,
                }),
            )
            setIsDialogOpen(false)
            fetchESISetupData(tableData.pageIndex, tableData.pageSize)
            setValidationErrors({})
        } catch (error) {
            showErrorNotification(error.message)
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'State Name',
                accessorKey: 'name',
                cell: ({ row }) => (
                    <div className="w-72 text-start">{row.original.name}</div>
                ),
            },
            {
                header: 'ESI Frequency',
                accessorKey: 'esi_frequency',
                cell: ({ row }) => (
                    <div className="w-40 text-start">
                        {row.original.esi_frequency
                            ? row.original.esi_frequency
                                  .replace('_', ' ')
                                  .charAt(0)
                                  .toUpperCase() +
                              row.original.esi_frequency.slice(1)
                            : '-'}
                    </div>
                ),
            },
            {
                header: 'First Due Date',
                accessorKey: 'first_date',
                cell: ({ row }) => (
                    <div className="w-40 text-start">
                        {row.original.esi_payment_due_date?.first_date
                            ? format(
                                  new Date(
                                      row.original.esi_payment_due_date.first_date,
                                  ),
                                  'MMM dd, yyyy',
                              )
                            : '-'}
                    </div>
                ),
            },
            {
                header: 'Second Due Date',
                accessorKey: 'second_date',
                cell: ({ row }) => (
                    <div className="w-40 text-start">
                        {row.original.esi_payment_due_date?.second_date
                            ? format(
                                  new Date(
                                      row.original.esi_payment_due_date.second_date,
                                  ),
                                  'MMM dd, yyyy',
                              )
                            : '-'}
                    </div>
                ),
            },
            {
                header: 'Third Due Date',
                accessorKey: 'third_date',
                cell: ({ row }) => (
                    <div className="w-40 text-start">
                        {row.original.esi_payment_due_date?.third_date
                            ? format(
                                  new Date(
                                      row.original.esi_payment_due_date.third_date,
                                  ),
                                  'MMM dd, yyyy',
                              )
                            : '-'}
                    </div>
                ),
            },
            {
                header: 'Last Due Date',
                accessorKey: 'last_date',
                cell: ({ row }) => (
                    <div className="w-40 text-start">
                        {row.original.esi_payment_due_date?.last_date
                            ? format(
                                  new Date(
                                      row.original.esi_payment_due_date.last_date,
                                  ),
                                  'MMM dd, yyyy',
                              )
                            : '-'}
                    </div>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'esi_active',
                cell: ({ row }) => (
                    <div className="w-24 text-start">
                        <div
                            className={
                                row.original.esi_active
                                    ? 'text-green-500 font-semibold'
                                    : 'text-red-500 font-semibold'
                            }
                        >
                            {row.original.esi_active ? 'Active' : 'Inactive'}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Tooltip title="Edit" placement="top">
                            <Button
                                size="sm"
                                icon={<MdEdit />}
                                onClick={() => handleEdit(row.original)}
                            />
                        </Tooltip>
                    </div>
                ),
            },
        ],
        [states],
    )

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
                <div className="w-28 h-28">
                    <Lottie
                        animationData={loadingAnimation}
                        loop
                        className="w-24 h-24"
                    />
                </div>
                <p className="text-lg font-semibold">Loading Data...</p>
            </div>
        )
    }

    return (
        <div className="relative">
            {esiTableData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">
                        No ESI Configurations Available
                    </p>
                </div>
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={esiTableData}
                        stickyHeader={true}
                        stickyFirstColumn={true}
                        stickyLastColumn={true}
                        pagingData={tableData}
                        onPaginationChange={(page) =>
                            fetchESISetupData(page, tableData.pageSize)
                        }
                        onSelectChange={(value) => fetchESISetupData(1, value)}
                        selectable={true}
                    />

                    <Dialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                    >
                        <h5 className="mb-6">Edit ESI Setup</h5>
                        <div className="flex flex-col gap-6">
                            <div className="flex gap-4">
                                <div className="w-full">
                                    <label className="text-gray-600 mb-2 block">
                                        State
                                    </label>
                                    <OutlinedSelect
                                        label="Select State"
                                        options={states}
                                        value={selectedState}
                                        onChange={setSelectedState}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-full">
                                    <label className="text-gray-600 mb-2 block">
                                        ESI Frequency
                                    </label>
                                    <OutlinedSelect
                                        label="Select ESI Frequency"
                                        options={frequencyOptions}
                                        value={frequencyOptions.find(
                                            (option) =>
                                                option.value === frequency,
                                        )}
                                        onChange={(selected) =>
                                            setFrequency(selected?.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="text-gray-600 mb-2 block">
                                        First Due Date{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <DatePicker
                                        className="w-full"
                                        placeholder="Select first due date"
                                        value={paymentDueDates.firstDate}
                                        onChange={(date) => {
                                            setPaymentDueDates((prev) => ({
                                                ...prev,
                                                firstDate: date,
                                            }))
                                            // setValidationErrors(prev => ({ ...prev, firstDate: undefined }));
                                        }}
                                    />
                                    {validationErrors.firstDate && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {validationErrors.firstDate}
                                        </div>
                                    )}
                                </div>
                                <div className="w-1/2">
                                    <label className="text-gray-600 mb-2 block">
                                        Second Due Date
                                    </label>
                                    <DatePicker
                                        className="w-full"
                                        placeholder="Select second due date"
                                        value={paymentDueDates.secondDate}
                                        onChange={(date) => {
                                            setPaymentDueDates((prev) => ({
                                                ...prev,
                                                secondDate: date,
                                            }))
                                            // setValidationErrors(prev => ({ ...prev, firstDate: undefined }));
                                        }}
                                        disabled={isDueDateDisabled(1)}
                                    />
                                    {validationErrors.secondDate && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {validationErrors.secondDate}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="text-gray-600 mb-2 block">
                                        Third Due Date
                                    </label>
                                    <DatePicker
                                        className="w-full"
                                        placeholder="Select third due date"
                                        value={paymentDueDates.thirdDate}
                                        onChange={(date) =>
                                            setPaymentDueDates((prev) => ({
                                                ...prev,
                                                thirdDate: date,
                                            }))
                                        }
                                        disabled={isDueDateDisabled(2)}
                                    />
                                    {validationErrors.thirdDate && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {validationErrors.thirdDate}
                                        </div>
                                    )}
                                </div>
                                <div className="w-1/2">
                                    <label className="text-gray-600 mb-2 block">
                                        Last Due Date
                                    </label>
                                    <DatePicker
                                        className="w-full"
                                        placeholder="Select last due date"
                                        value={paymentDueDates.lastDate}
                                        onChange={(date) => {
                                            setPaymentDueDates((prev) => ({
                                                ...prev,
                                                lastDate: date,
                                            }))
                                        }}
                                        disabled={isDueDateDisabled(3)}
                                    />
                                    {validationErrors.lastDate && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {validationErrors.lastDate}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={isActive}
                                    onChange={(checked) => setIsActive(checked)}
                                />
                                <label className="text-gray-600">
                                    Is ESI applicable for Selected State
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <Button
                                variant="plain"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button variant="solid" onClick={handleConfirm}>
                                Update
                            </Button>
                        </div>
                    </Dialog>
                </>
            )}
        </div>
    )
}

export default ESITable
