import { IComponent } from "./IComponent";

export interface IParentComponent extends IComponent {
  addValueChangedListener(callback: (component: IParentComponent) => void): void;
}
