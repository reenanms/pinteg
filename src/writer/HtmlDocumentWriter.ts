import IScreenReaderWriter from "../contract/IScreenReaderWriter";

export default class HtmlDocumentWriter implements IScreenReaderWriter{
  private document: Document;
  private areaToWrite: Element;

  public constructor(elementId: string) {
    this.document = document;
    this.areaToWrite = document.getElementById(elementId) as Element;
  }

  public addNewLine(): void {
    var lineBreak = this.document.createElement("br");
    this.areaToWrite.appendChild(lineBreak);
  }

  public addHtml(html: string): void {
    this.areaToWrite.innerHTML += html;
  }

  public setValueByElementName(name: string, value: any): void {
    const input = this.getInputElementByName(name);
    input.value = value;
  }

  public getValueByElementName(name: string): any {
    const input = this.getInputElementByName(name);
    return input.value;
  }

  private getInputElementByName(name: string): HTMLInputElement {
    const elementFound = this.areaToWrite.querySelector(`[name="${name}"]`);
    return elementFound as HTMLInputElement;
  }
}
