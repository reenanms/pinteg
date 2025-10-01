import { IComponentSize } from "./IComponentSize";
import { IScreenReaderWriter } from "./IScreenReaderWriter";

export enum ScreenBasicFieldTypes {
  Integer = 'integer',
  Double = 'double',
  Text = 'text',
  List = 'list',
}

export enum AreaOrientation {
  horizontal = 'horizontal',
  vertical = 'vertical'
}

export interface IScreenWriter {
  createTable(name: string, headers: string[]): void;
  createTableRow(name: string): IScreenReaderWriter[];
  createContentArea(orientation: AreaOrientation): IScreenReaderWriter
  createBasicField(type: ScreenBasicFieldTypes, name: string, caption: string, size: IComponentSize, readOnly: boolean): void;
  setValueByName(name: string, value: any): void;
  setOptionsByName(name: string, options: { key: string; caption: string; }[], defaultSelectedKey?: string): void;
}
