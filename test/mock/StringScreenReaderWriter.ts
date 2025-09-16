import { IScreenReaderWriter } from "../../src/contract/IScreenReaderWriter";
import { AreaOrientation, ScreenBasicFieldTypes } from "../../src/contract/IScreenWriter";


class FieldInfo {
  type?: ScreenBasicFieldTypes = undefined;
  name?: string = undefined;
  caption?: string = undefined;
  value?: any = undefined;
  options?: { key: string; caption: string; }[] = [];
  defaultSelectedKey?: string = undefined;
  callback?: (name: string, newValue: any) => void = undefined;
}

export class StringScreenReaderWriter implements IScreenReaderWriter{
  private wrapper: string = "";
  private screenString : (() => string)[] = [];
  private fieldsInfo: Map<string, FieldInfo> = new Map();
  private tables: Map<string, {headerSize: number, readerWriter: IScreenReaderWriter}> = new Map();

  public constructor(wrapper: string = "") {
    this.wrapper = wrapper;
  }

  public createTable(name: string, headers: string[]): void {
    const headersString = headers.join(", ");
    const table = new StringScreenReaderWriter(`area name="${name}" headers="${headersString}"`);

    this.tables.set(name, { headerSize: headers.length, readerWriter: table });
    this.screenString.push(() => table.getHtml());
  }

  public createTableRow(name: string): IScreenReaderWriter[] {
    const table = this.tables.get(name)!;
    const rows = [];
    for(let i = 0; i < table.headerSize; i++)
      rows.push(new StringScreenReaderWriter(`row cell="${i}"`));
    return rows;
  }
  public createContentArea(orientation: AreaOrientation): IScreenReaderWriter {
    const area = new StringScreenReaderWriter(`area orientation="${orientation}"`);
    this.screenString.push(() => area.getHtml());
    return area;
  }

  private getBasicFieldString(name: string): string {
    const field = this.fieldsInfo.get(name)!;
    const options = field.options?.map(o => `${o.key}:${o.caption}`).join(",");
    const valueString = field.value ? ` value="${field.value}"` : "";
    const optionsString = options ? ` options="${options}"` : "";
    return `<basicField type="${field.type}" name="${field.name}" caption="${field.caption}"${valueString}${optionsString} />`;
  }

  public createBasicField(type: ScreenBasicFieldTypes, name: string, caption: string): void {
    this.fieldsInfo.set(name, { type, name, caption });
    this.screenString.push(() => this.getBasicFieldString(name));
  }

  public addListener(name: string, callback: (name: string, newValue: any) => void): void {
    this.fieldsInfo.get(name)!.callback = callback;
  }
  
  public getValueByElementName(name: string) {
    return this.fieldsInfo.get(name)?.value;
  }

  public setValueByName(name: string, value: any): void {
    this.fieldsInfo.get(name)!.value = value;
  }

  public setOptionsByName(name: string, options: { key: string; caption: string; }[], defaultSelectedKey?: string): void {
    const field = this.fieldsInfo.get(name)!;
    field.options = options;
    field.defaultSelectedKey = defaultSelectedKey;
  }

  public getHtml(): string {
	  let result = this.wrapper != "" ? `<${this.wrapper}:>` : "";
    this.screenString.forEach(s => result += s());
    result += this.wrapper != "" ? `</${this.wrapper}>` : "";
    return result;
  }
}
