import IComponentDefinition from "../contract/IComponentDefinition";
import ComponentLoader from "../loader/ComponentLoader";

export default class ObjectReader {
  private configuration: Record<string, IComponentDefinition>;
  private areaToWrite: Element;

  public constructor(configuration: Record<string, IComponentDefinition>, htmlDivId: string) {
    this.configuration = configuration;
    this.areaToWrite = document.getElementById(htmlDivId) as Element;
  }

  public read(): Object {
    const componentLoader = new ComponentLoader(this.configuration);
    const components = componentLoader.load();

    let object : Object = {};
    for (const component of components) {
      const componentElement = this.getInputElement(component.name);
      this.setObjectValue(object, component.name, componentElement.value);
    }

    return object;
  }

  private setObjectValue(object: Record<string, any>, propertyName: string, value: any): void {
    object[propertyName] = value;
  }

  private getInputElement(elementName: string): HTMLInputElement {
    const elementFound = this.areaToWrite.querySelector(`[name="${elementName}"]`);
    return elementFound as HTMLInputElement;
  }
}
