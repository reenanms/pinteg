import { ScreenBasicFieldTypes } from "../contract/IScreenWriter";

export class ElementFactory {
  //private addHtml(html: string): void {
  //  this.areaToWrite.insertAdjacentHTML('beforeend', html);
  //}
  public static createLabel(area: Element, forId: string | null, caption: string, ...stylesName: string[]): HTMLLabelElement {
    const label = area.ownerDocument.createElement('label');
    stylesName.forEach(s => label.classList.add(s));
    if (forId != null)
      label.htmlFor = forId;
    label.innerText = caption;
    area.appendChild(label);

    return label;
  }

  public static createInputSelect(area: Element, id: string, readOnly: boolean, ...stylesName: string[]): HTMLSelectElement {
    const select = area.ownerDocument.createElement('select');
    stylesName.forEach(s => select.classList.add(s));
    select.id = id;
    select.name = id;
    select.disabled = readOnly;
    area.appendChild(select);

    return select;
  }

  public static createInput(area: Element, type: ScreenBasicFieldTypes, id: string, readOnly: boolean, ...stylesName: string[]): HTMLElement {
    const input = area.ownerDocument.createElement('input');
    stylesName.forEach(s => input.classList.add(s));
    input.id = id;
    input.type = type;
    input.name = id;
    input.readOnly = readOnly;
    area.appendChild(input);

    return input;
  }

  private static createTableHeaders(thead: HTMLTableSectionElement, headers: string[]): void {
    const row = document.createElement('tr');

    for (let i = 0; i < headers.length; i++) {
      const th = document.createElement('th');
      ElementFactory.createLabel(th, null, headers[i]);

      row.appendChild(th);
    }

    thead.appendChild(row);
  }

  public static createTable(area: Element, id: string, headers: string[], ...stylesName: string[]): HTMLTableElement {
    const table = area.ownerDocument.createElement('table');
    stylesName.forEach(s => table.classList.add(s));
    table.id = id;

    const thead = area.ownerDocument.createElement('thead');
    ElementFactory.createTableHeaders(thead, headers);
    table.appendChild(thead);

    const tbody = area.ownerDocument.createElement('tbody');
    table.appendChild(tbody);

    return table;
  }

  public static createTableRow(table: HTMLTableElement): HTMLTableCellElement[] {
    const thead = table.querySelector('thead')!;
    const size = thead.rows[0].cells.length;

    const tbody = table.querySelector('tbody')!;

    const row = document.createElement('tr');
    const cells: HTMLTableCellElement[] = [];

    for (let i = 0; i < size; i++) {
      const td = document.createElement('td');
      row.appendChild(td);
      cells.push(td);
    }

    tbody.appendChild(row);
    return cells;
  }

  public static createDiv(area: Element, ...stylesName: string[]): HTMLDivElement {
    var div = area.ownerDocument.createElement("div");
    stylesName.forEach(s => div.classList.add(s));
    area.appendChild(div);

    return div;
  }
}
