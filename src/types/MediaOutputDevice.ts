import Logger from './Logger';

export default class MediaOutputDevice extends MediaDeviceInfo {
  /**
   * Returns all audio output devices.
   */
  public static async getOutputDevices(): Promise<MediaDeviceInfo[]> {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const outputDevices = devices.filter(
            (device) => device.kind === 'audiooutput'
          );
          return resolve(outputDevices);
        })
        .catch((error) => {
          Logger.error(error);
          reject(error);
        });
    });
  }
}
