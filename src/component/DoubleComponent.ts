import IComponent from "../contract/IComponent"
import IComponentSize from "../contract/IComponentSize"
import IHtmlWriter from "../contract/IHtmlWriter"

export default class DoubleComponent implements IComponent {
  public name: string = "";
  public type: string = "double";
  public caption: string = "";
  public size: IComponentSize;

  public build(writer: IHtmlWriter): void {
    const html =
    `<label for="${this.name}">${this.caption}:</label>` +
    `<input type="number" step="0.01" id="${this.name}" />`;
     
     writer.addHtml(html);
  }
}
