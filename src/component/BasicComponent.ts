import { BuildConfig, ViewMode, IComponent } from "../contract/IComponent";
import { IComponentDefinition } from "../contract/IComponentDefinition";
import { IComponentSize } from "../contract/IComponentSize";
import { IParentComponent } from "../contract/IParentComponent";
import { IScreenReaderWriter } from "../contract/IScreenReaderWriter";
import { ScreenBasicFieldTypes } from "../contract/IScreenWriter";
import { ComponentSizeFactory } from "../factory/ComponentSizeFactory";
import { ComponentSchemaProperty } from "./ComponentSchema";

export class BasicComponent implements IComponent, IParentComponent {
  protected readonly readerWriter: IScreenReaderWriter;
  protected valueChangedCallbacks: ((component: IParentComponent) => void)[] = [];

  protected readonly screenBasicType: ScreenBasicFieldTypes;
  protected name: string;
  protected caption: string;
  protected size: IComponentSize;
  protected props: Map<string, any>;
  

  protected constructor(readerWriter: IScreenReaderWriter, property: ComponentSchemaProperty, screenBasicType: ScreenBasicFieldTypes) {
    this.readerWriter = readerWriter;
    this.screenBasicType = screenBasicType;

    const [name, definition] = property;
    this.name = name;
    this.caption = definition.caption!;
    this.size = ComponentSizeFactory.create(definition.size!);
    this.props = this.loadComponentProps(definition);
  }

  private loadComponentProps(propertyConfig: IComponentDefinition) {
    const propertiesToIgnore = [ "type", "caption", "size" ];

    const props = new Map<string, any>();
    Object.entries(propertyConfig).forEach(([key, value]) => {
      if (propertiesToIgnore.some(p => p == key))
        return;
      
      props.set(key, value);
    });

    return props;
  }

  public addValueChangedListener(callback: (component: IParentComponent) => void): void {
    this.valueChangedCallbacks.push(callback);
  }

  public build(config: BuildConfig): void {
    this.readerWriter.createBasicField(this.screenBasicType, this.name, config.mode == ViewMode.Single ? this.caption : "", this.size, config.readonly);
    this.readerWriter.addListener(
      this.name, () => this.valueChangedCallbacks.forEach(callback => callback(this))
    );
  }

  public writeValue(value: any): void {
    this.readerWriter.setValueByName(this.name, value);
    this.valueChangedCallbacks.forEach(callback => callback(this));
  }

  public readValue(): any {
    return this.readerWriter.getValueByElementName(this.name);
  }
}
