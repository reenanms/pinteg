import IComponentDefinition from "../contract/IComponentDefinition";
import ComponentLoader from "../loader/ComponentLoader";

export default class ObjectWriter {
  private configuration: Record<string, IComponentDefinition>;
  private areaToWrite: Element;

  public constructor(configuration: Record<string, IComponentDefinition>, htmlDivId: string) {
    this.configuration = configuration;
    this.areaToWrite = document.getElementById(htmlDivId) as Element;
  }

  public write(object: Object): void {
    const componentLoader = new ComponentLoader(this.configuration);
    const components = componentLoader.load();

    for (const component of components) {
      const componentElement = this.getInputElement(component.name);
      const value = this.getObjectValue(object, component.name);

      componentElement.value = value;
    }
  }

  private getObjectValue(object: Record<string, any>, propertyName: string): any {
    return object[propertyName];
  }

  private getInputElement(elementName: string): HTMLInputElement {
    const elementFound = this.areaToWrite.querySelector(`[name="${elementName}"]`);
    return elementFound as HTMLInputElement;
  }
}
