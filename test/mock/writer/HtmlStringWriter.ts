import IHtmlWriter from "../../../src/contract/IHtmlWriter";

export default class HtmlStringWriter implements IHtmlWriter{
  private html: string;

  public constructor() {
    this.html = "";
  }

  public addNewLine(): void {
    this.html += "<br />";
  }

  public addHtml(html: string): void {
    this.html += html;
  }

  public getHtml(): string {
	return this.html;
  }
}
