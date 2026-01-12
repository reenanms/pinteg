import { IComponentSize } from '../contract/IComponentSize';

export class ComponentSizeFactory {
  private static componentSizes: { [_: string ] : () => IComponentSize } = {
    "S" : () => { return { name: "S", width: 0.50 } },
    "M" : () => { return { name: "M", width: 0.75 } },
    "L" : () => { return { name: "L", width: 1.00 } },
  };

  public static create(sizeName: string): IComponentSize {
    return this.componentSizes[sizeName]();
  }
}
