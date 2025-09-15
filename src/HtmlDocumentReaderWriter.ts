import IComponentSize from "./contract/IComponentSize";
import IScreenReaderWriter from "./contract/IScreenReaderWriter";
import { ScreenBasicFieldTypes } from "./contract/IScreenWriter";

export default class HtmlDocumentReaderWriter implements IScreenReaderWriter {
  private document: Document;
  private areaToWrite: Element;

  public constructor(elementId: string) {
    this.document = document;
    this.areaToWrite = document.getElementById(elementId) as Element;
  }

  private addStyle(id: string, content: string) {
    // verifica se já existe um style com esse id
    if (!this.document.getElementById(id)) {
      const style = this.document.createElement("style");
      style.id = id;             // define um id único
      style.textContent = content; // adiciona CSS
      this.document.head.appendChild(style);
    }
  }

  private buildFieldHtml(type: ScreenBasicFieldTypes, name: string, caption: string): string {
    if (type === ScreenBasicFieldTypes.List)
      return `<label for="${name}">${caption}:</label>` +
             `<select name="${name}" id="${name}"></select>`;

    return `<label for="${name}">${caption}:</label>` +
           `<input type="${type}" id="${name}" name="${name}" />`;
  }

  

  public addBasicField(type: ScreenBasicFieldTypes, name: string, caption: string, size: IComponentSize): void
  {
    const styleName = `input-width-${size.name}`;
    this.addStyle(styleName, `
      .${styleName} {
          width: calc(var(--input-width) * ${size.width});
      }
    `); 
    const fieldHtml = this.buildFieldHtml(type, name, caption);
    this.addHtml(`<div class="field-group ${styleName}">${fieldHtml}</div>`);
  }

  private addHtml(html: string): void {
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
