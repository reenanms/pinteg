import ComponentLoader from '../../src/loader/ComponentLoader'

describe("ComponentLoader", () => {
  let configuration = {
    param1: { type:"string", caption:"Param 1:", size: "P" },
    param2: { type:"string", caption:"Param 2:", size: "P" },
  }
  
  it("should return a list of 2 components", () => {
    const loader = new ComponentLoader(configuration);
    const components = loader.load();

    expect(components.length).toBe(2);
  });

  it("should return a component string", () => {
    const loader = new ComponentLoader(configuration);
    const components = loader.load();

    expect(components[0].type).toBe("string");
  });

  it("should return a component with caption Param 1:", () => {
    const loader = new ComponentLoader(configuration);
    const components = loader.load();

    expect(components[0].caption).toBe("Param 1:");
  });

  it("should return a component with name param1", () => {
    const loader = new ComponentLoader(configuration);
    const components = loader.load();

    expect(components[0].name).toBe("param1");
  });

  it("should return a component with size P", () => {
    const loader = new ComponentLoader(configuration);
    const components = loader.load();

    expect(components[0].size.name).toBe("P");
  });
});
