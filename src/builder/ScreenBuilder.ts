import IComponentDefinition from "../contract/IComponentDefinition"
import ComponentLoader from "../loader/ComponentLoader";
import ScreenLoader from "../loader/ScreenLoader";
import HtmlDocumentWriter from "../writer/HtmlDocumentWriter";

export default class ScreenBuilder {
  private configuration: Record<string, IComponentDefinition>;
  private htmlDivId: string;

  public constructor(configuration: Record<string, IComponentDefinition>, htmlDivId: string) {
    this.configuration = configuration;
    this.htmlDivId = htmlDivId;
  }

  public build(): void {
    const htmlWriter = new HtmlDocumentWriter(this.htmlDivId);

    const componentLoader = new ComponentLoader(this.configuration);
    const components = componentLoader.load();

    const screenLoader = new ScreenLoader(htmlWriter, components);
    screenLoader.load();
  }
}
