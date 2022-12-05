import ScreenBuilder from "./builder/ScreenBuilder";
import IComponentDefinition from "./contract/IComponentDefinition";
import ObjectReader from "./reader/ObjectReader";
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
    const builder = new ScreenBuilder(this.configuration, this.htmlDivId);
    builder.build();
    return this;
  }

  public writeObject(object: Object) : PInteg {
    const writer = new ObjectWriter(this.configuration, this.htmlDivId);
    writer.write(object);
    return this;
  }

  public readObject() : Object {
    const reader = new ObjectReader(this.configuration, this.htmlDivId);
    return reader.read();
  }
}

export default new PInteg();
