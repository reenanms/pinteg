import { BuildConfig, IComponent } from "../contract/IComponent";

export class ScreenBuilder {
  private components : IComponent[];

  public constructor(...components: IComponent[]) {
    this.components = components;
  }

  public build(config: BuildConfig): void {
    for (const component of this.components)
      component.build(config);
  }
}
