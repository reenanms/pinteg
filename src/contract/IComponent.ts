import IComponentSize from "./IComponentSize";

export default interface IComponent {
  readonly type: string;
  name: string;
  caption: string;
  size: IComponentSize;
  props: Map<string, any>;
  build(): void;
  writeValue(value: any): void;
  readValue(): any;
}

