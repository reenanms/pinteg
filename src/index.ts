import { ScreenBuilder } from "./builder/ScreenBuilder";
import { HtmlDocumentReaderWriter } from "./implementations/HtmlDocumentReaderWriter";
import { ComponentFactory } from "./factory/ComponentFactory";
import { ComponentSchema } from './component/ComponentSchema';
import { BuildConfig, ViewMode, IComponent } from "./contract/IComponent";
import { ComponentMultipleValue } from "./component/ComponentMultipleValue";

export class PInteg {
  private schema: ComponentSchema | null = null;
  private schemaName: string = "main";
  private htmlDivId: string = "app";
  private component: IComponent | null = null;
  private buildConfig: BuildConfig = new BuildConfig();

  public constructor() {
  }

  public setDivId(htmlDivId: string): PInteg {
    this.htmlDivId = htmlDivId;

    return this;
  }

   public setSchemaName(name: string) : PInteg {
    this.schemaName = name;

    return this;
  }

  public registerSchema(name: string, schema: ComponentSchema): PInteg {
    ComponentFactory.registerTypeBySchema(name, schema);

    return this;
  }

  public setMainSchema(schema: ComponentSchema): PInteg {
    this.schema = schema;
    return this;
  }

  public setReadOnly(): PInteg {
    this.buildConfig.readonly = true;
    return this;
  }

  public setViewMultiple(): PInteg {
    this.buildConfig.mode = ViewMode.Multiple;
    return this;
  }

  public buildForm() : PInteg {
    const screenReaderWriter = HtmlDocumentReaderWriter.create(this.htmlDivId);

    this.component = this.schema != null ?
        ComponentFactory.createFromSchema(this.schema!, screenReaderWriter) :
        ComponentFactory.createFromTypeName(this.schemaName, screenReaderWriter);
    new ScreenBuilder(this.component!)
      .build(this.buildConfig);
    
    return this;
  }

  ///ComponentMultipleValue
  public buildList() : PInteg {
    const screenReaderWriter = HtmlDocumentReaderWriter.create(this.htmlDivId);

    this.buildConfig.mode = ViewMode.Multiple;
    this.component = new ComponentMultipleValue(screenReaderWriter, this.schema!, false);
    // ComponentFactory.createFromSchema(this.schema!, screenReaderWriter) :
    // ComponentFactory.createFromTypeName(this.schemaName, screenReaderWriter);
    new ScreenBuilder(this.component!)
      .build(this.buildConfig);
    
    return this;
  }

  public writeObject(value: any) : PInteg {
    this.component?.writeValue(value);

    return this;
  }

  public readObject() : any {
    return this.component?.readValue();
  }
}

export default new PInteg();
