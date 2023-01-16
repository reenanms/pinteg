
import BasicComponent from "./BasicComponent";
import IScreenReaderWriter from "../contract/IScreenReaderWriter";

export default class ListComponent extends BasicComponent {
  constructor(readerWriter: IScreenReaderWriter) {
    super(readerWriter, "list");
  }

  public override build(): void {
    const htmlOptions = this.getHtmlOptions();

    const html =
    `<label for="${this.name}">${this.caption}:</label>` +
    `<select name="${this.name}" id="${this.name}" >${htmlOptions}</select>`;
    
    this.readerWriter.addHtml(html);
  }

  private getHtmlOptions() {
    const options = this.props.get("options") as { key: string; caption: string; }[];
    const htmlOptions = options.map(option => `<option value="${option.key}">${option.caption}</option>`);
    return htmlOptions;
  }
}
