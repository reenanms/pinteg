import { IComponentDefinition } from "./IComponentDefinition";

export type ComponentSchemaProperty = [string, IComponentDefinition];
export type ComponentSchema = Record<string, IComponentDefinition>;