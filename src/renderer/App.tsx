import { useEffect, useState } from 'react';
import Logger from 'features/Logger';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import 'tailwindcss/tailwind.css';

function Hello() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    async function getOutputDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const onlyAudioDevices = devices.filter(
        (device) => device.kind === 'audiooutput'
      );
      Logger.info(`Found ${onlyAudioDevices.length} audio output devices`);
      setOutputDevices(onlyAudioDevices);
    }
    getOutputDevices();
  }, []);

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
