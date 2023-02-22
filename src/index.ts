import ScreenBuilder from "./builder/ScreenBuilder";
import IComponent from "./contract/IComponent";
import IComponentDefinition from "./contract/IComponentDefinition";
import IScreenReaderWriter from "./contract/IScreenReaderWriter";
import ComponentLoader from "./loader/ComponentLoader";
import ObjectReader from "./reader/ObjectReader";
import HtmlDocumentReaderWriter from "./HtmlDocumentReaderWriter";
import ObjectWriter from "./writer/ObjectWriter";

export class PInteg {
  private configuration: Record<string, IComponentDefinition>
  private htmlDivId: string;
  private screenReaderWriter?: IScreenReaderWriter;
  private components?: IComponent[];

  public constructor() {
    this.htmlDivId = "app"
  }

  public setDivId(htmlDivId: string): PInteg {
    this.htmlDivId = htmlDivId;
    return this;
  }

  public setConfiguration(configuration: Record<string, IComponentDefinition>): PInteg {
    this.configuration = configuration;
    return this;
  }

  public buildScreen() : PInteg {
    this.screenReaderWriter = new HtmlDocumentReaderWriter(this.htmlDivId);

    const componentLoader = new ComponentLoader(this.configuration, this.screenReaderWriter!);
    this.components = componentLoader.load();

    const builder = new ScreenBuilder(this.components!, this.screenReaderWriter!);
    builder.build();
    return this;
  }

  public writeObject(object: Object) : PInteg {
    const writer = new ObjectWriter(this.components!);
    writer.write(object);
    return this;
  }

  public readObject() : Object {
    const reader = new ObjectReader(this.components!);
    return reader.read();
  }
}

export default new PInteg();
