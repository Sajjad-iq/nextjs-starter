import { Button } from '@/components/ui/button'
import { useStepperContext } from './context'
import type { StepperButtonProps } from './types'

export const StepperButton = ({ direction, children, ...props }: StepperButtonProps) => {
    const { goToNext, goToPrevious, isFirstStep, isLastStep } = useStepperContext()

    const isNext = direction === 'next'
    const isPrev = direction === 'prev'
    const isSubmit = direction === 'submit'

    // Hide submit button until last step
    if (isSubmit && !isLastStep) {
        return null
    }

    // Hide next button on last step (when submit button should show)
    if (isNext && isLastStep) {
        return null
    }

    // Determine if button should be disabled
    const disabled = (isPrev && isFirstStep)

    // Determine button type
    const buttonType = isSubmit ? 'submit' : 'button'

    // Default labels
    const defaultLabel = isSubmit
        ? 'Submit'
        : isNext
            ? 'Next'
            : 'Previous'

    // Click handler (only for non-submit buttons)
    const handleClick = isNext ? goToNext : isPrev ? goToPrevious : undefined

    return (
        <Button
            type={buttonType}
            onClick={buttonType === 'button' ? handleClick : undefined}
            disabled={disabled}
            variant={isPrev ? 'outline' : 'default'}
            {...props}
        >
            {children || defaultLabel}
        </Button>
    )
}
