import { TextComponent } from "../../src/component/TextComponent";
import { UnsupportedComponentTypeError } from "../../src/error/Errors";
import { ComponentFactory } from "../../src/factory/ComponentFactory";
import { StringScreenReaderWriter } from '../mock/StringScreenReaderWriter'

describe("ComponentFactory", () => {
	it("should return a string type", () => {
		const typeName = "text";
		const componentDefinition = { type: typeName, caption: "text", size: "P" };
		const htmlReaderWriter = new StringScreenReaderWriter();

		const component = ComponentFactory.createFromProperty([typeName, componentDefinition], htmlReaderWriter);
		
		expect(component instanceof TextComponent).toBe(true);
	});
});

describe("ComponentFactory", () => {
	it("Unsupported component type", () => {
		const typeName = "invalidType";
		const componentDefinition = { type: typeName, caption: "text", size: "P" };
		const htmlReaderWriter = new StringScreenReaderWriter();

		const callbackThrowError = () => ComponentFactory.createFromTypeName(typeName, htmlReaderWriter);

		expect(callbackThrowError)
			.toThrow(new UnsupportedComponentTypeError(typeName).message);
	});
});
