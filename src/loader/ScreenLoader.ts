import IComponent from "../contract/IComponent"
import IHtmlWriter from "../contract/IHtmlWriter"

export default class ScreenLoader {
  private htmlWriter: IHtmlWriter;
  private components: IComponent[];

  public constructor(htmlWriter: IHtmlWriter, components: IComponent[]) {
    this.htmlWriter = htmlWriter;
    this.components = components;
  }
  
  public load(): void {
    for (const component of this.components) {
      component.build(this.htmlWriter);
      this.htmlWriter.addNewLine();
    }
  }
}
