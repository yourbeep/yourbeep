import { HeartChestOpeningScreen } from '@/features/somatic/screens/heart-chest-opening-screen';

export function ChestSternumPecScreen() {
  return (
    <HeartChestOpeningScreen
      chipLabel="Vagal Tone Active"
      finishRoute="/somatic-states"
      subtitle="Open the thoracic cavity to release somatic bracing. Focus on the lengthening of the pectoral fibers."
    />
  );
}
