import { IComponentSize } from "./contract/IComponentSize";
import { IScreenReaderWriter } from "./contract/IScreenReaderWriter";
import { AreaOrientation, ScreenBasicFieldTypes } from "./contract/IScreenWriter";

export class HtmlDocumentReaderWriter implements IScreenReaderWriter {
  private document: Document;
  private areaToWrite: Element;

  public constructor(element: string | HTMLElement) {
    this.document = document;
    if (element instanceof HTMLElement)
      this.areaToWrite = element;
    else
      this.areaToWrite = document.getElementById(element) as Element;
  }

  private createStyle(id: string, content: string) {
    if (this.document.getElementById(id))
      return;
    
    const style = this.document.createElement('style');
    style.id = id;
    style.textContent = content;
    this.document.head.appendChild(style);
  }

  private createLabel(area: Element, forId: string | null, caption: string): HTMLLabelElement {
    const label = this.document.createElement('label');
    if (forId != null)
      label.htmlFor = forId;
    label.innerText = caption;
    area.appendChild(label);

    return label;
  }

  private createInputSelect(area: Element, name: string, readOnly: boolean) {
    const select = document.createElement('select');
    select.id = name;
    select.name = name;
    select.disabled = readOnly;
    area.appendChild(select);

    return select;
  }

  private createInput(area: Element, type: ScreenBasicFieldTypes, name: string, readOnly: boolean): HTMLElement {
    if (type == ScreenBasicFieldTypes.List) {
      return this.createInputSelect(area, name, readOnly);
    }

    const input = document.createElement('input');
    input.type = type;
    input.id = name;
    input.name = name;
    input.readOnly = readOnly;
    area.appendChild(input);

    return input;
  }

  

  private createDiv(area: Element, ...stylesName: string[]): HTMLDivElement {
    var div = this.document.createElement("div");
    stylesName.forEach(s => div.classList.add(s))
    area.appendChild(div);

    return div;
  }

  public createContentArea(orientation: AreaOrientation): IScreenReaderWriter {
    const styleOrientation = this.getAreaOrientationStyleName(orientation);
    var div = this.createDiv(this.areaToWrite, styleOrientation);

    return new HtmlDocumentReaderWriter(div);
  }

  // -------------------------------------------------------

  public createTable(name: string, headers: string[]): void {
    const table = document.createElement('table');
    table.id = name;

    const thead = document.createElement('thead');
    this.createTableHeaders(thead, headers);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    this.areaToWrite.appendChild(table);
  }

  private createTableHeaders(thead: HTMLTableSectionElement, headers: string[]): void {
    const row = document.createElement('tr');

    for(let i = 0; i< headers.length; i++) {
      const th = document.createElement('th');
      this.createLabel(th, null, headers[i]);

      row.appendChild(th);
    }

    thead.appendChild(row);
  }

  public createTableRow(name: string): IScreenReaderWriter[] {
    const table = this.getTableById(name);
    const thead = table.querySelector('thead')!;
    const size = thead.rows[0].cells.length;

    const tbody = table.querySelector('tbody')!;

    const row = document.createElement('tr');
    const cells: IScreenReaderWriter[] = [];

    for(let i = 0; i< size; i++) {
      const td = document.createElement('td');
      row.appendChild(td);

      const cell = new HtmlDocumentReaderWriter(td);
      cells.push(cell)
    }

    tbody.appendChild(row);
    return cells;

    // values.forEach(value => {
    //   const td = document.createElement("td");
    //   td.contentEditable = "true";
    //   td.innerText = value;
    //   row.appendChild(td);
    // });

    // tbody.appendChild(row);
  }

  // -------------------------------------------------------


  private getAreaOrientationStyleName(orientation: AreaOrientation) {
    const styleName = `area-orientation-${orientation}`;
    const flexDirection = orientation === AreaOrientation.horizontal ? 'row' : 'column';
    const style = `.${styleName} {
      display: flex;
      flex-direction: ${flexDirection};
    }`; //TODO: review, flex-wrap: wrap;
    this.createStyle(styleName, style);
    return styleName;
  }

  public createBasicField(type: ScreenBasicFieldTypes, name: string, caption: string, size: IComponentSize, readOnly: boolean): void
  {
    const styleInputWidth = this.getInputWidthStyleName(size);
    const styleOrientation = this.getAreaOrientationStyleName(AreaOrientation.vertical);
    const div = this.createDiv(this.areaToWrite, styleOrientation, styleInputWidth)

    if (caption !== "")
      this.createLabel(div, name, caption);

    this.createInput(div, type, name, readOnly);
  }

  private getInputWidthStyleName(size: IComponentSize) {
    const styleName = `input-width-${size.name}`;
    const style =  `.${styleName} {
      width: calc(var(--input-width) * ${size.width});
    }`;
    this.createStyle(styleName, style);
    return styleName;
  }

  private addHtml(html: string): void {
    this.areaToWrite.insertAdjacentHTML('beforeend', html);
  }

  public setValueByName(name: string, value: any): void {
    const input = this.getInputById(name);
    input.value = value;
  }

  public setOptionsByName(name: string, options: { key: string; caption: string; }[], defaultSelectedKey?: string): void {
    const input = this.areaToWrite.querySelector(`[name="${name}"]`) as HTMLSelectElement;

    input.length = 0;
    for (const option of options)
      input.add(new Option(option.caption, option.key, defaultSelectedKey == option.key));
  }

  public getValueByElementName(name: string): any {
    const input = this.getInputById(name);
    return input.value;
  }

  private getInputById(id: string): HTMLInputElement {
    const elementFound = this.getElementById(id);
    return elementFound as HTMLInputElement;
  }

  private getTableById(id: string): HTMLTableElement {
    const elementFound = this.getElementById(id);
    return elementFound as HTMLTableElement;
  }

  private getElementById(id: string) {
    //return this.areaToWrite.querySelector(`[name="${name}"]`);
    return this.areaToWrite.querySelector(`#${id}`);
  }

  public addListener(name: string, callback: (name: string, newValue: any) => void): void {
    const input = this.getInputById(name);

    input.addEventListener('change', function (event: Event): void {
      const target = event.target as HTMLInputElement;
      callback(name, target.value);
    });
  }
}
