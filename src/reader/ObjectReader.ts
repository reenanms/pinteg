import IComponent from "../contract/IComponent";

export default class ObjectReader {
  private components : IComponent[];

  public constructor(components : IComponent[]) {
    this.components = components;
  }

  public read(): Object {
    let object : Object = {};
    for (const component of this.components) {
      const value = component.readValue();
      this.setObjectValue(object, component.name, value);
    }

    return object;
  }

  private setObjectValue(object: Record<string, any>, propertyName: string, value: any): void {
    object[propertyName] = value;
  }
}
