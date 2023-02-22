import IComponent from "../contract/IComponent";
import IComponentSize from "../contract/IComponentSize";
import IParentComponent from "../contract/IParentComponent";
import IScreenReaderWriter from "../contract/IScreenReaderWriter";

export default class BasicComponent implements IComponent, IParentComponent {
  protected readonly readerWriter: IScreenReaderWriter;
  protected valueChangedCallbacks: ((component: IParentComponent) => void)[] = [];

  public readonly type: string;
  public name: string;
  public caption: string;
  public size: IComponentSize;
  public props: Map<string, any>;
  

  protected constructor(readerWriter: IScreenReaderWriter, type: string) {
    this.readerWriter = readerWriter;
    this.type = type;
  }

  public addValueChangedListener(callback: (component: IParentComponent) => void): void {
    this.valueChangedCallbacks.push(callback);
  }

  public build(): void {
    const html = `<label for="${this.name}">${this.caption}:</label>` +
      `<input type="${this.type}" id="${this.name}" name="${this.name}" />`;

    this.readerWriter.addHtml(html);
    this.readerWriter.addListener(
      this.name, () => this.valueChangedCallbacks.forEach(callback => callback(this))
    );
  }

  public writeValue(value: any): void {
    this.readerWriter.setValueByElementName(this.name, value);
    this.valueChangedCallbacks.forEach(callback => callback(this));
  }

  public readValue(): any {
    return this.readerWriter.getValueByElementName(this.name);
  }
}
