import ScreenBuilder from "./builder/ScreenBuilder";
import IComponent from "./contract/IComponent";
import IComponentDefinition from "./contract/IComponentDefinition";
import IScreenReaderWriter from "./contract/IScreenReaderWriter";
import ComponentLoader from "./loader/ComponentLoader";
import ObjectReader from "./reader/ObjectReader";
import HtmlDocumentWriter from "./writer/HtmlDocumentWriter";
import ObjectWriter from "./writer/ObjectWriter";

export class PInteg {
  private configuration: Record<string, IComponentDefinition>
  private htmlDivId: string;

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
    const components = this.loadComponents();
    const screenReaderWriter = this.createReaderWriter();
    const builder = new ScreenBuilder(components, screenReaderWriter);
    builder.build();
    return this;
  }

  public writeObject(object: Object) : PInteg {
    const components = this.loadComponents();
    const writer = new ObjectWriter(components);
    writer.write(object);
    return this;
  }

  public readObject() : Object {
    const components = this.loadComponents();
    const reader = new ObjectReader(components);
    return reader.read();
  }

  private createReaderWriter() : IScreenReaderWriter {
    const screenReaderWriter = new HtmlDocumentWriter(this.htmlDivId);
    return screenReaderWriter;
  }

  private loadComponents() : IComponent[] {
    const screenReaderWriter = this.createReaderWriter();
    const componentLoader = new ComponentLoader(this.configuration, screenReaderWriter);
    const components = componentLoader.load();
    return components;
  }
}

export default new PInteg();
