import IComponent from "../contract/IComponent"
import IComponentSize from "../contract/IComponentSize"
import IScreenWriter from "../contract/IScreenWriter"

export default class TextComponent implements IComponent {
  public name: string = "";
  public type: string = "string";
  public caption: string = "";
  public size: IComponentSize;

  public build(writer: IScreenWriter): void {
    const html =
    `<label for="${this.name}">${this.caption}:</label>
     <input type="text" id="${this.name}" />`;
    
     let ddd = this.size.width;
     ddd += 10;
     
     writer.addDefinition(html);
  }
}
