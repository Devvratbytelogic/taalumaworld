"use client"

import { useRef } from "react"

export interface OtpInputProps {
    /** Current OTP value (string of digits) */
    value: string
    /** Called when OTP value changes */
    onChange: (value: string) => void
    /** Number of digits. Default 6 */
    length?: number
    /** Called when all digits are filled */
    onComplete?: (value: string) => void
    /** Disable all inputs */
    isDisabled?: boolean
    /** Only allow numeric input. Default true */
    numericOnly?: boolean
    /** Custom class names */
    classNames?: {
        wrapper?: string
        inputWrapper?: string
        input?: string
    }
    /** Accessible label prefix for each digit (e.g. "Digit" → "Digit 1", "Digit 2") */
    ariaLabelPrefix?: string
}

const defaultClassNames = {
    inputWrapper: "w-12 h-12 shrink-0 flex items-center justify-center border border-muted-color rounded-[10px] bg-white focus-within:border-body-color/40 transition-colors",
    input: "w-full h-full text-center text-lg font-semibold text-body-color bg-transparent outline-none border-0 p-0",
}

export default function OtpInput({
    value,
    onChange,
    length = 4,
    onComplete,
    isDisabled = false,
    numericOnly = true,
    classNames = {},
    ariaLabelPrefix = "Digit",
}: OtpInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const digits = value.split("").concat(Array(Math.max(0, length - value.length)).fill("")) as string[]
    const digitsSliced = digits.slice(0, length)

    const triggerChange = (nextDigits: string[]) => {
        const nextValue = nextDigits.join("").slice(0, length)
        onChange(nextValue)
        if (nextValue.length === length && onComplete) {
            onComplete(nextValue)
        }
    }

    const handleChange = (index: number, raw: string) => {
        let char = raw.length > 1 ? raw.slice(-1) : raw
        if (char && numericOnly && !/^\d$/.test(char)) return
        const next = [...digitsSliced]
        next[index] = char
        triggerChange(next)
        if (char && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digitsSliced[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
            const next = [...digitsSliced]
            next[index - 1] = ""
            triggerChange(next)
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasted = (numericOnly
            ? e.clipboardData.getData("text").replace(/\D/g, "")
            : e.clipboardData.getData("text")
        ).slice(0, length)
        const next = [...digitsSliced]
        pasted.split("").forEach((char, i) => {
            next[i] = char
        })
        triggerChange(next)
        const focusIndex = Math.min(pasted.length, length - 1)
        inputRefs.current[focusIndex]?.focus()
    }

    const wrapperCn = classNames.wrapper ?? ""
    const inputWrapperCn = classNames.inputWrapper ?? defaultClassNames.inputWrapper
    const inputCn = classNames.input ?? defaultClassNames.input

    return (
        <div className={wrapperCn} onPaste={handlePaste}>
            {digitsSliced.map((digit, index) => (
                <div key={index} className={inputWrapperCn}>
                    <input
                        ref={(el) => { inputRefs.current[index] = el }}
                        type="text"
                        inputMode={numericOnly ? "numeric" : "text"}
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        disabled={isDisabled}
                        className={inputCn}
                        aria-label={`${ariaLabelPrefix} ${index + 1}`}
                    />
                </div>
            ))}
        </div>
    )
}
