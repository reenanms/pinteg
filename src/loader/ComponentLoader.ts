import { IChildComponent } from '../contract/IChildComponent';
import { IParentComponent } from '../contract/IParentComponent';
import { IScreenReaderWriter } from '../contract/IScreenReaderWriter';
import { ComponentFactory } from '../factory/ComponentFactory';
import { ComponentSchema } from '../component/ComponentSchema';
import { IComponent } from '../contract/IComponent';

export class ComponentLoader {
  private schema : ComponentSchema;
  private getScreenReaderWriters : (index: number) => IScreenReaderWriter;

  public constructor(schema : ComponentSchema, getScreenReaderWriters: (index: number) => IScreenReaderWriter) {
    this.schema = schema;
    this.getScreenReaderWriters = getScreenReaderWriters;
  }

  private loadComponent(propertyName: string, screenReaderWriter: IScreenReaderWriter) {
    const propertyConfig = this.schema[propertyName];
    const component = ComponentFactory.createFromProperty([propertyName, propertyConfig], screenReaderWriter);
    return component;
  }

  public load() : Map<string, IComponent> {
    const componentsMapping: Map<string, IComponent> = new Map();

    let index = 0;
    for (const propertyName in this.schema) {
      const screenReaderWriter = this.getScreenReaderWriters(index);
      const component = this.loadComponent(propertyName, screenReaderWriter);
      componentsMapping.set(propertyName, component);

      index++;
    }

    for (const propertyName in this.schema) {
      const propertyConfig = this.schema[propertyName];
      if (propertyConfig.parent == null)
        continue;

      const chieldComponent = componentsMapping.get(propertyName) as IChildComponent;
      const parentComponent = componentsMapping.get(propertyConfig.parent!) as IParentComponent;
      chieldComponent.parent = parentComponent;
    }
    
    return componentsMapping;
  }
}
