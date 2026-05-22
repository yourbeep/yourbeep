import { Text, View, Pressable } from 'react-native';
import {
  CircleDot,
  Infinity,
  Shield,
  Droplets,
  Sparkles,
  Waves,
} from 'lucide-react-native';

import type { HandsLegsStateId } from '@/features/somatic/store/somatic-slice';
import { useAppTheme } from '@/theme/use-app-theme';

interface HandsLegsStateCardProps {
  onPress: () => void;
  selected: boolean;
  stateId: HandsLegsStateId;
  title: string;
}

function StateIcon({ stateId }: { stateId: HandsLegsStateId }) {
  const common = { size: 20, strokeWidth: 2 };

  if (stateId === 'calm') return <Waves color="#5E88E2" {...common} />;
  if (stateId === 'springy') return <Infinity color="#2CCB8E" {...common} />;
  if (stateId === 'braced') return <Shield color="#D19938" {...common} />;
  if (stateId === 'sluggish') return <Droplets color="#9AA3B4" {...common} />;
  if (stateId === 'contracted') return <Sparkles color="#E07062" {...common} />;
  return <CircleDot color="#F0A24D" {...common} />;
}

const toneStyles: Record<HandsLegsStateId, { bg: string; border: string; iconBg: string }> = {
  braced: { bg: '#FFEBCB', border: '#F0D9A7', iconBg: '#FFF3DF' },
  calm: { bg: '#E6F0FF', border: '#C7DCF8', iconBg: '#F2F7FF' },
  contracted: { bg: '#FFD8CD', border: '#F3BFB1', iconBg: '#FFE9E3' },
  fidgety: { bg: '#FFE3BC', border: '#F3C78D', iconBg: '#FFF1DE' },
  sluggish: { bg: '#F4F2E3', border: '#E7E0C1', iconBg: '#FBFAF1' },
  springy: { bg: '#DDF8D9', border: '#BFE7B9', iconBg: '#EFFFEA' },
};

export function HandsLegsStateCard({
  onPress,
  selected,
  stateId,
  title,
}: HandsLegsStateCardProps) {
  const { colors, isDark } = useAppTheme();
  const tone = toneStyles[stateId];

  return (
    <Pressable
      className="h-[132px] rounded-[20px] border px-4 py-4"
      onPress={onPress}
      style={{
        backgroundColor: isDark ? colors.surface : tone.bg,
        borderColor: selected ? colors.primary : isDark ? colors.primaryBorder : tone.border,
        borderWidth: selected ? 2 : 1,
      }}
    >
      <View className="items-center gap-5">
        <View
          className="h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: tone.iconBg }}
        >
          <StateIcon stateId={stateId} />
        </View>
        <Text className="font-poppinsMedium text-[15px]" style={{ color: colors.textPrimary }}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
