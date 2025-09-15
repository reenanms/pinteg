import { UnsupportedComponentTypeError } from "../../src/error/Errors";
import ComponentFactory from "../../src/factory/ComponentFactory";
import StringScreenReaderWriter from '../mock/HtmlStringWriter'

describe("ComponentFactory", () => {
	it("should return a string type", () => {
		const typeName = "text";
		const componentDefinition = { type: typeName, caption: "text", size: "P" };
		const htmlReaderWriter = new StringScreenReaderWriter();

		const component = ComponentFactory.create(typeName, componentDefinition, htmlReaderWriter);

		expect(component.type).toBe(typeName);
	});
});

describe("ComponentFactory", () => {
	it("Unsupported component type", () => {
		const typeName = "invalidType";
		const componentDefinition = { type: typeName, caption: "text", size: "P" };
		const htmlReaderWriter = new StringScreenReaderWriter();

		const callbackThrowError = () => { ComponentFactory.create(typeName, componentDefinition, htmlReaderWriter) };

		expect(callbackThrowError)
			.toThrow(new UnsupportedComponentTypeError(typeName).message);
	});
});
