import { ComponentSizeFactory } from "../../src/factory/ComponentSizeFactory";

describe("ComponentSizeFactory", () => {
	it("should return a S size", () => {
		const sizeName = "S";
		const component = ComponentSizeFactory.create(sizeName);

		expect(component.name).toBe(sizeName);
	});

	it("should return a M size", () => {
		const sizeName = "M";
		const component = ComponentSizeFactory.create(sizeName);

		expect(component.name).toBe(sizeName);
	});

	it("should return a L size", () => {
		const sizeName = "L";
		const component = ComponentSizeFactory.create(sizeName);

		expect(component.name).toBe(sizeName);
	});
});
