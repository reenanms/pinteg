import IScreenReaderWriter from "../contract/IScreenReaderWriter";
import BasicComponent from "./BasicComponent";

export default class TextComponent extends BasicComponent {
  constructor(readerWriter: IScreenReaderWriter) {
    super(readerWriter, "text");
  }
}
