import IComponentSize from "./IComponentSize";
import IHtmlWriter from "./IHtmlWriter";

export default interface IComponent {
  readonly type: string;
  name: string;
  caption: string;
  size: IComponentSize;
  props: Map<string, any>;
  build(writer: IHtmlWriter): void;
}
