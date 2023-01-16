import ComponentLoader from '../../src/loader/ComponentLoader'
import HtmlStringWriter from '../mock/HtmlStringWriter'

describe("ComponentLoader", () => {
  let configuration = {
    param1: { type:"text", caption:"Param 1:", size: "P" },
    param2: { type:"text", caption:"Param 2:", size: "P" },
  }
  
  it("should return a list of 2 components", () => {
    const htmlReaderWriter = new HtmlStringWriter();
    const loader = new ComponentLoader(configuration, htmlReaderWriter);
    const components = loader.load();

    expect(components.length).toBe(2);
  });

  it("should return a component string", () => {
    const htmlReaderWriter = new HtmlStringWriter();
    const loader = new ComponentLoader(configuration, htmlReaderWriter);
    const components = loader.load();

    expect(components[0].type).toBe("text");
  });

  it("should return a component with caption Param 1:", () => {
    const htmlReaderWriter = new HtmlStringWriter();
    const loader = new ComponentLoader(configuration, htmlReaderWriter);
    const components = loader.load();

    expect(components[0].caption).toBe("Param 1:");
  });

  it("should return a component with name param1", () => {
    const htmlReaderWriter = new HtmlStringWriter();
    const loader = new ComponentLoader(configuration, htmlReaderWriter);
    const components = loader.load();

    expect(components[0].name).toBe("param1");
  });

  it("should return a component with size P", () => {
    const htmlReaderWriter = new HtmlStringWriter();
    const loader = new ComponentLoader(configuration, htmlReaderWriter);
    const components = loader.load();

    expect(components[0].size.name).toBe("P");
  });
});
