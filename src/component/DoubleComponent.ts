import IScreenReaderWriter from "../contract/IScreenReaderWriter";
import BasicComponent from "./BasicComponent";

export default class DoubleComponent extends BasicComponent {
  constructor(readerWriter: IScreenReaderWriter) {
    super(readerWriter, "double");
  }
}
