// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export interface Store {
  selectedDeviceId: string;
  soundFolders: string[];
  activeFolders: string[];
}
export type StoreKeys = keyof Store;
const store = {
  get(key: StoreKeys) {
    return ipcRenderer.sendSync('electron-store-get', key);
  },
  set(key: StoreKeys, value: string) {
    ipcRenderer.send('electron-store-set', key, value);
  },
};

export type RendererKeys =
  | 'electron-store-get'
  | 'electron-store-set'
  | 'select-sound-folder';
const renderer = {
  sendMessage(channel: RendererKeys, ...args: unknown[]) {
    ipcRenderer.send(channel, ...args);
  },
  on(channel: RendererKeys, func: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      func(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  once(channel: RendererKeys, func: (...args: unknown[]) => void) {
    ipcRenderer.once(channel, (_event, ...args) => func(...args));
  },
};

const electronHandler = {
  store,
  ipcRenderer: renderer,
};
export type ElectronHandler = typeof electronHandler;
contextBridge.exposeInMainWorld('electron', electronHandler);
