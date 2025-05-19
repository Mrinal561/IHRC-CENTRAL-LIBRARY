import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Notification, toast } from '@/components/ui'
import { useNavigate, useParams } from 'react-router-dom'
import OutlinedInput from '@/components/ui/OutlinedInput'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import DatePicker from '@/components/ui/DatePicker'
import {
    createState,
    updateState,
    fetchStateById,
    clearError
} from '@/store/slices/state/stateSlice'
import { AppDispatch, RootState } from '@/store'
import { transformStatePayload } from '@/@types/stateTransformer'

const frequencyOptions = [
    { value: 'yearly', label: 'Yearly' },
    { value: 'half_yearly', label: 'Half Yearly' },
    { value: 'monthly', label: 'Monthly' },
]

const paymentOptions = [
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
]

const initialStateData = {
    name: '',
    district: '',
    location: '',
    lwf_frequency: '',
    lwf_payment_mode: '',
    lwf_first_date: null,
    lwf_second_date: null,
    lwf_third_date: null,
    lwf_last_date: null,
    ptrc_frequency: '',
    ptrc_payment_mode: '',
    ptrc_first_date: null,
    ptrc_second_date: null,
    ptrc_third_date: null,
    ptrc_last_date: null,
    ptec_frequency: '',
    ptec_payment_mode: '',
    ptec_first_date: null,
    ptec_second_date: null,
    ptec_third_date: null,
    ptec_last_date: null
}

const AddStateForm = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { stateId } = useParams()
    const navigate = useNavigate()
    const { error, currentState } = useSelector((state: RootState) => state.state)
    const [stateData, setStateData] = useState(initialStateData)
    const isEditMode = Boolean(stateId)

    useEffect(() => {
        if (stateId) {
            dispatch(fetchStateById(stateId))
        }
    }, [stateId, dispatch])

    useEffect(() => {
        if (isEditMode && currentState) {
            setStateData({
                name: currentState.name,
                district: currentState.district || '',
                location: currentState.location || '',
                lwf_frequency: currentState.lwf_frequency,
                lwf_payment_mode: currentState.lwf_payment_mode,
                lwf_first_date: currentState.lwf_first_date || null,
                lwf_second_date: currentState.lwf_second_date || null,
                lwf_third_date: currentState.lwf_third_date || null,
                lwf_last_date: currentState.lwf_last_date || null,
                ptrc_frequency: currentState.ptrc_frequency,
                ptrc_payment_mode: currentState.ptrc_payment_mode,
                ptrc_first_date: currentState.ptrc_first_date || null,
                ptrc_second_date: currentState.ptrc_second_date || null,
                ptrc_third_date: currentState.ptrc_third_date || null,
                ptrc_last_date: currentState.ptrc_last_date || null,
                ptec_frequency: currentState.ptec_frequency,
                ptec_payment_mode: currentState.ptec_payment_mode,
                ptec_first_date: currentState.ptec_first_date || null,
                ptec_second_date: currentState.ptec_second_date || null,
                ptec_third_date: currentState.ptec_third_date || null,
                ptec_last_date: currentState.ptec_last_date || null
            })
        }
    }, [currentState, isEditMode])

    useEffect(() => {
        if (error) {
            toast.push(
                <Notification title="Error" closable={true} type="danger">
                    {error}
                </Notification>,
            )
            dispatch(clearError())
        }
    }, [error, dispatch])

    const handleInputChange = (field, value) => {
        setStateData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const transformedData = transformStatePayload(stateData)
            if (isEditMode && stateId) {
                await dispatch(updateState({ id: stateId, data: transformedData }))
                toast.push(
                    <Notification title="Success" type="success">
                        State updated successfully!
                    </Notification>,
                )
            } else {
                await dispatch(createState(transformedData))
                toast.push(
                    <Notification title="Success" type="success">
                        State created successfully!
                    </Notification>,
                )
            }
            navigate('/states')
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const renderFrequencySection = (title, prefix) => (
        <div className="mb-8 p-6 border rounded-lg">
            <h4 className="text-lg font-semibold mb-4">{title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-600 mb-2">Frequency</label>
                    <OutlinedSelect
                        options={frequencyOptions}
                        value={stateData[`${prefix}_frequency`]}
                        onChange={(value) => handleInputChange(`${prefix}_frequency`, value)} label={'Select Frequency'}                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-2">Payment Mode</label>
                    <OutlinedSelect
                        options={paymentOptions}
                        value={stateData[`${prefix}_payment_mode`]}
                        onChange={(value) => handleInputChange(`${prefix}_payment_mode`, value)} label={'Select Payment Mode'}                    />
                </div>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-4 gap-4 mt-4">
                <div>
                    <label className="block text-gray-600 mb-2">First Due Date</label>
                    <DatePicker
                        placeholder="Select date"
                        value={stateData[`${prefix}_first_date`]}
                        onChange={(date) => handleInputChange(`${prefix}_first_date`, date)}
                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-2">Second Due Date</label>
                    <DatePicker
                        placeholder="Select date"
                        value={stateData[`${prefix}_second_date`]}
                        onChange={(date) => handleInputChange(`${prefix}_second_date`, date)}
                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-2">Third Due Date</label>
                    <DatePicker
                        placeholder="Select date"
                        value={stateData[`${prefix}_third_date`]}
                        onChange={(date) => handleInputChange(`${prefix}_third_date`, date)}
                    />
                </div>
                <div>
                    <label className="block text-gray-600 mb-2">Last Due Date</label>
                    <DatePicker
                        placeholder="Select date"
                        value={stateData[`${prefix}_last_date`]}
                        onChange={(date) => handleInputChange(`${prefix}_last_date`, date)}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-bold mb-6">
                {isEditMode ? 'Edit State' : 'Add New State'}
            </h2>
            
            <form onSubmit={handleSubmit}>
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-600 mb-2">State Name</label>
                            <OutlinedInput
                            label='Enter State'
                                value={stateData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-2">District</label>
                            <OutlinedInput
                                                        label='Enter District'

                                value={stateData.district}
                                onChange={(e) => handleInputChange('district', e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-2">Location</label>
                            <OutlinedInput
                                                        label='Enter Location'

                                value={stateData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                {renderFrequencySection('LWF Details', 'lwf')}
                {renderFrequencySection('PTRC Details', 'ptrc')}
                {renderFrequencySection('PTEC Details', 'ptec')}

                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        type="button"
                        variant="plain"
                        onClick={() => navigate('/states')}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                    >
                        {isEditMode ? 'Update State' : 'Create State'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AddStateForm