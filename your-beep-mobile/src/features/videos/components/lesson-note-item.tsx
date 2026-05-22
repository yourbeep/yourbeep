import { Text, View } from 'react-native';

interface LessonNoteItemProps {
  body: string;
  title: string;
}

export function LessonNoteItem({ body, title }: LessonNoteItemProps) {
  return (
    <View className="flex-row items-start gap-3">
      <View className="mt-2 h-2.5 w-2.5 rounded-full bg-[#67F1D2]" />
      <View className="flex-1 gap-1">
        <Text className="font-poppinsSemi text-[15px] leading-[22px] text-brand-text">{title}</Text>
        <Text className="font-poppinsRegular text-[14px] leading-[22px] text-brand-textSecondary">
          {body}
        </Text>
      </View>
    </View>
  );
}
