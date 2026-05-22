import { LucideIcon } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';

import { useAppTheme } from '@/theme/use-app-theme';

interface DomainPillProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  selected?: boolean;
}

export function DomainPill({ icon: Icon, label, onPress, selected = false }: DomainPillProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <Pressable
      className="min-h-[42px] flex-1 flex-row items-center gap-2 rounded-[12px] border px-3"
      onPress={onPress}
      style={{
        backgroundColor: selected ? (isDark ? colors.accentSoft : '#DFF6EB') : colors.surface,
        borderColor: selected ? colors.accent : colors.primaryBorder,
      }}
    >
      <Icon color={selected ? colors.accent : colors.textSecondary} size={16} strokeWidth={1.8} />
      <Text className="font-poppinsMedium text-[13px]" style={{ color: selected ? colors.textPrimary : colors.textSecondary }}>
        {label}
      </Text>
    </Pressable>
  );
}
