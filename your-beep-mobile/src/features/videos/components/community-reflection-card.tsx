import { Text, View } from 'react-native';

interface CommunityReflectionCardProps {
  body: string;
  user: string;
}

export function CommunityReflectionCard({ body, user }: CommunityReflectionCardProps) {
  return (
    <View className="gap-3 rounded-[18px] border border-brand-primaryBorder bg-[#F8F7F0] p-4">
      <Text className="font-poppinsSemi text-[10px] tracking-[0.7px] text-brand-success">
        {user}
      </Text>
      <View className="rounded-[14px] bg-brand-surface p-4">
        <Text className="font-poppinsRegular text-[14px] leading-[28px] text-brand-textSecondary">
          {body}
        </Text>
      </View>
    </View>
  );
}
