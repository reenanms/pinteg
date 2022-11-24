import IComponentSize from "./IComponentSize";
import IScreenWriter from "./IScreenWriter";

export interface IComponent {
  type: string;
  caption: string;
  size: IComponentSize;
  value: any;
  build(screen: IScreenWriter): void;
}
