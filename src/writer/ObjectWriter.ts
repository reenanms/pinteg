import IComponent from "../contract/IComponent";

export default class ObjectWriter {
  private components : IComponent[];

  public constructor(components : IComponent[]) {
    this.components = components;
  }

  public write(object: Object): void {
    for (const component of this.components) {
      const value = this.getObjectValue(object, component.name);
      component.writeValue(value);
    }
  }

  private getObjectValue(object: Record<string, any>, propertyName: string): any {
    return object[propertyName];
  }
}
