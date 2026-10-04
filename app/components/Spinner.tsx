import { Spinner } from '@radix-ui/themes'

interface Props {
    isSubmitting?: boolean
    color?: string
}

const InlineSpinner = ({ isSubmitting = false, color = 'red' }: Props) => {
    if (!isSubmitting) return null;

    return (
        <Spinner />
    )
}

export default InlineSpinner