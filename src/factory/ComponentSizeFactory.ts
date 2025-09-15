import IComponentSize from '../contract/IComponentSize';

export default class ComponentSizeFactory {
  private static componentSizes: { [_: string ] : () => IComponentSize } = {
    "P" : () => { return { name: "P", width: 0.5 } },
    "M" : () => { return { name: "M", width: 0.75 } },
    "G" : () => { return { name: "G", width: 1 } },
  };

  public static create(sizeName: string): IComponentSize {
    return this.componentSizes[sizeName]();
  }
}
