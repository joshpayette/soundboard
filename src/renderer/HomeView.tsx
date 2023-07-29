import { useState, useEffect } from 'react';
import AudioOutputSelect from './AudioOutputSelect';

export default function HomeView() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedOutputDeviceId, setSelectedOutputDeviceId] =
    useState<string>('');

  useEffect(() => {
    async function getOutputDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const onlyAudioDevices = devices.filter(
        (device) => device.kind === 'audiooutput'
      );
      console.info(`Found ${onlyAudioDevices.length} audio output devices`);
      setOutputDevices(onlyAudioDevices);
    }
    getOutputDevices();
  }, []);

  const handleAudioOutputDeviceChange = (deviceId: string) => {
    console.info(`Selected audio output device: ${deviceId}`);
    setSelectedOutputDeviceId(deviceId);
  };

  return (
    <div>
      <AudioOutputSelect
        audioOutputDevices={outputDevices}
        audioOutputDeviceId={selectedOutputDeviceId}
        onAudioOutputDeviceChange={handleAudioOutputDeviceChange}
      />
    </div>
  );
}
