import { IComponentSize } from "../contract/IComponentSize";
import { AreaOrientation } from "../contract/IScreenWriter";
import { Theme, themes } from "./Themes";


export class StyleFactory {
  private static registerStyle(document: Document, id: string, content: string) {
    if (document.getElementById(id))
      return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = content;
    document.head.appendChild(style);
  }

  private static registerStyleClass(document: Document, id: string, content: string) {
    StyleFactory.registerStyle(document, id, `.${id} ${content}`);
  }

  private static themeToStyle(theme: Theme): string {
    return `{
      ${Object.entries(theme.properties)
        .map(([key, value]) => `--${key}: ${value};`)
        .join('\n')}
      }`;
  }

  public static themes(document: Document) {
    const id = 'themes-style';
    const rootContent = `:root ${StyleFactory.themeToStyle(themes[0])}`;
    const classContent = themes
      .slice(1)
      .map(theme => `.${theme.id} ${StyleFactory.themeToStyle(theme)}`)
      .join('\n');

    this.registerStyle(document, id, `${rootContent}\n${classContent}`);
  }

  public static areaOrientation(document: Document, orientation: AreaOrientation) {
    const name = `area-orientation-${orientation}`;
    const flexDirection = orientation === AreaOrientation.horizontal ? 'row' : 'column';
    const content = `{
      display: flex;
      flex-direction: ${flexDirection};
    }`; //TODO: review, flex-wrap: wrap;
    this.registerStyleClass(document, name, content);
    return name;
  }

  public static inputWidth(document: Document, size: IComponentSize) {
    const name = `input-width-${size.name}`;
    const content = `{
      width: calc(var(--input-width) * ${size.width});
    }`;
    this.registerStyleClass(document, name, content);
    return name;
  }

  public static table(document: Document) {
    const id = `table-style`;
    const content = `.${id} {
      width: 100%;
      border-radius: var(--table-radius);
      border-collapse: collapse;
      border-spacing: 0;
      overflow: hidden;
      margin-top: 20px;
      font-size: var(--font-size);
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .${id} thead {
      background-color: var(--color-surface-alt);
    }

    .${id} th {
      text-align: left;
      padding: 12px 15px;
      border-bottom: 1px solid var(--color-border-subtle);
      font-weight: bold;
    }

    .${id} td {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
    }

    .${id} tbody tr:hover {
      background-color: var(--color-surface-hover);
    }

    .${id} tbody tr:hover td {
      background: var(--color-focus-background);
       /* border-bottom-color: transparent; Remove border on hover for seamless look */
       /* border-color: transparent; */
    }`;

    this.registerStyle(document, id, content);
    return id;
  }

  public static label(document: Document) {
    const id = `label-style`;
    const content = `.${id} {
      font-size: calc(var(--font-size) - 2px);
      margin-bottom: 5px;
    }`;

    this.registerStyle(document, id, content);
    return id;
  }

  public static input(document: Document) {
    const id = `input-style`;
    const content = `.${id} {
      height: var(--input-height);
      border-radius: var(--input-radius);
      border: 1px solid var(--color-border);
      margin: 1px;
      padding: var(--input-padding);
      font-size: var(--font-size);
      background: var(--color-surface);
      color: var(--color-text);
      box-sizing: border-box;      /* inclui padding e border na largura/altura */
      appearance: none;            /* remove estilo padrão de select */
      -webkit-appearance: none;
      -moz-appearance: none;
    }`;

    this.registerStyle(document, id, content);
    return id;
  }

  public static select(document: Document) {
    const id = `select-style`;
    const content = `.${id} {
      height: var(--input-height);
      border-radius: var(--input-radius);
      border: 1px solid var(--color-border);
      margin: 1px;
      padding: var(--input-padding);
      font-size: var(--font-size);
      background: var(--color-surface) url('data:image/svg+xml;utf8,<svg fill="%23333" height="10" viewBox="0 0 10 10" width="10" xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 10,0 5,6"/></svg>') no-repeat right 10px center;
      background-size: 10px;
      color: var(--color-text);
      box-sizing: border-box;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
    }`;

    this.registerStyle(document, id, content);
    return id;
  }

  public static tableInput(document: Document) {
    const id = `table-input-style`;
    const content = `.${id} {
        height: var(--input-height);
        border: none; /* Remove all borders by default */
        border-bottom: 0px solid var(--color-border-subtle); /* Re-apply bottom border here */
        
        border-radius: var(--table-radius);
        
        border-collapse: separate;
        border-spacing: 0;
        
        
        font-size: var(--font-size);

        padding: var(--input-padding);
        background-color: transparent;
        border-radius: 0;
        font-size: inherit;
        /* color: inherit; */
        color: var(--color-text);
        box-sizing: border-box;
    }
        
    .${id}:focus {
        outline: none;
        border: 0px solid var(--color-focus-border); /* A distinct focus color */
        background-color: var(--color-focus-background);
    }`;

    this.registerStyle(document, id, content);
    return id;
  }

  public static root(document: Document) {
    const id = `root-style`;
    const content = `.${id} {
      background: var(--color-background);
      color: var(--color-text);
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      /* justify-content: center; */
      /* min-height: 100vh; */
      transition: background 0.3s, color 0.3s;
    }`;

    this.registerStyle(document, id, content);
    return id;
  }
}
