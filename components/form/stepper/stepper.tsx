import React from 'react'
import { useFormContext } from 'react-hook-form'
import { FormBuilder } from '../formBuilder/form-builder'
import { StepperContext } from './context'
import { StepperButton } from './components/StepperButton'
import { StepperNavigation } from './components/StepperNavigation'
import type { StepperProps, StepperContextValue } from './types'

// Main Stepper Component
export const Stepper = ({ steps, children, orientation = 'vertical', ...props }: StepperProps) => {
    const [currentStep, setCurrentStep] = React.useState(0)

    const contextValue: StepperContextValue = {
        currentStep,
        totalSteps: steps.length,
        steps,
        orientation,
        goToNext: () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1)),
        goToPrevious: () => setCurrentStep(prev => Math.max(prev - 1, 0)),
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === steps.length - 1,
    }

    return (
        <StepperContext.Provider value={contextValue}>
            <div className="flex flex-col gap-6">
                {/* Visual Stepper Navigation */}
                <StepperNavigation />

                {/* Form Content */}
                <FormBuilder {...props}>
                    <FormValuesProvider />
                    {steps[currentStep].content}
                    {children}
                </FormBuilder>
            </div>
        </StepperContext.Provider>
    )
}

// Component to update context with form values
const FormValuesProvider = () => {
    const formContext = useFormContext()
    const stepperContext = React.useContext(StepperContext)

    React.useEffect(() => {
        if (stepperContext && formContext) {
            const subscription = formContext.watch((values) => {
                // Update context with form values
                if (stepperContext) {
                    (stepperContext as any).formValues = values
                }
            })
            return () => subscription.unsubscribe()
        }
    }, [formContext, stepperContext])

    return null
}

// Attach compound component
Stepper.Button = StepperButton
