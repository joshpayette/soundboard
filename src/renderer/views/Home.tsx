import { SelectAudioOutput } from '@/components/SelectAudioOutput';
import { SelectSoundFolders } from '@/components/SelectSoundFolders';

export default function HomeView() {
  return (
    <div>
      <SelectAudioOutput />
      <SelectSoundFolders />
    </div>
  );
}
