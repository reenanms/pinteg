import IComponent from "../contract/IComponent"
import IComponentSize from "../contract/IComponentSize"
import IHtmlWriter from "../contract/IHtmlWriter"

export default class TextComponent implements IComponent {
  public name: string = "";
  public type: string = "string";
  public caption: string = "";
  public size: IComponentSize;

  public build(writer: IHtmlWriter): void {
    const html =
    `<label for="${this.name}">${this.caption}:</label>` +
    `<input type="text" id="${this.name}" />`;
     
     writer.addHtml(html);
  }
}
