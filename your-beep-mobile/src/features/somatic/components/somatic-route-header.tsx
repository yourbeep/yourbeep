import { AppHeader } from '@/components/navigation/app-header';

interface SomaticRouteHeaderProps {
  onBackPress: () => void;
}

export function SomaticRouteHeader({ onBackPress }: SomaticRouteHeaderProps) {
  return <AppHeader onBackPress={onBackPress} subtitle="" title="Somatic states" />;
}
