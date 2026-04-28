# PInteg Validation Manager

## Motivation
To ensure data integrity and provide a consistent user experience, we need a centralized **Validation Manager**. Similar to the [Data Source Manager](./data_source_manager.md), it will allow developers to register validation logic by name and apply it to fields across the application. This decouples validation rules from specific UI components and allows for reusable, platform-agnostic validation.

## Key Features
- **Centralized Registration**: Register validation functions with a unique name.
- **Severity Levels**: Support for both `error` (blocks saving) and `warning` (notifies user but allows saving).
- **Flexible Messages**: Validations can return custom messages dynamically.
- **Field-Level Integration**: Multiple validations can be applied to a single field.
- **Triggered Validation**: Validations run automatically when a field value changes and during the "Save" process.
- **Default Validations**: Built-in field types come with pre-configured "hardcoded" validations.
- **UI Signaling**: Fields visually indicate errors and warnings using colors, icons, and messages.
- **Save Interruption**: Save operations are blocked by errors and require confirmation for warnings.

## Proposed API

### 1. Registering a Validation
Developers register a validation using a unique name and a validation function.

```typescript
import { ValidationManager } from '@pinteg/validation';

// Simple required validation
ValidationManager.register('IsRequired', (value) => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: 'This field is required', severity: 'error' };
  }
  return { isValid: true };
});

// Custom logic with warning
ValidationManager.register('PositiveNumber', (value) => {
  if (value < 0) {
    return { isValid: false, message: 'Value should be positive', severity: 'warning' };
  }
  return { isValid: true };
});
```

### 2. Validation Function Interface
The validation function can be synchronous or asynchronous.

```typescript
type ValidationSeverity = 'error' | 'warning';

interface ValidationResult {
  isValid: boolean;
  message?: string;
  severity?: ValidationSeverity;
}

type ValidationFn = (value: any, context?: any) => ValidationResult | Promise<ValidationResult>;

interface ValidationManager {
  register(name: string, fn: ValidationFn): void;
  validate(name: string, value: any, context?: any): Promise<ValidationResult>;
  validateMultiple(names: string[], value: any, context?: any): Promise<ValidationResult[]>;
}
```

### 3. Field Configuration (XML/JSON)
Validations are linked to fields by their registered names.

```xml
<field name="quantity" type="integer" label="Quantity">
  <validation name="IsRequired" />
  <validation name="PositiveNumber" />
</field>
```

## Execution Flow

### On Change
Whenever a field value changes, the `ValidationManager` will execute all validations associated with that field. The UI component (e.g., `IntegerField`) will receive the validation status to display errors or warnings.

### On Save
Before a "Save" action is finalized, the system will run all validations for all fields in the current context. If any `error` level validation fails, the save operation is aborted, and the user is notified.

## Default Validations
Standard PInteg fields will come with default validations based on their `type`:

| Field Type | Default Validation | Rule |
| :--- | :--- | :--- |
| `integer` | `IsInteger` | Ensures the value is a whole number. |
| `double` | `IsNumber` | Ensures the value is a valid number. |
| `email` | `IsEmail` | Validates email format. |

## User Interface & Experience

### 1. Field Signaling
When a validation fails, the field must provide immediate visual feedback:
- **Coloration**: The field border or background should change color (e.g., Red for `error`, Orange/Amber for `warning`).
- **Icons**: An appropriate icon (e.g., `!` in a circle for errors, `triangle` for warnings) should appear inside or near the field.
- **Message**: The validation message should be displayed directly below the field in small, clear text.

### 2. Save Process Behavior
Clicking "Save" initiates a full validation of all fields.

#### Scenario: Errors Found
- The save operation is **aborted**.
- All invalid fields are highlighted.
- A summary dialog or notification appears listing all **Error** and **Warning** messages.
- The user must fix all errors before they can attempt to save again.

#### Scenario: Only Warnings Found
- The save operation is **paused**.
- A confirmation dialog appears (similar to the "Delete" confirmation).
- This dialog displays the list of warning messages.
- The user can choose to **Proceed** (ignore warnings and save) or **Cancel** (go back to edit).

## UI Integration
The `FieldRendererProps` in `pinteg-core` will be updated to include the validation state:

```typescript
export interface FieldRendererProps {
    // ... existing props
    validationResult?: ValidationResult;
}
```
