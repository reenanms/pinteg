import { IComponentSize } from "../contract/IComponentSize";
import { IScreenReaderWriter } from "../contract/IScreenReaderWriter";
import { AreaOrientation, ScreenBasicFieldTypes } from "../contract/IScreenWriter";
import { ElementFactory } from "./ElementFactory";
import { StyleFactory } from "./StyleFactory";

enum AreaTypes {
  Root,
  Table
}

export class HtmlDocumentReaderWriter implements IScreenReaderWriter {
  
  private document: Document;
  private areaToWrite: Element;
  private areaType: AreaTypes

  public static create(elementId: string): HtmlDocumentReaderWriter {
    const root = document.getElementById(elementId) as Element;
    StyleFactory.themes(document);
    const style = StyleFactory.root(document);
    root.classList.add(style); 
    
    return new HtmlDocumentReaderWriter(root, AreaTypes.Root);
  }

  private constructor(element: Element, areaType: AreaTypes) {
    this.document = document;
    this.areaToWrite = element;
    this.areaType = areaType;
  }

  public createContentArea(orientation: AreaOrientation): IScreenReaderWriter {
    const style = StyleFactory.areaOrientation(this.document, orientation);
    var div = ElementFactory.createDiv(this.areaToWrite, style);
    return new HtmlDocumentReaderWriter(div, this.areaType);
  }

  public createTable(name: string, headers: string[]): void {
    const style = StyleFactory.table(this.document);
    const table = ElementFactory.createTable(this.areaToWrite, name, headers, style);
    this.areaToWrite.appendChild(table);
  }

  private getTableById(id: string): HTMLTableElement {
    const elementFound = this.getElementById(id);
    return elementFound as HTMLTableElement;
  }

  public createTableRow(name: string): IScreenReaderWriter[] {
    const table = this.getTableById(name);
    const cells = ElementFactory.createTableRow(table);
    const readerWriterCells = cells.map(cell => new HtmlDocumentReaderWriter(cell, AreaTypes.Table));
    return readerWriterCells;
  }

  public createBasicField(type: ScreenBasicFieldTypes, name: string, caption: string, size: IComponentSize, readOnly: boolean): void
  {
    const styleWidth = StyleFactory.inputWidth(this.document, size);
    const styleArea = StyleFactory.areaOrientation(this.document, AreaOrientation.vertical);
    const div = ElementFactory.createDiv(this.areaToWrite, styleArea, styleWidth)

    if (caption !== "") {
      const styleLabel = StyleFactory.label(this.document);
      ElementFactory.createLabel(div, name, caption, styleLabel);
    }

    if (type == ScreenBasicFieldTypes.List) {
      const styleSelect = this.areaType == AreaTypes.Table ? StyleFactory.tableInput(this.document) : StyleFactory.select(this.document);
      ElementFactory.createInputSelect(div, name, readOnly, styleSelect);
    } else {
      const styleInput = this.areaType == AreaTypes.Table ? StyleFactory.tableInput(this.document) : StyleFactory.input(this.document);
      ElementFactory.createInput(div, type, name, readOnly, styleInput);
    }
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

  private getElementById(id: string) {
    return this.areaToWrite.querySelector(`#${id}`);
  }

  private getInputById(id: string): HTMLInputElement {
    const elementFound = this.getElementById(id);
    return elementFound as HTMLInputElement;
  }

  public addListener(name: string, callback: (name: string, newValue: any) => void): void {
    const input = this.getInputById(name);
    input.addEventListener('change', function (event: Event): void {
      const target = event.target as HTMLInputElement;
      callback(name, target.value);
    });
  }
}
