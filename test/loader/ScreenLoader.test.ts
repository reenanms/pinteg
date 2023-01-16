import HtmlStringWriter from '../mock/HtmlStringWriter'
import ScreenLoader from '../../src/loader/ScreenLoader'
import ComponentLoader from '../../src/loader/ComponentLoader';

describe("ScreenLoader", () => {
  let configuration = {
    param1: { type:"text", caption:"Param", size: "P" },
  }
  
  it("should return an html", () => {
    const htmlReaderWriter = new HtmlStringWriter();
    const componentLoader = new ComponentLoader(configuration, htmlReaderWriter);
    const components = componentLoader.load();

    new ScreenLoader(components, htmlReaderWriter)
        .load();

    const html = htmlReaderWriter.getHtml();
    expect(html).toBe(`<label for="param1">Param:</label><input type="text" id="param1" name="param1" /><br />`);
  });
});
