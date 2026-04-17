/**
 * Represents the three mutually exclusive states of an accordion record panel.
 * Using a union type instead of two booleans eliminates impossible states
 * (e.g. isCreating=true AND isEditing=false simultaneously).
 */
export type RecordStatus = 'viewing' | 'editing' | 'creating';
