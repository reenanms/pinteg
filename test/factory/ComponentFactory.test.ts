import ComponentFactory from "../../src/factory/ComponentFactory";
import HtmlStringWriter from '../mock/HtmlStringWriter'

describe("ComponentFactory", () => {
	it("should return a string type", () => {
		const typeName = "text";
		const componentDefinition = { type: typeName, caption: "text", size: "P" };
		const htmlReaderWriter = new HtmlStringWriter();

		const component = ComponentFactory.create(typeName, componentDefinition, htmlReaderWriter);

		expect(component.type).toBe(typeName);
	});
});
