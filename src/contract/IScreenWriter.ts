import IComponentSize from "./IComponentSize";

export enum ScreenBasicFieldTypes {
  Integer = 'integer',
  Double = 'double',
  Text = 'text',
  List = 'list',
}

export default interface IScreenWriter {
  addBasicField(type: ScreenBasicFieldTypes, name: string, caption: string, size: IComponentSize): void;
  setValueByElementName(name: string, value: any): void;
  setOptionsByElementName(name: string, options: { key: string; caption: string; }[], defaultSelectedKey?: string): void;
}
