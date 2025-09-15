import IComponent from "../contract/IComponent"
import IScreenWriter from "../contract/IScreenWriter";

export default class ScreenLoader {
  private components: IComponent[];
  private screenWriter: IScreenWriter;

  public constructor(components: IComponent[], screenWriter: IScreenWriter) {
    this.components = components;
    this.screenWriter = screenWriter;
  }
  
  public load(): void {
    for (const component of this.components)
      component.build();
  }
}
