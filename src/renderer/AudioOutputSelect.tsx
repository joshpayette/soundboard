interface AudioOutputSelectProps {
  audioOutputDevices: MediaDeviceInfo[];
  audioOutputDeviceId: string;
  onAudioOutputDeviceChange: (deviceId: string) => void;
}

export default function AudioOutputSelect({
  audioOutputDeviceId,
  audioOutputDevices,
  onAudioOutputDeviceChange,
}: AudioOutputSelectProps) {
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
          defaultValue={audioOutputDeviceId}
          onChange={() => onAudioOutputDeviceChange('')}
        >
          {audioOutputDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
