import IComponent from "../contract/IComponent";
import IComponentSize from "../contract/IComponentSize";
import IScreenReaderWriter from "../contract/IScreenReaderWriter";

export default class BasicComponent implements IComponent {
  protected readonly readerWriter: IScreenReaderWriter;
  public readonly type: string;
  public name: string;
  public caption: string;
  public size: IComponentSize;
  public props: Map<string, any>;

  protected constructor(readerWriter: IScreenReaderWriter, type: string) {
    this.readerWriter = readerWriter;
    this.type = type;
  }

  public build(): void {
    const html = `<label for="${this.name}">${this.caption}:</label>` +
      `<input type="${this.type}" id="${this.name}" name="${this.name}" />`;

    this.readerWriter.addHtml(html);
  }

  public writeValue(value: any): void {
    this.readerWriter.setValueByElementName(this.name, value);
  }

  public readValue(): any {
    return this.readerWriter.getValueByElementName(this.name);
  }
}
