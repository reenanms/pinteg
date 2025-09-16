import { IScreenReaderWriter } from "../contract/IScreenReaderWriter";
import { ComponentLoader } from "../loader/ComponentLoader";
import { ComponentSchema } from '../component/ComponentSchema';
import { BuildConfig, IComponent, ViewMode } from "../contract/IComponent";
import { AreaOrientation } from "../contract/IScreenWriter";


export class ComponentComposite implements IComponent {
  constructor(readerWriter: IScreenReaderWriter, schema: ComponentSchema, useNewContentArea: boolean = true) {
    this.readerWriter = readerWriter;
    this.schema = schema;
    this.useNewContentArea = useNewContentArea;
  }

  private readerWriter: IScreenReaderWriter;
  private schema: ComponentSchema;
  private useNewContentArea: boolean;

  private componentsMapping: Map<string, IComponent> = new Map();

  private getChildrenReadWriter(config: BuildConfig): IScreenReaderWriter {
    if (!this.useNewContentArea)
      return this.readerWriter;

    return this.readerWriter.createContentArea(config.mode == ViewMode.Single ? AreaOrientation.vertical : AreaOrientation.horizontal);
  }
  
  public build(config: BuildConfig): void {
    const childrenReaderWriter = this.getChildrenReadWriter(config);
    const componentLoader = new ComponentLoader(this.schema, i => childrenReaderWriter);
    this.componentsMapping = componentLoader.load();
    this.componentsMapping.forEach((component) => component.build(config));
  }

  public writeValue(value: any): void {
    this.componentsMapping.forEach((component, name) => component.writeValue(value[name]));
  }

  public readValue(): any {
    const value: any = {};
    this.componentsMapping.forEach((component, name) => value[name] = component.readValue());
    return value;
  }
}
