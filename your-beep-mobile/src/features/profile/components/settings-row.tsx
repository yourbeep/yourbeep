import { Pressable, Switch, Text, View } from 'react-native';
import { ChevronRight, Globe, Headset, History, Moon, Shield, Ticket, WalletCards } from 'lucide-react-native';
import { useAppTheme } from '@/theme/use-app-theme';

type TrailingType = 'chevron' | 'switch';

interface SettingsRowProps {
  enabled?: boolean;
  label: string;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  trailing: TrailingType;
}

function SettingsIcon({ label }: { label: string }) {
  const { colors } = useAppTheme();
  const iconColor = colors.textSecondary;

  if (label === 'Dark Mode') {
    return <Moon color={iconColor} size={18} strokeWidth={2} />;
  }

  if (label === 'Privacy Settings') {
    return <Shield color={iconColor} size={18} strokeWidth={2} />;
  }

  if (label === 'Currency') {
    return <WalletCards color={iconColor} size={18} strokeWidth={2} />;
  }

  if (label === 'Activity Log') {
    return <History color={iconColor} size={18} strokeWidth={2} />;
  }

  if (label === 'Help & Support') {
    return <Headset color={iconColor} size={18} strokeWidth={2} />;
  }

  if (label === 'Raise Ticket') {
    return <Ticket color={iconColor} size={18} strokeWidth={2} />;
  }

  return <Globe color={iconColor} size={18} strokeWidth={2} />;
}

export function SettingsRow({
  enabled = false,
  label,
  onPress,
  onToggle,
  trailing,
}: SettingsRowProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      className="flex-row items-center justify-between px-4 py-4"
      onPress={trailing === 'chevron' ? onPress : undefined}
    >
      <View className="flex-row items-center gap-3">
        <SettingsIcon label={label} />
        <Text className="font-poppinsMedium text-[15px]" style={{ color: colors.textPrimary }}>
          {label}
        </Text>
      </View>

      {trailing === 'switch' ? (
        <Switch
          ios_backgroundColor="#D6D6D6"
          thumbColor="#FFFFFF"
          onValueChange={onToggle}
          trackColor={{ false: '#D6D6D6', true: colors.primary }}
          value={enabled}
        />
      ) : (
        <ChevronRight color={colors.textMuted} size={18} strokeWidth={2} />
      )}
    </Pressable>
  );
}
