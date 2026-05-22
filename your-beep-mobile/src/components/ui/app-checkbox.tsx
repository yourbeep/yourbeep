import { Pressable, Text, View } from 'react-native';

interface AppCheckboxProps {
  checked: boolean;
  label: string;
  onPress: () => void;
}

export function AppCheckbox({ checked, label, onPress }: AppCheckboxProps) {
  return (
    <Pressable className="flex-row items-start gap-3" onPress={onPress}>
      <View
        className={`mt-0.5 h-5 w-5 items-center justify-center rounded-[8px] border ${
          checked
            ? 'border-brand-primary bg-brand-primary'
            : 'border-brand-primaryBorder bg-brand-surface'
        }`}
      >
        {checked ? (
          <Text className="font-poppinsSemi text-[12px] text-brand-textInverse">✓</Text>
        ) : null}
      </View>

      <Text className="font-poppinsRegular flex-1 text-[13px] leading-5 text-brand-text">
        {label}
      </Text>
    </Pressable>
  );
}
