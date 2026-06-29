'use client'

import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'

export type AgreementCheckboxProps = {
    id: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    onBlur?: () => void
    disabled?: boolean
    error?: string
    touched?: boolean
    children: React.ReactNode
}

export function AgreementCheckbox({
    id,
    checked,
    onCheckedChange,
    onBlur,
    disabled,
    error,
    touched,
    children,
}: AgreementCheckboxProps) {
    const hasError = Boolean(error && touched)

    return (
        <div className="flex items-start gap-3">
            <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={(value) => onCheckedChange(value === true)}
                onBlur={onBlur}
                disabled={disabled}
                aria-invalid={hasError}
                className={`mt-0.5 rounded-md ${hasError ? 'border-red-500 data-[state=checked]:border-red-500' : ''}`}
            />
            <label
                htmlFor={id}
                className={`text-sm leading-snug cursor-pointer ${hasError ? 'text-red-600' : 'text-foreground'}`}
            >
                {children}
            </label>
        </div>
    )
}
