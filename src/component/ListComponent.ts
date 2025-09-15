
import BasicComponent from "./BasicComponent";
import IScreenReaderWriter from "../contract/IScreenReaderWriter";
import IParentComponent from '../contract/IParentComponent';
import IChildComponent from "../contract/IChildComponent";
import { ScreenBasicFieldTypes } from "../contract/IScreenWriter";

export default class ListComponent extends BasicComponent
  implements IChildComponent {  
  public parent: IParentComponent;

  private static NO_SELECT_KEY = "";
  private static NO_SELECT_CAPTION = "< select >"
    
  constructor(readerWriter: IScreenReaderWriter) {
    super(readerWriter, ScreenBasicFieldTypes.List);
  }

  public override build(): void {
    // const html =
    //   `<label for="${this.name}">${this.caption}:</label>` +
    //   `<select name="${this.name}" id="${this.name}" ></select>`;
    
    this.readerWriter.addBasicField(this.type, this.name, this.caption, this.size);
    this.readerWriter.addListener(this.name,
      () => this.valueChangedCallbacks.forEach(callback => callback(this))
    );

    if (this.parent != null)
      this.parent.addValueChangedListener(e => this.setOptions(e));

    this.setOptions(this.parent);
  }

  public override writeValue(value: any): void {
    const validValue = this.getValidValue(value);
    this.readerWriter.setValueByElementName(this.name, validValue);
    this.valueChangedCallbacks.forEach(callback => callback(this));
  }

  private getValidValue(value: any): any {
    const parentValue = this.parent?.readValue();
    const options = this.getOptions(parentValue);

    for (let it of options) {
      if (it.key === value)
        return it.key;
    }

    return ListComponent.NO_SELECT_KEY; 
  }

  private setOptions(parent: IParentComponent): void {
    const parentValue = parent?.readValue();
    const options = this.getOptions(parentValue);

    this.readerWriter
      .setOptionsByElementName(this.name, options, ListComponent.NO_SELECT_KEY);
  }

  private getOptions(filter?: string): { key: string; caption: string; }[] {
    const filteredOptions = [
      { key: ListComponent.NO_SELECT_KEY, caption: ListComponent.NO_SELECT_CAPTION }
    ];
    
    if (this.props == null)
      return filteredOptions;

    const options = this.props.get("options") as { key: string; caption: string; filter?: string; }[];
    if (options == null)
      return filteredOptions;
    
    for (const option of options) {
      if (option != null && option.filter != filter)
        continue;
      
        filteredOptions.push(option);
    }

    return filteredOptions;
  }
}
