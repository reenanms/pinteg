import IScreenReaderWriter from "./contract/IScreenReaderWriter";

export default class HtmlDocumentReaderWriter implements IScreenReaderWriter {
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
    this.areaToWrite.insertAdjacentHTML('beforeend', html);
  }

  public setValueByElementName(name: string, value: any): void {
    const input = this.getInputElementByName(name);
    input.value = value;
  }

  public setOptionsByElementName(name: string, options: { key: string; caption: string; }[], defaultSelectedKey?: string): void {
    const input = this.areaToWrite.querySelector(`[name="${name}"]`) as HTMLSelectElement;

    input.length = 0;
    for (const option of options)
      input.add(new Option(option.caption, option.key, defaultSelectedKey == option.key));
  }

  public getValueByElementName(name: string): any {
    const input = this.getInputElementByName(name);
    return input.value;
  }

  private getInputElementByName(name: string): HTMLInputElement {
    const elementFound = this.areaToWrite.querySelector(`[name="${name}"]`);
    return elementFound as HTMLInputElement;
  }

  public addListener(name: string, callback: (name: string, newValue: any) => void): void {
    const input = this.getInputElementByName(name);

    input.addEventListener('change', function (event: Event): void {
      const target = event.target as HTMLInputElement;
      callback(name, target.value);
    });
  }
}
