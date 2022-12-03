import IComponentSize from '../contract/IComponentSize';

export default class ComponentSizeFactory {
  private static componentSizes: { [_: string ] : () => IComponentSize } = {
    "P" : () => { return { name: "P", width: 50 } },
    "M" : () => { return { name: "M", width: 75 } },
    "G" : () => { return { name: "G", width: 100 } },
  };

  public static create(sizeName: string): IComponentSize {
    return this.componentSizes[sizeName]();
  }
}
