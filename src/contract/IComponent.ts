import IComponentSize from "./IComponentSize";
import IScreenWriter from "./IScreenWriter";

export default interface IComponent {
  type: string;
  name: string;
  caption: string;
  size: IComponentSize;
  build(screen: IScreenWriter): void;
}
