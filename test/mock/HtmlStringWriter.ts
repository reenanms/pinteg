import IScreenReaderWriter from "../../src/contract/IScreenReaderWriter";
import { ScreenBasicFieldTypes } from "../../src/contract/IScreenWriter";

export default class HtmlStringWriter implements IScreenReaderWriter{
  private html: string;
  private values: any[];

  public constructor() {
    this.html = "";
    this.values = [];
  }
  public addBasicField(type: ScreenBasicFieldTypes, name: string, caption: string): void {
    this.html += `<label for="${name}">${caption}:</label><input type="${type}" id="${name}" name="${name}" />`;
  }
  
  public addListener(name: string, callback: (name: string, newValue: any) => void): void {    
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

  public getHtml(): string {
	  return this.html;
  }
}
