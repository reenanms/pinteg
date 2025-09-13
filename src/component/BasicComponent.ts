import IComponent from "../contract/IComponent";
import IComponentSize from "../contract/IComponentSize";
import IParentComponent from "../contract/IParentComponent";
import IScreenReaderWriter from "../contract/IScreenReaderWriter";
import { ScreenBasicFieldTypes } from "../contract/IScreenWriter";

export default class BasicComponent implements IComponent, IParentComponent {
  protected readonly readerWriter: IScreenReaderWriter;
  protected valueChangedCallbacks: ((component: IParentComponent) => void)[] = [];

  public readonly type: ScreenBasicFieldTypes;
  public name: string;
  public caption: string;
  public size: IComponentSize;
  public props: Map<string, any>;
  

  protected constructor(readerWriter: IScreenReaderWriter, type: ScreenBasicFieldTypes) {
    this.readerWriter = readerWriter;
    this.type = type;
  }

  public addValueChangedListener(callback: (component: IParentComponent) => void): void {
    this.valueChangedCallbacks.push(callback);
  }

  public build(): void {
    this.readerWriter.addBasicField(this.type, this.name, this.caption);
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
