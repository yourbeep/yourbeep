import { Image, Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { optionToneClasses, type AwarenessOption } from '@/features/awareness/data/awareness-content';
import { useAppTheme } from '@/theme/use-app-theme';

interface AwarenessOptionCardProps {
  onPress: () => void;
  option: AwarenessOption;
  selected?: boolean;
}

export function AwarenessOptionCard({
  onPress,
  option,
  selected = false,
}: AwarenessOptionCardProps) {
  const { colors, isDark } = useAppTheme();
  const cardStyle = selected
    ? {
        borderColor: colors.accent,
        borderWidth: 2,
        transform: [{ scale: 0.995 }] as const,
      }
    : {
        borderColor: isDark ? 'rgba(255,255,255,0.12)' : '#D9D9CC',
        borderWidth: 1,
      };

  return (
    <Pressable
      className={`min-h-[204px] w-full overflow-hidden rounded-[32px] border p-3 ${optionToneClasses[option.tone]}`}
      onPress={onPress}
      style={cardStyle}
    >
      <View
        className="self-center overflow-hidden rounded-[22px]"
        style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.58)' }}
      >
        {option.imageSource ? (
          <Image resizeMode="cover" source={option.imageSource} style={{ height: 133, width: 170 }} />
        ) : (
          <View
            className="items-center justify-center rounded-[22px]"
            style={{ backgroundColor: `${option.accent}18`, height: 133, width: 170 }}
          >
            <Text className="text-center font-poppinsSemi text-[17px]" style={{ color: option.accent }}>
              {option.title
                .split(' ')
                .map((word) => word[0])
                .join('')}
            </Text>
          </View>
        )}
      </View>

      {selected ? (
        <View className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: colors.primary }}>
          <Check color="#FEFEE5" size={18} strokeWidth={2.3} />
        </View>
      ) : null}

      <View className="items-center px-1 pb-1 pt-4">
        <Text className="text-center font-poppinsSemi text-[14px] leading-[18px] uppercase tracking-[0.8px]" style={{ color: colors.accent }}>
          {option.title}
        </Text>
        {option.description ? (
          <Text className="mt-2 text-center font-poppinsRegular text-[12px] leading-[18px]" style={{ color: colors.textSecondary }}>
            {option.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
