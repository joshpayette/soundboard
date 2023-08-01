// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'electron-store-get'
  | 'electron-store-set'
  | 'get-selected-device-id'
  | 'set-selected-device-id';

export interface Store {
  selectedDeviceId: string;
  soundFolders: string[];
  activeFolders: string[];
}

export type StoreKeys = keyof Store;

const electronHandler = {
  store: {
    get(key: StoreKeys) {
      return ipcRenderer.sendSync('electron-store-get', key);
    },
    set(key: StoreKeys, value: string) {
      ipcRenderer.send('electron-store-set', key, value);
    },
  },
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
