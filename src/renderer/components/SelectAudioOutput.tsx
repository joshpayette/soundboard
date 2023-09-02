import { useEffect, useState } from 'react';

/**
 * Returns a list of audio devices available on the system.
 */
export const useListAudioDevices = (): [audioDevices: MediaDeviceInfo[]] => {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    async function getAudioDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const onlyAudioDevices = devices.filter(
        (device) => device.kind === 'audiooutput'
      );
      setAudioDevices(onlyAudioDevices);
    }
    getAudioDevices();
  }, []);

  return [audioDevices];
};

/**
 * A select input for choosing an audio output device from a list of available
 * devices on the system.
 */
export function SelectAudioOutput() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(() =>
    window.electron.store.get('selectedDeviceId')
  );

  const [audioDevices] = useListAudioDevices();

  const handleAudioDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    window.electron.store.set('selectedDeviceId', deviceId);
  };

  return (
    <div>
      <label
        htmlFor="audioOutputDevice"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Audio Output Device
        <select
          id="audioOutputDevice"
          name="audioOutputDevice"
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => handleAudioDeviceChange(event.target.value)}
          value={selectedDeviceId}
        >
          {audioDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
