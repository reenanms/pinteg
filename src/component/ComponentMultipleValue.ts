import { IScreenReaderWriter } from "../contract/IScreenReaderWriter";
import { ComponentLoader } from "../loader/ComponentLoader";
import { ComponentSchema } from './ComponentSchema';
import { BuildConfig, IComponent, ViewMode } from "../contract/IComponent";
import { AreaOrientation } from "../contract/IScreenWriter";
import { IComponentDefinition } from "../contract/IComponentDefinition";


export class ComponentMultipleValue implements IComponent {
  constructor(readerWriter: IScreenReaderWriter, schema: ComponentSchema, useNewContentArea: boolean = true) {
    this.readerWriter = readerWriter;
    this.schema = schema;
    this.useNewContentArea = useNewContentArea;
  }

  private readerWriter: IScreenReaderWriter;
  private schema: ComponentSchema;
  private useNewContentArea: boolean;

  private componentsMappings: Map<string, IComponent>[] = [];
  private newEmptyRow: () => Map<string, IComponent> = () => { throw new Error('Not implemented') };


  private getChildrenReadWriter(config: BuildConfig) {
    if (!this.useNewContentArea)
      return this.readerWriter;

    return this.readerWriter.createContentArea(config.mode == ViewMode.Single ? AreaOrientation.vertical : AreaOrientation.horizontal);
  }

  private getHeaderCaptions(components: IComponentDefinition[]): string[] {
    return components.map(c => c.caption!); 
  }

  private buildTableNewRow(childrenReaderWriter: IScreenReaderWriter, tableName: string, components: IComponentDefinition[], config: BuildConfig): Map<string, IComponent> {
    const cellsReaderWriters = childrenReaderWriter.createTableRow(tableName);

    const componentLoader = new ComponentLoader(this.schema, i => cellsReaderWriters[i]);
    const componentsMapping = componentLoader.load();
    componentsMapping.forEach((component) => component.build(config));

    this.componentsMappings.push(componentsMapping);
    return componentsMapping;
  }
  
  public build(config: BuildConfig): void {
    const tableName = "ComponentMultipleValue"
    const components = Object.values(this.schema);
    const headerCaptions = this.getHeaderCaptions(components);

    const childrenReaderWriter = this.getChildrenReadWriter(config);
    childrenReaderWriter.createTable(tableName, headerCaptions);
    this.newEmptyRow = () => this.buildTableNewRow(childrenReaderWriter, tableName, components, config);
  }

  public writeValue(value: any): void {
    const values = value as any[];
    
    values.forEach(v =>{
      const componentsMapping = this.newEmptyRow();
      componentsMapping.forEach((component, name) => component.writeValue(v[name]));
    });
    
  }

  public readValue(): any {
    const values: any[] = [];

    this.componentsMappings.forEach(m => {
      const value: any = {};
      m.forEach((component, name) => value[name] = component.readValue());
      values.push(value);
    });
    return values;
  }
}
