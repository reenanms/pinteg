import IComponent from '../contract/IComponent';
import TextComponent from '../component/TextComponent';
import IntegerComponent from '../component/IntegerComponent';
import DoubleComponent from '../component/DoubleComponent';
import ListComponent from '../component/ListComponent';
import IScreenReaderWriter from '../contract/IScreenReaderWriter';
import IComponentDefinition from '../contract/IComponentDefinition';
import ComponentSizeFactory from './ComponentSizeFactory';

export default class ComponentFactory {
  private static types: { [_: string]: (screenReaderWriter : IScreenReaderWriter) => IComponent } = {
    "text": (rw) => new TextComponent(rw),
    "integer": (rw) => new IntegerComponent(rw),
    "double": (rw) => new DoubleComponent(rw),
    "list": (rw) => new ListComponent(rw),
  };

  public static create(name: string, componentDefinition: IComponentDefinition, screenReaderWriter : IScreenReaderWriter): IComponent {
    const component = this.types[componentDefinition.type](screenReaderWriter);
    component.size = ComponentSizeFactory.create(componentDefinition.size);
    component.name = name;
    component.caption = componentDefinition.caption;
    component.props = this.loadComponentProps(componentDefinition);

    return component;
  }

  private static loadComponentProps(propertyConfig: IComponentDefinition) {
    const propertiesToIgnore = [ "type", "caption", "size" ];

    const props = new Map<string, any>();
    Object.entries(propertyConfig).forEach(([key, value]) => {
      if (propertiesToIgnore.some(p => p == key))
        return;
      
      props.set(key, value);
    });

    return props;
  }
}
