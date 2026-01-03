import type { FormBuilderProps } from '../formBuilder/form-builder'

export interface Step {
    title: string
    content: React.ReactNode
}

export interface StepperProps extends Omit<FormBuilderProps, 'children'> {
    steps: Step[]
    children?: React.ReactNode
}

export interface StepperContextValue {
    currentStep: number
    totalSteps: number
    goToNext: () => void
    goToPrevious: () => void
    isFirstStep: boolean
    isLastStep: boolean
}

export interface StepperButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    direction: 'next' | 'prev' | 'submit'
}
