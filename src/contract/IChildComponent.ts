import IComponent from "./IComponent";
import IParentComponent from "./IParentComponent";

export default interface IChildComponent extends IComponent {
  parent: IParentComponent;
}
