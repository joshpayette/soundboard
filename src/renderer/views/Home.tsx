import { SelectAudioOutput } from '@/components/SelectAudioOutput';
import { SelectSoundFolder } from '@/components/SelectSoundFolder';

export default function HomeView() {
  return (
    <div>
      <SelectAudioOutput />
      <SelectSoundFolder />
    </div>
  );
}
