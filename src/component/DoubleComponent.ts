import IScreenReaderWriter from "../contract/IScreenReaderWriter";
import { ScreenBasicFieldTypes } from "../contract/IScreenWriter";
import BasicComponent from "./BasicComponent";

export default class DoubleComponent extends BasicComponent {
  constructor(readerWriter: IScreenReaderWriter) {
    super(readerWriter, ScreenBasicFieldTypes.Double);
  }
}
