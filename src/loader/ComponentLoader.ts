import IComponent from '../contract/IComponent'
import IComponentDefinition from '../contract/IComponentDefinition'
import ComponentFactory from '../factory/ComponentFactory';
import ComponentSizeFactory from '../factory/ComponentSizeFactory';

export default class ComponentLoader {
  private configuration : Record<string, IComponentDefinition>;

  public constructor(configuration : Record<string, IComponentDefinition>) {
    this.configuration = configuration;
  }

  private loadComponentProps(propertyConfig: IComponentDefinition) {
    const propertiesIComponentDefinition = [ "type", "caption", "size" ];

    const props = new Map<string, any>();
    Object.entries(propertyConfig).forEach(([key, value]) => {
      if (propertiesIComponentDefinition.some(p => p == key))
        return;
      props.set(key, value);
    });

    return props;
  }

  private loadComponent(propertyName: string) {
    const propertyConfig = this.configuration[propertyName];
    const component = ComponentFactory.create(propertyConfig.type);
    component.size = ComponentSizeFactory.create(propertyConfig.size);
    component.name = propertyName;
    component.caption = propertyConfig.caption;
    component.props = this.loadComponentProps(propertyConfig);

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
