import { Pressable, Text, TextInput, View } from 'react-native';

interface AppInputProps {
  label: string;
  onChangeText?: (value: string) => void;
  onTrailingPress?: () => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  trailingLabel?: string;
  value?: string;
}

export function AppInput({
  label,
  onChangeText,
  onTrailingPress,
  placeholder,
  secureTextEntry,
  trailingLabel,
  value,
}: AppInputProps) {
  return (
    <View className="gap-2">
      <Text className="font-poppinsSemi text-[12px] uppercase tracking-[0.7px] text-brand-primary">
        {label}
      </Text>

      <View className="min-h-12 flex-row items-center rounded-[18px] bg-brand-surfaceStrong px-4">
        <TextInput
          className="font-poppinsRegular flex-1 py-3 text-base text-brand-text"
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#82939A"
          secureTextEntry={secureTextEntry}
          value={value}
        />

        {trailingLabel ? (
          <Pressable className="pl-3" onPress={onTrailingPress}>
            <Text className="font-poppinsMedium text-[13px] text-brand-textSecondary">
              {trailingLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
