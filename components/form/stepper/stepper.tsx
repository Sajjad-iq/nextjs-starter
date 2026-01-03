import React from 'react'
import { FormBuilder } from '../formBuilder/form-builder'
import { StepperContext } from './context'
import { StepperButton } from './StepperButton'
import type { StepperProps, StepperContextValue } from './types'

// Main Stepper Component
export const Stepper = ({ steps, children, ...props }: StepperProps) => {
    const [currentStep, setCurrentStep] = React.useState(0)

    const contextValue: StepperContextValue = {
        currentStep,
        totalSteps: steps.length,
        goToNext: () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1)),
        goToPrevious: () => setCurrentStep(prev => Math.max(prev - 1, 0)),
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === steps.length - 1,
    }

    return (
        <StepperContext.Provider value={contextValue}>
            <div className="flex flex-col gap-4">

                <FormBuilder {...props}>
                    {steps[currentStep].content}
                    {children}
                </FormBuilder>
            </div>
        </StepperContext.Provider>
    )
}

// Attach compound component
Stepper.Button = StepperButton
