import IChildComponent from '../contract/IChildComponent';
import IComponent from '../contract/IComponent'
import IComponentDefinition from '../contract/IComponentDefinition'
import IParentComponent from '../contract/IParentComponent';
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
    const components: IComponent[] = [];
    const componentsMapping: Map<string, IComponent> = new Map();

    for (const propertyName in this.configuration) {
      const component = this.loadComponent(propertyName);
      componentsMapping.set(propertyName, component);
      components.push(component);
    }

    for (const propertyName in this.configuration) {
      const propertyConfig = this.configuration[propertyName];
      if (propertyConfig.parent == null)
        continue;

      const chieldComponent = componentsMapping.get(propertyName) as IChildComponent;
      const parentComponent = componentsMapping.get(propertyConfig.parent!) as IParentComponent;
      chieldComponent.parent = parentComponent;
    }
    
    return components;
  }
}
