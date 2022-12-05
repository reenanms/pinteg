import IComponent from '../contract/IComponent';
import TextComponent from '../component/TextComponent';
import IntegerComponent from '../component/IntegerComponent';
import DoubleComponent from '../component/DoubleComponent';
import ListComponent from '../component/ListComponent';

export default class ComponentFactory {
  private static types: { [_: string]: () => IComponent } = {
    "string": () => new TextComponent(),
    "integer": () => new IntegerComponent(),
    "double": () => new DoubleComponent(),
    "list": () => new ListComponent(),
  };

  public static create(typeName: string): IComponent {
    return this.types[typeName]();
  }
}
