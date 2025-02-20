import { Notification, toast } from '@/components/ui'

export const formatErrorMessages = (errors: any): string => {
    // If errors is an array, join them with line breaks
    if (Array.isArray(errors)) {
        return errors.join('\n')
    }
    // If errors is an object, extract all error messages
    else if (typeof errors === 'object' && errors !== null) {
        const messages: string[] = []
        Object.entries(errors).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                messages.push(...value)
            } else if (typeof value === 'string') {
                messages.push(value)
            }
        })
        return messages.join('\n')
    }
    // If it's a single string error
    return String(errors)
}

export const showErrorNotification = (errors: any) => {
    const formattedMessage = formatErrorMessages(errors)

    // Split the formatted message into individual error messages
    const errorMessages = formattedMessage.split('\n').filter(Boolean) // Filter out empty strings

    toast.push(
        <Notification title="Error" type="danger" closable={true}>
            <div style={{ whiteSpace: 'pre-line' }}>
                {errorMessages.length > 1 ? ( // Check if there are multiple error messages
                    <ul
                        style={{
                            padding: 0,
                            margin: 0,
                            listStyle: 'disc inside',
                        }}
                    >
                        {errorMessages.map((message, index) => (
                            <li key={index} style={{ marginBottom: '0.5rem' }}>
                                {message}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span>{formattedMessage}</span> // If only one error message, display as before
                )}
            </div>
        </Notification>,
    )
}
