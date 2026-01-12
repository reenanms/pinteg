import { BasicComponent } from '../../src/component/BasicComponent';
import { TextComponent } from '../../src/component/TextComponent';
import { ComponentLoader } from '../../src/loader/ComponentLoader'
import { StringScreenReaderWriter } from '../mock/StringScreenReaderWriter'

describe("ComponentLoader", () => {
  let schema = {
    param1: { type:"text", caption:"Param 1:", size: "S" },
    param2: { type:"text", caption:"Param 2:", size: "S" },
  }
  
  it("should return a list of 2 components", () => {
    const htmlReaderWriter = new StringScreenReaderWriter();
    const loader = new ComponentLoader(schema, () => htmlReaderWriter);
    const components = loader.load();

    expect(components.size).toBe(2);
  });

  it("should return a component string", () => {
    const htmlReaderWriter = new StringScreenReaderWriter();
    const loader = new ComponentLoader(schema, () => htmlReaderWriter);
    const components = loader.load();

    expect(components.get("param1") instanceof TextComponent).toBe(true);
  });

  it("should return a component with caption Param 1:", () => {
    const htmlReaderWriter = new StringScreenReaderWriter();
    const loader = new ComponentLoader(schema, i => htmlReaderWriter);
    const components = loader.load();

    expect((components.get("param1") as any).caption).toBe("Param 1:");
  });

  it("should return a component with name param1", () => {
    const htmlReaderWriter = new StringScreenReaderWriter();
    const loader = new ComponentLoader(schema, i => htmlReaderWriter);
    const components = loader.load();

    expect((components.get("param1") as any).name).toBe("param1");
  });

  it("should return a component with size S", () => {
    const htmlReaderWriter = new StringScreenReaderWriter();
    const loader = new ComponentLoader(schema, i => htmlReaderWriter);
    const components = loader.load();

    expect((components.get("param1") as any).size.name).toBe("S");
  });
});
