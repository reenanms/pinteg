import { IComponentDefinition } from "../contract/IComponentDefinition";

export type ComponentSchemaProperty = [string, IComponentDefinition];
export type ComponentSchema = Record<string, IComponentDefinition>;