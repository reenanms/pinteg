import { IComponentSize } from './IComponentSize';

export interface IBasicComponentDefinition {
  caption?: string;
  /** Fractional width of the field (e.g. "S", "M", "L"). */
  size?: string;
  parent?: string;
}



export interface IComponentDefinition extends IBasicComponentDefinition {
  type: string;
  options?: any[];
}
