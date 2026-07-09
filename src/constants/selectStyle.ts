import { StylesConfig } from "react-select";

export type SelectOption = { value: string; label: string };

export const SELECT_STYLES: StylesConfig<SelectOption, false> = {
    control: (base, state) => ({
        ...base,
        minHeight: 42,
        borderRadius: 'var(--radius-sm)',
        borderColor: state.isFocused
            ? 'color-mix(in srgb, var(--primary) 30%, transparent)'
            : '#e5e7eb',
        backgroundColor: '#ffffff',
        boxShadow: state.isFocused
            ? '0 0 0 2px color-mix(in srgb, var(--primary) 10%, transparent)'
            : 'none',
        fontSize: '0.875rem',
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        opacity: state.isDisabled ? 0.5 : 1,
        '&:hover': {
            borderColor: state.isFocused
                ? 'color-mix(in srgb, var(--primary) 30%, transparent)'
                : '#e5e7eb',
        },
    }),
    valueContainer: (base) => ({
        ...base,
        padding: '0 12px',
        // border: 'none',
    }),
    input: (base) => ({
        ...base,
        boxShadow: 'none',
    }),
    placeholder: (base) => ({
        ...base,
        color: '#9ca3af',
    }),
    singleValue: (base) => ({
        ...base,
        color: '#111827',
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),
};