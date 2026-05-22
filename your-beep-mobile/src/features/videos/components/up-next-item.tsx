import { Text, View } from 'react-native';
import { ChevronRight, Lock, PlayCircle } from 'lucide-react-native';

interface UpNextItemProps {
  locked?: boolean;
  module: string;
  title: string;
}

export function UpNextItem({ locked = false, module, title }: UpNextItemProps) {
  return (
    <View className="flex-row items-center gap-3 py-2">
      <View className="h-7 w-7 items-center justify-center rounded-full border border-brand-primaryBorder bg-brand-surface">
        {locked ? (
          <Lock color="#C7C7C7" size={13} strokeWidth={2} />
        ) : (
          <PlayCircle color="#9BA3B0" size={14} strokeWidth={2} />
        )}
      </View>

      <View className="flex-1 gap-1">
        <Text className="font-poppinsMedium text-[10px] tracking-[0.6px] text-brand-textMuted">
          {module}
        </Text>
        <Text
          className={`font-poppinsMedium text-[15px] ${
            locked ? 'text-[#B8B8B8]' : 'text-brand-text'
          }`}
        >
          {title}
        </Text>
      </View>

      <ChevronRight color={locked ? '#D7D7D7' : '#A7A7A7'} size={18} strokeWidth={2} />
    </View>
  );
}
