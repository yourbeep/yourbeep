import { AppHeader } from '@/components/navigation/app-header';

interface DashboardHeaderProps {
  greeting?: string;
  name: string;
  onNotificationPress?: () => void;
  subtitle?: string;
}

export function DashboardHeader({
  greeting = 'Good Evening,',
  name,
  onNotificationPress,
  subtitle = "Let's check in with your current state",
}: DashboardHeaderProps) {
  return (
    <AppHeader
      highlight={name}
      onNotificationPress={onNotificationPress}
      subtitle={subtitle}
      title={greeting}
      variant="home"
    />
  );
}
