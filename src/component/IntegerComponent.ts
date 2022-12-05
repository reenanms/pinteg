import IComponent from "../contract/IComponent"
import IComponentSize from "../contract/IComponentSize"
import IHtmlWriter from "../contract/IHtmlWriter"

export default class DoubleComponent implements IComponent {
  public type: string = "double";
  public name: string;
  public caption: string;
  public size: IComponentSize;
  public props: Map<string, any>;

  public build(writer: IHtmlWriter): void {
    const html =
    `<label for="${this.name}">${this.caption}:</label>` +
    `<input type="number" step="1" id="${this.name}" name="${this.name}" />`;
     
     writer.addHtml(html);
  }
}
