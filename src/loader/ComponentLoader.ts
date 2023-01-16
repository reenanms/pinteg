import IComponent from '../contract/IComponent'
import IComponentDefinition from '../contract/IComponentDefinition'
import IScreenReaderWriter from '../contract/IScreenReaderWriter';
import ComponentFactory from '../factory/ComponentFactory';

export default class ComponentLoader {
  private configuration : Record<string, IComponentDefinition>;
  private screenReaderWriter : IScreenReaderWriter;

  public constructor(configuration : Record<string, IComponentDefinition>, screenReaderWriter : IScreenReaderWriter) {
    this.configuration = configuration;
    this.screenReaderWriter = screenReaderWriter;
  }

  private loadComponent(propertyName: string) {
    const propertyConfig = this.configuration[propertyName];
    const component = ComponentFactory.create(propertyName, propertyConfig, this.screenReaderWriter);
    return component;
  }

  public load() : IComponent[] {
    const components : IComponent[] = [];

    for (const propertyName in this.configuration) {
      const component = this.loadComponent(propertyName);
      components.push(component);
    }
    
    return components;
  }
}
