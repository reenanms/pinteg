import IComponent from "../contract/IComponent";
import IScreenWriter from "../contract/IScreenWriter";
import ScreenLoader from "../loader/ScreenLoader";

export default class ScreenBuilder {
  private components : IComponent[];
  private screenWriter: IScreenWriter;

  public constructor(components: IComponent[], screenWriter: IScreenWriter) {
    this.components = components;
    this.screenWriter = screenWriter;
  }

  public build(): void {
    const screenLoader = new ScreenLoader(this.components, this.screenWriter);
    screenLoader.load();
  }
}
