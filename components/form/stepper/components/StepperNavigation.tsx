import { useFormContext, useWatch } from 'react-hook-form'
import { useStepperContext } from '../context'

export const StepperNavigation = () => {
    const { steps, currentStep, orientation } = useStepperContext()
    const formContext = useFormContext()

    // Watch all form values to trigger re-render on change
    // Only watch if formContext exists
    const formValues = formContext ? useWatch({ control: formContext.control }) : {}

    const isVertical = orientation === 'vertical'
    const isHorizontal = orientation === 'horizontal'

    // Calculate progress based on filled form fields
    const calculateProgress = () => {
        if (!formContext || !formValues || Object.keys(formValues).length === 0) return 0

        const allFields = Object.keys(formValues)
        const filledFields = allFields.filter(key => {
            const value = formValues[key]
            return value !== '' && value !== null && value !== undefined
        })

        return allFields.length > 0
            ? (filledFields.length / allFields.length) * 100
            : 0
    }

    const progressPercentage = calculateProgress()

    return (
        <div className={`flex gap-4 ${isVertical ? 'flex-col' : 'flex-row items-start'}`}>
            {steps.map((step, index) => {
                const isActive = index === currentStep
                const isCompleted = index < currentStep

                return (
                    <div key={index} className={`relative ${isHorizontal ? 'flex-1' : ''}`}>
                        <div className={`flex ${isVertical ? 'flex-row gap-4' : 'flex-col gap-2'} items-start`}>
                            {/* Indicator dot */}
                            <div
                                className={`w-[10px] h-[10px] rounded-full border-2 transition-colors shrink-0 ${isCompleted
                                    ? 'bg-primary border-primary'
                                    : isActive
                                        ? 'bg-primary border-primary'
                                        : 'bg-background border-border'
                                    }`}
                            />

                            {/* Step title */}
                            <div className={`text-sm font-medium transition-colors ${isActive
                                ? 'text-primary'
                                : isCompleted
                                    ? 'text-foreground'
                                    : 'text-muted-foreground'
                                }`}>
                                {step.title}
                            </div>
                        </div>

                        {/* Connecting line to next step - colored based on form completion */}
                        <div
                            className={`transition-all duration-300 ${isVertical
                                ? 'absolute left-[4px] top-[10px] w-[2px] h-4'
                                : 'absolute top-[4px] left-full w-full h-[2px] -translate-x-full'
                                } bg-border overflow-hidden`}
                        >
                            <div
                                className="bg-primary transition-all duration-300"
                                style={{
                                    width: isVertical ? '100%' : `${progressPercentage}%`,
                                    height: isHorizontal ? '100%' : `${progressPercentage}%`
                                }}
                            />
                        </div>

                    </div>
                )
            })}
        </div>
    )
}
