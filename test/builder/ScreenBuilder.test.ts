import { StringScreenReaderWriter } from '../mock/StringScreenReaderWriter'
import { ScreenBuilder } from '../../src/builder/ScreenBuilder';
import { ComponentFactory } from '../../src/factory/ComponentFactory';
import { BuildConfig } from '../../src/contract/IComponent';

describe("ScreenBuilder", () => {
  const schema = {
    param1: { type:"text", caption:"Param", size: "P" },
  }
  
  it("should return an html", () => {
    const htmlReaderWriter = new StringScreenReaderWriter();

    const component = ComponentFactory.createFromSchema(schema, htmlReaderWriter);

    new ScreenBuilder(component)
        .build(new BuildConfig());

    const html = htmlReaderWriter.getHtml();
    expect(html).toBe(`<basicField type="text" name="param1" caption="Param" />`);
  });
});
