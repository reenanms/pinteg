# PInteg String Template Engine Specification

The `pinteg-string-template` package provides a robust and extensible engine for string interpolation, mathematical evaluation, and functional processing within templates.

## Overview

The engine processes templates containing placeholders and transforms them using a provided data object. It supports simple variable replacement, complex expressions with arithmetic operations, and calls to registered functions.

## Syntax

### 1. Variables
Variables are accessed using the `${...}` syntax. Nested properties are supported using dot notation.
- `${user.name}`
- `${order.items.0.price}`

### 2. Basic Operations
The engine supports standard arithmetic operations within the interpolation markers.
- **Addition:** `${price + tax}`
- **Subtraction:** `${total - discount}`
- **Multiplication:** `${quantity * unitPrice}`
- **Division:** `${total / itemCount}`

### 3. Functions
Functions can be called within the `${...}` syntax. They accept variables, constants, or the results of other expressions as arguments.
- **Syntax:** `${FUNCTION_NAME(arg1, arg2, ...)}`
- **Example:** `${SUM(order.total, order.tax)}`
- **Nested Functions:** `${UPPER(SUBSTRING(user.name, 0, 1))}`

### 4. List Iteration
To handle lists, the engine supports block-based iteration.
- **Start:** `${begin:listName}`
- **End:** `${end:listName}`
- **Content:** The content between the start and end markers is repeated for each item in the list, with the item's properties becoming available in the local scope.

## Core Components

### TemplateEngine
The main entry point for the package.
- `render(template: string, data: object): string`
- `registerFunction(name: string, fn: Function): void`

### Function Registry
A repository of available functions. The following built-in functions are provided by default:
- `SUM(...numbers)`: Returns the sum of all arguments.
- `SUBSTRING(text, start, length)`: Returns a portion of the text.
- `UPPER(text)`: Converts text to uppercase.
- `LOWER(text)`: Converts text to lowercase.
- `IF(condition, trueValue, falseValue)`: Returns values based on a condition.

## Error Handling

- **Missing Variables:** By default, missing variables should resolve to an empty string or a configurable default value.
- **Invalid Functions:** Attempting to call a non-existent function will throw a `TemplateError`.
- **Syntax Errors:** Malformed expressions inside `${...}` will throw a `TemplateError` detailing the location and nature of the error.

## Extensibility

Users can register custom functions to extend the engine's capabilities:
```typescript
engine.registerFunction('FORMAT_CURRENCY', (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
});
```

## Example Usage

**Template:**
```html
Hello ${user.name},
Your total is ${FORMAT_CURRENCY(SUM(order.subtotal, order.tax))}.
Items:
${begin:items}
- ${name}: ${FORMAT_CURRENCY(price)}
${end:items}
```

**Data:**
```json
{
  "user": { "name": "John Doe" },
  "order": {
    "subtotal": 100,
    "tax": 8,
    "items": [
      { "name": "Product A", "price": 50 },
      { "name": "Product B", "price": 50 }
    ]
  }
}
```
