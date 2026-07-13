import { StylesConfig } from 'react-select';

export type FilterOption = { value: string; label: string };

/** Compact react-select styling for toolbar/filter-bar selects (e.g. admin search panels). */
export const filterSelectStyles: StylesConfig<FilterOption, false> = {
  container: (base) => ({
    ...base,
    minWidth: 160,
  }),
  control: (base, state) => ({
    ...base,
    minHeight: 36,
    borderRadius: 'var(--radius-sm, 0.5rem)',
    borderColor: state.isFocused ? 'color-mix(in srgb, var(--primary) 40%, transparent)' : '#e2e8f0',
    backgroundColor: '#ffffff',
    boxShadow: state.isFocused ? '0 0 0 2px color-mix(in srgb, var(--primary) 10%, transparent)' : 'none',
    fontSize: '0.875rem',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    '&:hover': {
      borderColor: state.isFocused ? 'color-mix(in srgb, var(--primary) 40%, transparent)' : '#e2e8f0',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 10px',
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  placeholder: (base) => ({
    ...base,
    color: '#64748b',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#334155',
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
    pointerEvents: 'auto',
  }),
};
