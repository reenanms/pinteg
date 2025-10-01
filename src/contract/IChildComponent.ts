import { IComponent } from "./IComponent";
import { IParentComponent } from "./IParentComponent";

export interface IChildComponent extends IComponent {
  parent: IParentComponent;
}
