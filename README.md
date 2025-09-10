# PInteg
> Library for generating CRUD screens at runtime!

PInteg is a TypeScript/JavaScript library designed to dynamically generate HTML CRUD screens from a JSON configuration object. It simplifies the creation of CRUD interfaces, commonly used in most systems. In addition to generating screens, PInteg allows you to read and write objects based on the current state of your screen.

## Features
- Generate HTML screens for CRUD operations from JSON configuration
- Supports multiple component types: string, list, double, integer, text, etc.
- Read and write objects to/from the screen
- Easy integration with any web project
- Extensible and customizable

## Getting Started

### Debugging the Library
To run the library locally, clone the repository, install dependencies, and run the debug command:
```sh
npm install
npm run debug
```

### Installation
Install the library in your project:
```sh
npm i pinteg
```

### Creating Your First Screen
```typescript
import pinteg from "pinteg";

const configuration = {
	param1: { type: "string", caption: "Sample with string:", size: "P" },
	param2: {
		type: "list",
		caption: "Sample with list:",
		size: "P",
		options: [
			{ key: "keyA", caption: "caption A" },
			{ key: "keyB", caption: "caption B" }
		]
	},
	param3: { type: "double", caption: "Sample with double:", size: "P" },
};

pinteg
	.setDivId("app")
	.setConfiguration(configuration)

	.buildScreen();
```

### Writing Values to the Screen
```typescript
const initialObject = {
	param1: "string value",
	param2: "keyB",
	param3: 9.9,
};

pinteg.writeObject(initialObject);
```

### Reading Values from the Screen
```typescript
const finalObject = pinteg.readObject();
console.log(finalObject);
```

## Documentation
See the `docs/` folder for more details and advanced usage examples.

## Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

## License
This project is licensed under the MIT License.
