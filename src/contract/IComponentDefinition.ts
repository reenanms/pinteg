export interface IBasicComponentDefinition {
  caption?: string;
  size?: string;
  parent?: string;
}

export interface IComponentDefinition extends IBasicComponentDefinition {
  type: string;
}
