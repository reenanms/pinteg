export enum ViewMode {
  Multiple = 'multiple',
  Single = 'single',
}

export class BuildConfig {
  readonly: boolean = false;
  mode: ViewMode = ViewMode.Single;
}

export interface IComponent {
  build(config: BuildConfig): void;
  writeValue(value: any): void;
  readValue(): any;
}