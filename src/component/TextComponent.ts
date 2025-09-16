import { IScreenReaderWriter } from "../contract/IScreenReaderWriter";
import { ScreenBasicFieldTypes } from "../contract/IScreenWriter";
import { BasicComponent } from "./BasicComponent";
import { ComponentSchemaProperty } from "./ComponentSchema";

export class TextComponent extends BasicComponent {
  constructor(readerWriter: IScreenReaderWriter, property: ComponentSchemaProperty) {
    super(readerWriter, property, ScreenBasicFieldTypes.Text);
  }
}
