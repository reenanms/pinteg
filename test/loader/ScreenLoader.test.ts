import HtmlStringWriter from '../mock/writer/HtmlStringWriter'
import ScreenLoader from '../../src/loader/ScreenLoader'
import ComponentLoader from '../../src/loader/ComponentLoader';

describe("ScreenLoader", () => {
  let configuration = {
    param1: { type:"string", caption:"Param", size: "P" },
  }
  
  it("should return an html", () => {
	const htmlWriter = new HtmlStringWriter();
	const componentLoader = new ComponentLoader(configuration);
    const components = componentLoader.load();

    new ScreenLoader(htmlWriter, components)
    	.load();

	const html = htmlWriter.getHtml();
    expect(html).toBe(`<label for="param1">Param:</label><input type="text" id="param1" name="param1" /><br />`);
  });
});
