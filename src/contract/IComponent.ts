import IComponentSize from "./IComponentSize";
import IHtmlWriter from "./IHtmlWriter";

export default interface IComponent {
  type: string;
  name: string;
  caption: string;
  size: IComponentSize;
  build(writer: IHtmlWriter): void;
}
