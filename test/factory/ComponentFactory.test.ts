import ComponentFactory from "../../src/factory/ComponentFactory";

describe("ComponentFactory", () => {
	it("should return a string type", () => {
		const typeName = "string";
		const component = ComponentFactory.create(typeName);

		expect(component.type).toBe(typeName);
	});
});
