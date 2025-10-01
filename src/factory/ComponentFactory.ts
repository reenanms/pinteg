import { TextComponent } from '../component/TextComponent';
import { IntegerComponent } from '../component/IntegerComponent';
import { DoubleComponent } from '../component/DoubleComponent';
import { ListComponent } from '../component/ListComponent';
import { IScreenReaderWriter } from '../contract/IScreenReaderWriter';
import { IComponentDefinition } from '../contract/IComponentDefinition';
import { UnsupportedComponentTypeError } from '../error/Errors';
import { ComponentComposite } from '../component/ComponentComposite';
import { ComponentSchema, ComponentSchemaProperty } from '../component/ComponentSchema';
import { IComponent } from "../contract/IComponent";

export class ComponentFactory {
  private static types: { [_: string]: (screenReaderWriter: IScreenReaderWriter, property: ComponentSchemaProperty) => IComponent } = {
    "text": (rw, p) => new TextComponent(rw, p),
    "integer": (rw, p) => new IntegerComponent(rw, p),
    "double": (rw, p) => new DoubleComponent(rw, p),
    "list": (rw, p) => new ListComponent(rw, p),
  };

  public static registerType(typeName: string, factoryMethod: (screenReaderWriter: IScreenReaderWriter, property: ComponentSchemaProperty) => IComponent) {
    ComponentFactory.types[typeName] = factoryMethod;
  }

  public static registerTypeBySchema(typeName: string, schema: ComponentSchema) {
    ComponentFactory.registerType(typeName, (rw, _) => new ComponentComposite(rw, schema, true));
  }

  public static createFromSchema(schema: ComponentSchema, screenReaderWriter: IScreenReaderWriter): IComponent {
    return new ComponentComposite(screenReaderWriter, schema, false);
  }

  public static createFromTypeName(typeName: string, screenReaderWriter: IScreenReaderWriter): IComponent {
    const factoryMethod = ComponentFactory.getComponentFactoryMethod(typeName);
    const component = factoryMethod(screenReaderWriter, [ "", {} as IComponentDefinition ]);
    return component;
  }

  private static getComponentFactoryMethod(typeName: string) {
    const factoryMethod = this.types[typeName];
    if (!factoryMethod)
      throw new UnsupportedComponentTypeError(typeName);
    return factoryMethod;
  }

  public static createFromProperty(property: ComponentSchemaProperty, screenReaderWriter: IScreenReaderWriter): IComponent {
    const [_, componentDefinition] = property;
    const factoryMethod = ComponentFactory.getComponentFactoryMethod(componentDefinition.type);
    const component = factoryMethod(screenReaderWriter, property);
    return component;
  }
}
