
export default interface IScreenReader {
  getValueByElementName(name: string): any;
  addListener(name: string, callback: (name: string, newValue: any) => void): void;
}
