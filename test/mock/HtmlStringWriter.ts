import IScreenReaderWriter from "../../src/contract/IScreenReaderWriter";

export default class HtmlStringWriter implements IScreenReaderWriter{
  private html: string;
  private values: any[];

  public constructor() {
    this.html = "";
    this.values = [];
  }
  getValueByElementName(name: string) {
    return this.values.pop();
  }
  setValueByElementName(name: string, value: any): void {
    this.values.push(value);
  }

  public addNewLine(): void {
    this.html += "<br />";
  }

  public addHtml(html: string): void {
    this.html += html;
  }

  public getHtml(): string {
	  return this.html;
  }
}
