export default interface IScreenWriter {
  addNewLine(): void;
  addHtml(html: string): void;
  setValueByElementName(name: string, value: any): void;
}
