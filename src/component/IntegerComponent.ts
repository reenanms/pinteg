import IScreenReaderWriter from "../contract/IScreenReaderWriter";
import BasicComponent from "./BasicComponent";

export default class IntegerComponent extends BasicComponent {
  constructor(readerWriter: IScreenReaderWriter) {
    super(readerWriter, "integer");
  }
}
