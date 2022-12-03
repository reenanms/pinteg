import IComponent from '../contract/IComponent';
import TextComponent from '../component/TextComponent';

export default class ComponentFactory {
  private static types: { [_: string]: () => IComponent } = {
    "string" : () => new TextComponent()
  };

  public static create(typeName: string): IComponent {
    return this.types[typeName]();
  }
}
