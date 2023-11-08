import { useState, useEffect } from 'react';
import { z } from 'zod';

function handleSelectSoundFolder() {
  if (!window) return;
  window.electron.ipcRenderer.sendMessage('select-sound-folder');
}

export default function SelectSoundFolders() {
  const [soundFolders, setSoundFolders] = useState<string[]>([]);

  useEffect(() => {
    if (!window) return;

    const folders = window.electron.store.get('soundFolders');
    console.info('folders', folders);

    window.electron.ipcRenderer.once('select-sound-folder', (filePaths) => {
      if (!filePaths) {
        console.error('No filePaths returned.');
        return;
      }

      const filePathsSchema = z.array(z.string()).safeParse(filePaths);
      if (!filePathsSchema.success) {
        console.error('Invalid filePaths returned.');
        return;
      }
      const safeFilePaths = filePathsSchema.data;

      const newSoundFolders = [...soundFolders];
      safeFilePaths.forEach((filePath) => {
        if (newSoundFolders.includes(filePath)) return;
        newSoundFolders.push(filePath);
      });
      setSoundFolders(newSoundFolders);
    });
  }, [soundFolders]);

  return (
    <div>
      <button
        type="button"
        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={handleSelectSoundFolder}
      >
        Add Sound Folder
      </button>
      <ul>
        {soundFolders.map((soundFolder) => (
          <li key={soundFolder}>{soundFolder}</li>
        ))}
      </ul>
    </div>
  );
}

export { SelectSoundFolders };
