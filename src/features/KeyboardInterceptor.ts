import type { Device, Interception, Stroke } from 'node-interception';
import { FilterKeyState } from 'node-interception';
import Logger from './Logger';

type KeystrokeCallbackFn = (keystroke: Stroke) => unknown;

type CancelKey = {
  code: number;
  label: string;
};

export type KeyboardDevice = Device<Stroke>;

export interface KeyboardInterceptorOptions {
  cancelKey?: CancelKey;
  selectedKeyboard?: KeyboardDevice;
}

const DEFAULT_CANCEL_KEY: CancelKey = {
  code: 1,
  label: 'ESC',
};

export class KeyboardInterceptor {
  private interception: Interception;

  private devices: Array<KeyboardDevice>;

  private selectedKeyboard: KeyboardDevice;

  private cancelKey: CancelKey;

  private onKeystroke: KeystrokeCallbackFn;

  constructor(
    onKeystroke: KeystrokeCallbackFn,
    options?: KeyboardInterceptorOptions
  ) {
    this._interception = new Interception();
    this._devices = this._interception.getKeyboards();
    this.onKeystroke = onKeystroke;

    // options handling
    this.cancelKey = options?.cancelKey
      ? options.cancelKey
      : DEFAULT_CANCEL_KEY;
    this._selectedKeyboard = options?.selectedKeyboard
      ? options.selectedKeyboard
      : null;
  }

  public get devices(): Array<KeyboardDevice> {
    return this._devices;
  }

  public get selectedKeyboard(): KeyboardDevice {
    return this._selectedKeyboard;
  }

  public set selectedKeyboard(device: KeyboardDevice) {
    this._selectedKeyboard = device;
  }

  /**
   * Listens for a keypress and returns the keyboard device detected.
   * @returns KeyboardDevice
   */
  public async detectKeyboard(): Promise<KeyboardDevice> {
    Logger.info(
      'Press any key to generate strokes on the keyboard you want to intercept.'
    );
    Logger.info(
      `Press ${this.cancelKey.label} to cancel the keyboard detection.`
    );
    Logger.info(
      'NOTE: This keyboard will be unusable outside of this app while the app is running.'
    );

    this._interception.setFilter('keyboard', FilterKeyState.DOWN);
    const device = await this._interception.wait();
    const stroke = device?.receive();

    return new Promise((resolve, reject) => {
      if (device && stroke) {
        if (stroke.type === 'keyboard' && stroke.code === this.cancelKey.code) {
          this.stop();
          reject(new Error('Keyboard detection cancelled by user.'));
        }

        Logger.info('Keyboard detected.', device);
        resolve(device);
      }
      reject(new Error('Keyboard not detected.'));
    });
  }

  /**
   * Starts listening for keystrokes to intercept keypresses on this._selectedKeyboard.
   * All other keyboards will have their keystrokes passed through unintercepted.
   */
  public async start(): Promise<void> {
    Logger.info('Keys are now being intercepted on the selected keyboard.');
    Logger.info(
      `Press ${this.cancelKey.label} at any point to exit the interception and restore control to the keyboard.`
    );

    // Start listening to keystrokes
    this._interception.setFilter('keyboard', FilterKeyState.DOWN);

    try {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const device = await this._interception.wait();
        const stroke = device?.receive();

        if (!stroke || !device) {
          break;
        }

        // Stop intercepting if the cancel key is pressed.
        if (stroke.type === 'keyboard' && stroke.code === this.cancelKey.code) {
          this.stop();
          break;
        }

        // If the selected keyboard is not the one being intercepted, pass the stroke through.
        if (device.id !== this._selectedKeyboard?.id) {
          device.send(stroke);
        } else {
          // Pass the keystroke to the callback function.
          this.onKeystroke(stroke);
        }
      }
    } catch (e) {
      Logger.error(e);
      this.stop();
    }
  }

  /**
   * Stops all keyboard interception.
   */
  public stop(): void {
    Logger.info('Stop interception request received.');
    this._interception.setFilter('keyboard', FilterKeyState.NONE);
    this._interception.destroy();
  }
}
