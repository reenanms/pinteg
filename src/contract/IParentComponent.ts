import IChildComponent from "./IChildComponent";
import IComponent from "./IComponent";

export default interface IParentComponent extends IComponent {
  addValueChangedListener(callback: (component: IParentComponent) => void): void;
}
