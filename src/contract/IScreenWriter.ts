export enum ScreenBasicFieldTypes {
  Integer = 'integer',
  Double = 'double',
  Text = 'text',
  List = 'list',
}

export default interface IScreenWriter {

  addNewLine(): void;
  addBasicField(type: ScreenBasicFieldTypes, name: string, caption: string): void;
  setValueByElementName(name: string, value: any): void;
}
