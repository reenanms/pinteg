import IComponent from "../contract/IComponent"
import IComponentSize from "../contract/IComponentSize"
import IHtmlWriter from "../contract/IHtmlWriter"

export default class ListComponent implements IComponent {
  public type: string = "list";
  public name: string;
  public caption: string;
  public size: IComponentSize;
  public props: Map<string, any>;

  public build(writer: IHtmlWriter): void {
    const htmlOptions = this.getHtmlOptions();

    const html =
    `<label for="${this.name}">${this.caption}:</label>` +
    `<select name="${this.name} id="${this.name}" >${htmlOptions}</select>`;
    
    writer.addHtml(html);
  }

  private getHtmlOptions() {
    const options = this.props.get("options") as { key: string; caption: string; }[];
    const htmlOptions = options.map(option => `<option value="${option.key}">${option.caption}</option>`);
    return htmlOptions;
  }
}
