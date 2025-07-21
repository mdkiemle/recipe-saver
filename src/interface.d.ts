export interface IElectronAPI {
  previewComponent: Promise<string, any>;s
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}