import { ComponentSizeFactory } from "../../src/factory/ComponentSizeFactory";

describe("ComponentSizeFactory", () => {
	it("should return a P size", () => {
		const sizeName = "P";
		const component = ComponentSizeFactory.create(sizeName);

		expect(component.name).toBe(sizeName);
	});

	it("should return a M size", () => {
		const sizeName = "M";
		const component = ComponentSizeFactory.create(sizeName);

		expect(component.name).toBe(sizeName);
	});

	it("should return a G size", () => {
		const sizeName = "G";
		const component = ComponentSizeFactory.create(sizeName);

		expect(component.name).toBe(sizeName);
	});
});
